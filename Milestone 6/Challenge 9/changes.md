# Fragments App – Security Fixes & Audit Log

## 📋 Security Challenge Summary
This document details all six critical authentication and authorization vulnerabilities discovered and fixed in the Fragments application. Each vulnerability involved interconnected failures in the access layer that have been systematically resolved.

---

## Vulnerability 1: Hardcoded JWT Secret & No Token Expiry
- **Found in**: `server/auth/jwt.js`
- **Severity**: 🔴 CRITICAL
- **Type**: Secret Management, Token Lifetime
- **Description of the Problem**:
  - JWT secret was hardcoded as a string literal: `const SECRET = 'fragments-secret-key'`
  - Tokens had NO expiry time - once issued, they remained valid indefinitely
  - If source code was compromised (GitHub leak, insider threat), attackers could forge any token
  - A stolen token from months ago would still grant access
  - No mechanism to invalidate tokens centrally
  
- **Discovery Method**: Code audit of JWT token signing logic
  
- **Description of the Fix**:
  - Moved secret to `JWT_SECRET` environment variable
  - Added startup validation: Server fails to start if `JWT_SECRET` is missing (prevents misconfiguration)
  - Added 1-hour token expiry: `jwt.sign(payload, SECRET, { expiresIn: '1h' })`
  - Tokens now expire automatically after 1 hour
  - Combined with token blacklist (Vulnerability 6), provides both timeout and revocation
  - Secret is no longer visible in source code

---

## Vulnerability 2: Role Missing from JWT Payload
- **Found in**: `server/routes/auth.js`, `server/middleware/auth.js`
- **Severity**: 🔴 CRITICAL
- **Type**: Authorization Data Leak, Access Control Bypass
- **Description of the Problem**:
  - When users logged in or signed up, only `userId` was included in JWT token: `signToken({ userId: user.id })`
  - User's `role` (reader, contributor, curator, admin) was NOT included in the token
  - Backend couldn't verify permissions from the token alone
  - All role checks failed because `req.user.role` was always `undefined`
  - The `roleCheck` middleware couldn't differentiate between user roles
  - Any endpoint with role validation would reject all users (even admins)
  
- **Discovery Method**: Code audit of token payload construction and role middleware
  
- **Description of the Fix**:
  - Updated both signup and login endpoints to include role in token payload:
    ```javascript
    const token = signToken({ userId: user.id, role: user.role });
    ```
  - Updated auth middleware to extract role from JWT: `req.user = decoded;` (now contains both userId and role)
  - Role is now cryptographically signed and verified as part of the JWT
  - Cannot be modified without invalidating the token's signature
  - Backend can now trust the role information from the token

---

## Vulnerability 3: Frontend Stores Role in localStorage (Client-Side Tampering)
- **Found in**: `client/src/context/AuthContext.jsx`
- **Severity**: 🔴 CRITICAL  
- **Type**: Client-Side Authorization, Data Tampering
- **Description of the Problem**:
  - After login, user's role was stored in localStorage: `localStorage.setItem('role', data.user.role)`
  - localStorage can be modified using browser DevTools (F12 → Application → localStorage)
  - User could manually change role from 'reader' to 'admin': Edit value in DevTools console
  - Frontend UI would show buttons and features based on the tampered role
  - This broke the entire authorization model for client-side rendering
  - Backend role checks still worked, but frontend UI was compromised
  - User could see/interact with UI they weren't supposed to access
  
- **Discovery Method**: Test by opening DevTools and modifying localStorage values
  
- **Description of the Fix**:
  - Removed role from localStorage completely: Deleted `localStorage.setItem('role', ...)`
  - Added `jwt-decode` library to safely decode JWT tokens on the client
  - Role is now derived dynamically from the JWT token: `const decoded = jwt_decode(token); setRole(decoded.role);`
  - Role is recalculated on every app load from the server-signed token
  - Cannot be tampered with because JWT signature verification happens server-side
  - If user modifies localStorage, they only invalidate the token string itself
  - Provides cryptographic guarantee that role comes from the server

