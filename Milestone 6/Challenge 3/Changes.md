# TokenApp Security Audit and Fixes

## Vulnerability Audit

**Routes Tested Without Token (Before Any Fix):**

| Route | HTTP Method | Status Code | Data Returned | Issue |
|-------|------------|-------------|----------------|-------|
| /api/tasks/:id | GET | 500 or error | N/A | Missing auth, req.user undefined |
| /api/tasks/:id | DELETE | 500 or error | N/A | Missing auth, req.user undefined |
| /api/admin/users | GET | 200 | All users (minus passwords) | ✅ Unprotected - returns sensitive data |
| /api/admin/users/:id | DELETE | 200 | Success message | ✅ Unprotected - allows deletion |

---

## Root Cause Analysis

### Bug 1: Token Generation Issues
**File:** `controllers/authController.js`, lines 29-34

**Specific Code:**
```javascript
const token = jwt.sign(
    { id: user._id },      // ❌ Missing email and role fields
    'mysecretkey',         // ❌ Hardcoded secret — not from process.env
                           // ❌ No expiresIn — token never expires
);
```

**What Is Wrong:**
1. Payload only contains `id` field; missing `email` and `role` - route handlers that need role-based access won't have this data
2. Secret is hardcoded string `'mysecretkey'` instead of `process.env.JWT_SECRET` - exposed in source code, same across all deployments
3. No `expiresIn` option - tokens valid forever, no expiration

**Why It Causes the Symptom:**
- Routes trying to access `req.user.role` will fail silently
- Anyone who sees this source code can forge valid tokens
- Compromised tokens can be used indefinitely

---

### Bug 2: Wrong Header Extraction
**File:** `middleware/authMiddleware.js`, line 4

**Specific Code:**
```javascript
const token = req.headers.token;
```

**What Is Wrong:**
1. Reading from `req.headers.token` instead of standard `req.headers.authorization`
2. Not stripping the "Bearer " prefix (standard HTTP header format is "Bearer <token>")
3. No check or response when header is missing

**Why It Causes the Symptom:**
- Client must send custom header `token: <token>` instead of standard `Authorization: Bearer <token>`
- Even if client sends correct header, Bearer prefix won't be stripped, leading to verification failure
- Missing token silently continues to next() instead of rejecting the request

---

### Bug 3: Next() Called in Catch Block
**File:** `middleware/authMiddleware.js`, lines 13-19

**Specific Code:**
```javascript
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
} catch (err) {
    // ❌ Bug 3: next() called in catch block
    next(); 
}
```

**What Is Wrong:**
1. `catch` block calls `next()` instead of sending a 401 error response
2. This allows invalid, malformed, or missing tokens to proceed to the route handler
3. Route handler receives `req.user = undefined`, leading to errors or unexpected behavior

**Why It Causes the Symptom:**
- All requests pass through, authenticated or not
- Route handlers that expect `req.user` to exist will fail with "Cannot read property of undefined"
- Security completely bypassed - middleware is useless

---

### Bug 4: Missing Middleware on Protected Routes
**File:** `routes/taskRoutes.js` and `routes/adminRoutes.js`

**Specific Code:**
```javascript
// taskRoutes.js - Missing authMiddleware on:
router.get('/tasks/:id', getTaskById);               // ❌ missing authMiddleware
router.delete('/tasks/:id', deleteTask);             // ❌ missing authMiddleware

// adminRoutes.js - Completely unprotected:
router.get('/admin/users', getAllUsers);             // ❌ no authMiddleware at all
router.delete('/admin/users/:id', deleteUser);       // ❌ no authMiddleware at all
```

**What Is Wrong:**
1. Four routes handle sensitive data without middleware protection:
   - `GET /api/tasks/:id` - returns specific task data
   - `DELETE /api/tasks/:id` - deletes a task
   - `GET /api/admin/users` - returns all users in system
   - `DELETE /api/admin/users/:id` - deletes any user

**Why It Causes the Symptom:**
- Anyone can call these endpoints without a token
- Anyone can see any task, delete any task, list all users, delete any user
- Admin endpoints especially critical - allows user enumeration and deletion

---

## What I Fixed

### Fix 1: Correct Token Generation

**Before (Broken):**
```javascript
const token = jwt.sign(
    { id: user._id },      
    'mysecretkey',         
);
```

**After (Fixed):**
```javascript
const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);
```

**What This Prevents:** Ensures tokens contain all necessary user data (id, email, role for role-based access), uses environment variable secret (not visible in code), and expires after 7 days so compromised tokens have limited window of use.

---

### Fix 2: Correct Middleware

**Before (Broken):**
```javascript
module.exports = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        // No error response - continues silently
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next();  // ❌ Allows bad tokens through
    }
};
```

**After (Fixed):**
```javascript
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    
    const token = authHeader.substring(7);  // Strip 'Bearer ' prefix
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
```

**What This Prevents:** Enforces standard HTTP Authorization header with Bearer token format, properly extracts token by stripping prefix, returns 401 status code when token missing (blocks unauthenticated requests), returns 401 when token invalid or expired (blocks compromised/tampered tokens), never calls next() in the catch block so bad tokens cannot proceed to route handlers.

---

### Fix 3: Apply Middleware to Every Protected Route

**Before (Broken) - taskRoutes.js:**
```javascript
router.get('/tasks/:id', getTaskById);               
router.delete('/tasks/:id', deleteTask);             
```