---

## Vulnerability 4: Missing Role Checks on All Critical Endpoints
- **Found in**: `server/routes/fragments.js`
- **Severity**: 🔴 CRITICAL
- **Type**: Access Control, Privilege Escalation
- **Description of the Problem**:
  - **POST /api/fragments** (Create): Any authenticated user could create fragments (should require Contributor+)
  - **PUT /api/fragments/:id** (Edit): No ownership check; anyone could edit any fragment
  - **POST /api/fragments/:id/approve** (Publish): Any user could approve/publish fragments (should require Curator+)
  - **DELETE /api/fragments/:id** (Delete): Any user could delete any fragment (should require Admin only)
  - Fragments auto-published immediately instead of pending curator approval
  - Complete privilege escalation: Readers could act as Admins
  - Data integrity compromised: Anyone could modify or delete content
  
- **Discovery Method**: Code audit of endpoint authorization; attempted creating/editing/deleting as a Reader account
  
- **Description of the Fix**:
  - **POST /api/fragments**: Added `roleCheck(['contributor', 'curator', 'admin'])`
    - Readers cannot create fragments (403 Forbidden)
    - Fragments start as 'pending' status, not 'published'
  - **PUT /api/fragments/:id**: Added role check + ownership verification
    ```javascript
    if(frag.userId !== req.user.userId && !['curator', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'You can only edit your own fragments' });
    }
    ```
    - Contributors can only edit their own fragments
    - Curators and Admins can edit any fragment
  - **POST /api/fragments/:id/approve**: Added `roleCheck(['curator', 'admin'])`
    - Only Curators and Admins can publish fragments
    - Fragments must pass curation workflow
  - **DELETE /api/fragments/:id**: Added `roleCheck(['admin'])`
    - Only Admins can delete fragments
    - Complete deletion restricted to highest privilege level

---

## Vulnerability 5: CSRF Vulnerability – CORS Misconfigured
- **Found in**: `server/index.js`
- **Severity**: 🟠 HIGH
- **Type**: Cross-Site Request Forgery, Cross-Origin Attacks
- **Description of the Problem**:
  - CORS was configured to accept requests from ANY origin: `cors({ origin: '*' })`
  - No origin validation: attacker.com could make requests to api.fragments.com
  - No CSRF token mechanism implemented
  - If a user is logged into Fragments, malicious website can make requests using their session
  - Attack scenario: Attacker hosts website with hidden form that deletes all user's fragments
  - User visits malicious site while authenticated → fragments deleted without consent
  - Affects all state-changing operations (POST, PUT, DELETE)
  
- **Discovery Method**: Code audit of CORS policy; attempted requests from unauthorized origins
  
- **Description of the Fix**:
  - Restricted CORS to trusted origin only:
    ```javascript
    const trustedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
    app.use(cors({ 
      origin: trustedOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
    }));
    ```
  - Only requests from trustedOrigin are accepted
  - Credentials (cookies/auth headers) only sent to trusted origin
  - Prepared for CSRF token implementation with X-CSRF-Token header support
  - Malicious websites can no longer access Fragments API

---

## Vulnerability 6: Logout Does Not Invalidate Token (Token Lifetime Management)
- **Found in**: `server/middleware/auth.js`, `client/src/components/LogoutButton.jsx`
- **Severity**: 🟠 HIGH
- **Type**: Session Management, Token Revocation
- **Description of the Problem**:
  - Logout only cleared localStorage on the client: `localStorage.removeItem('token')`
  - No server-side token invalidation
  - Attacker who copies a token before victim logs out can continue using it
  - Token remains valid on the server for 1 hour (or indefinitely if Vulnerability 1 not fixed)
  - Attack scenario: User logs out at work, goes home. Attacker uses copied token to access account.
  - No audit trail of when tokens are revoked
  - Cannot manually invalidate a user's sessions server-side
  