**After (Fixed) - taskRoutes.js:**
```javascript
router.get('/tasks/:id', authMiddleware, getTaskById);               
router.delete('/tasks/:id', authMiddleware, deleteTask);             
```

**Before (Broken) - adminRoutes.js:**
```javascript
router.get('/admin/users', getAllUsers);             
router.delete('/admin/users/:id', deleteUser);       
```

**After (Fixed) - adminRoutes.js:**
```javascript
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), getAllUsers);             
router.delete('/admin/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);       
```

**New Middleware - roleMiddleware.js:**
```javascript
module.exports = (requiredRole) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
};
```

**What This Prevents:** Ensures every route that returns or modifies sensitive data requires valid authentication AND proper authorization (role checks for admin routes), prevents unauthorized users from enumerating all users in the system, prevents unauthorized deletion of tasks or user accounts, ensures only authenticated admin users can access admin functions, implements defense-in-depth with both authentication and authorization layers.

---

## Verification Results

### Test Scenario 1: No Token

**Expected:** 401 Unauthorized  
**Actual:** 401 Unauthorized  
**Response:** `{ "message": "No token provided." }`  
**Screenshot:** 01-no-token.png  
**Result:** ✅ PASS

---

### Test Scenario 2: Fake Token

**Expected:** 401 Unauthorized  
**Actual:** 401 Unauthorized  
**Response:** `{ "message": "Invalid or expired token." }`  
**Screenshot:** 02-fake-token.png  
**Result:** ✅ PASS

---

### Test Scenario 3: Expired Token

**Expected:** 401 Unauthorized  
**Actual:** 401 Unauthorized  
**Response:** `{ "message": "Invalid or expired token." }`  
**Screenshot:** 03-expired-token.png  
**Result:** ✅ PASS

---

### Test Scenario 4: Valid Token

**Expected:** 200 OK with task/user data  
**Actual:** 200 OK with expected data  
**Response:** Array of user's tasks with correct data  
**Screenshot:** 04-valid-token.png  
**Result:** ✅ PASS

---

### Test Scenario 5: Valid Token, Wrong Role

**Expected:** 403 Forbidden (if role checks implemented)  
**Actual:** 403 Forbidden  
**Response:** `{ "message": "Insufficient permissions." }`  
**Screenshot:** 05-wrong-role.png  
**Result:** ✅ PASS

---

## Summary Table

| Test # | Scenario | Expected | Actual | Status |
|--------|----------|----------|--------|--------|
| 1 | No token on protected route | 401 | 401 | ✅ PASS |
| 2 | Invalid/fake token | 401 | 401 | ✅ PASS |
| 3 | Expired token | 401 | 401 | ✅ PASS |
| 4 | Valid token on protected route | 200 + data | 200 + data | ✅ PASS |
| 5 | Valid token but wrong role for admin route | 403 | 403 | ✅ PASS |

All five test scenarios pass successfully. The application now properly enforces:
- Token requirement on protected routes
- Token format validation (Bearer prefix stripping)
- Token expiration checking
- Successful authentication with valid tokens
- Role-based access control for admin endpoints

## What Happens if This Is Not Fixed

### Bug 1 Consequence: Forever Tokens + Exposed Secrets

If token generation remains broken with hardcoded secrets and no expiration, an attacker who gains access to the source code (common in GitHub leaks) can forge valid tokens with the same hardcoded secret. These tokens will be accepted forever since there's no expiry. A user who is deleted from the system, demoted from admin, or compromised remains authenticated indefinitely. An attacker can create tokens with arbitrary `id`, `email`, and `role` fields (or any fields they want), impersonating any user or role in the system. The hardcoded secret means every environment (dev, staging, production) uses the same token key.

### Bug 2 Consequence: Standard-Breaking Header Extraction

If the middleware continues reading from `req.headers.token` instead of `Authorization`, legitimate API clients using standard HTTP conventions will fail to authenticate. This forces non-standard client implementations, breaks compatibility with standard libraries like Postman, curl, and OAuth tools. An attacker can still bypass the check by not sending any header, and the check for "Bearer " prefix ensures that even if a token is present, it might not be stripped correctly, causing verification to fail and allowing the attacker to proceed through the broken catch block.

### Bug 3 Consequence: No Authentication Enforcement

With `next()` called in the catch block, invalid tokens pass through to route handlers. A user without a token (unauthenticated) gets `req.user = undefined`. The getTaskById handler accesses `req.user.id` (from the task-finding query), which is undefined, causing unpredictable behavior. An attacker can call `GET /api/tasks/:id` with no token and retrieve any task. The attacker can call `DELETE /api/tasks/:id` with no token and delete any task. The admin routes `GET /api/admin/users` and `DELETE /api/admin/users/:id` completely bypass authentication - anyone on the internet can list all users and delete them.

### Bug 4 Consequence: Unprotected Routes Expose Everything

With getTaskById, updateTask, and deleteTask not protected, an unauthenticated attacker can fetch, modify, and delete any task in the system. Admin routes getAllUsers and deleteUser completely open, allowing any attacker to enumerate all users, steal user IDs and emails, and delete user accounts. Task deletion without authentication allows mass data destruction. User deletion allows account takeover of legitimate users. Combined with Bug 3, the attacker doesn't even need to know what to send—just calling the endpoint without authentication succeeds.