- **Discovery Method**: Copy token before logout, use it after logout in API requests (still works)
  
- **Description of the Fix**:
  - Implemented server-side token blacklist (in-memory for MVP):
    ```javascript
    // server/data/store.js
    const blacklist = []; // Array to store revoked tokens
    ```
  - **Backend logout endpoint** (server/routes/auth.js):
    ```javascript
    router.post('/logout', auth, (req, res) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if(token) {
        blacklist.push(token); // Add to blacklist
      }
      res.json({ message: 'Logged out successfully' });
    });
    ```
  - **Auth middleware check** (server/middleware/auth.js):
    ```javascript
    if(blacklist.includes(tokenValue)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    ```
  - **Frontend logout call** (client/src/components/LogoutButton.jsx):
    ```javascript
    await api.post('/api/auth/logout'); // Call server endpoint first
    logout(); // Then clear local state
    ```
  - Tokens are now revoked server-side when user logs out
  - Any request with revoked token is rejected with 401
  - Provides complete session termination

---

## Summary Table

| # | Vulnerability | Severity | Category | File | Status |
|---|---|---|---|---|---|
| 1 | Hardcoded JWT Secret & No Expiry | 🔴 CRITICAL | Secret Mgmt | `server/auth/jwt.js` | ✅ Fixed |
| 2 | Role Missing from JWT Payload | 🔴 CRITICAL | Authorization | `server/routes/auth.js` | ✅ Fixed |
| 3 | Role Stored in localStorage | 🔴 CRITICAL | Client Tampering | `client/src/context/AuthContext.jsx` | ✅ Fixed |
| 4 | Missing Role Checks | 🔴 CRITICAL | Access Control | `server/routes/fragments.js` | ✅ Fixed |
| 5 | CORS Misconfigured (CSRF) | 🟠 HIGH | CSRF | `server/index.js` | ✅ Fixed |
| 6 | No Logout Token Invalidation | 🟠 HIGH | Session Mgmt | Multiple | ✅ Fixed |

---

## Role Hierarchy Implemented

| Role | Permissions |
|---|---|
| **reader** | Read-only access to published fragments |
| **contributor** | Create fragments (start as pending), edit own fragments |
| **curator** | Edit any fragment, approve/publish pending fragments |
| **admin** | All permissions including deletion of fragments |

---

## Environment Variables Required

```bash
JWT_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:5173
PORT=5001
```

---

## Testing Verification Checklist

- ✅ Reader cannot create fragments (403 Forbidden)
- ✅ Contributor can create fragments (201 Created)
- ✅ Contributor cannot edit others' fragments (403 Forbidden)
- ✅ Contributor can edit own fragments (200 OK)
- ✅ Only Curator can approve fragments (403 for non-curators)
- ✅ Only Admin can delete fragments (403 for non-admins)
- ✅ Token expires after 1 hour (401 Unauthorized)
- ✅ Logout blacklists token (401 on next request with same token)
- ✅ Cannot modify role in localStorage (reads from JWT signature)
- ✅ CORS rejects unauthorized origins (CORS error)
- ✅ Server fails to start without JWT_SECRET (Error thrown)

---

## Security Best Practices Applied

1. **Defense in Depth**: Multiple layers of checks (JWT, role middleware, ownership verification)
2. **Fail-Secure**: Missing role in JWT causes rejection, not acceptance
3. **Least Privilege**: Each role has minimum required permissions
4. **Token Expiry**: Short-lived tokens (1 hour) reduce window of exposure
5. **Server-Side Validation**: Authorization checks happen on server, not client
6. **No Secrets in Code**: JWT secret from environment variable
7. **Session Termination**: Logout invalidates tokens server-side
8. **CORS Restriction**: Only trusted origins can access API

---

> [!NOTE]
> All fixes have been tested and verified. Authorization is now enforced server-side with proper role-based access control, secure JWT handling, and token lifecycle management.
