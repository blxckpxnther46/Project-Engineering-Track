# ExpenseApp Role-Based Access Control Implementation

## Checkpoint 1 — Role in the User Model and JWT

### Finding
- **User Model**: ✅ Role field exists with enum `['user', 'manager', 'admin']` (default: 'user')
  - Location: `models/User.js`, line 8
- **JWT Token Generation**: ❌ Role is NOT included in the JWT payload
  - Location: `controllers/authController.js`, lines 12-15 and 42-45
  - Current payload: `{ userId, email }` 
  - **Consequence**: Every role check at middleware level will fail because `req.user.role` will be undefined when decoded from token

### Root Cause
The token generation in both `login()` and `signup()` functions omits the role field. This forces the middleware to fetch the user from the database on every request instead of reading from the JWT. While this isn't a security issue, it breaks role-based checks that rely on decoded token properties.

---

## Checkpoint 2 — Role Middleware Existence

### Finding
- **Existing Middleware**: ❌ NO `requireRole` middleware exists
- **Current Middleware**: Only `protect` middleware exists in `middleware/authMiddleware.js`
  - Authenticates user but performs NO role checks
  - Fetches full user from database (workaround for missing role in JWT)

### Gap
Routes have NO mechanism to enforce role-based restrictions. Any authenticated user can access all endpoints.

---

## Checkpoint 3 — Route Protection Coverage

| Route | Action | Endpoint | Sensitive? | Currently Restricted? | Should Be Restricted To |
|-------|--------|----------|------------|----------------------|------------------------|
| Submit expense | POST | `/api/expenses` | No | ✅ authMiddleware only | user, manager, admin |
| View own expenses | GET | `/api/expenses/mine` | No | ✅ authMiddleware only | user, manager, admin |
| View ALL expenses | GET | `/api/expenses` | Yes | ❌ NO role check | manager, admin |
| Approve expense | PUT | `/api/expenses/:id/approve` | Yes | ❌ NO role check | manager, admin |
| Reject expense | PUT | `/api/expenses/:id/reject` | Yes | ❌ NO role check | manager, admin |
| Delete expense | DELETE | `/api/expenses/:id` | Yes | ❌ NO role check | admin only |
| View all users | GET | `/api/users` | Yes | ❌ NO role check | admin only |
| Change user role | PUT | `/api/users/:id/role` | Yes | ❌ NO role check | admin only |
| View own profile | GET | `/api/users/me` | No | ✅ authMiddleware only | user, manager, admin |

---

## Checkpoint 4 — Ownership Gaps

### Finding
- **Expense Update** (`PUT /api/expenses/:id`): ❌ NO ownership check
  - Location: `controllers/expenseController.js`, `updateExpense()` function
  - **Gap**: Any authenticated user can modify any expense
  - **Exploit**: User A can edit User B's expense submission
  
- **Expense Delete** (`DELETE /api/expenses/:id`): ❌ NO ownership check
  - Location: `controllers/expenseController.js`, `deleteExpense()` function
  - **Gap**: Any authenticated user can delete any expense (should be admin-only anyway)
  - **Exploit**: User A can delete User B's expense

### Security Risk
A regular user could:
1. Submit an expense for themselves
2. Modify it to a different amount
3. Or delete it before approval
4. Without any audit trail showing they did so

---

## Role Gap Audit — What Regular User Could Do (Before Fix)

### Unprotected Actions a Regular User Currently Performs
1. **GET /api/expenses** — Retrieve ALL expenses in the system (should require manager/admin)
   - Response: 200 OK with full expense list
   
2. **PUT /api/expenses/:id/approve** — Approve ANY expense (should require manager/admin)
   - Response: 200 OK with updated expense status
   
3. **PUT /api/expenses/:id/reject** — Reject ANY expense (should require manager/admin)
   - Response: 200 OK with updated expense status
   
4. **DELETE /api/expenses/:id** — Delete ANY expense (should require admin-only)
   - Response: 200 OK with deletion confirmation
   
5. **PUT /api/expenses/:id** — Edit ANY expense submission, even if not their own
   - Response: 200 OK with updated expense
   
6. **GET /api/users** — Retrieve all users (should require admin-only)
   - Response: 200 OK with all user profiles (passwords removed)
   
7. **PUT /api/users/:id/role** — Change ANY user's role (should require admin-only)
   - Response: 200 OK with updated user role
   
8. **PUT /api/users/:id/role** — Promote themselves to admin
   - Response: 200 OK with role change confirmed

---

## Root Cause Analysis

| Issue | Location | What's Missing | Exploit Scenario |
|-------|----------|-----------------|------------------|
| No role in JWT | authController.js:12-15, 42-45 | Role field omitted from token payload | Middleware cannot verify roles from token alone |
| No role middleware | middleware/ | requireRole() function does not exist | No mechanism to enforce role restrictions |
| Expense GET unprotected | expenseRoutes.js:7 | Missing `requireRole('manager', 'admin')` | Regular user sees all company expenses |
| Approve unprotected | expenseRoutes.js:11 | Missing `requireRole('manager', 'admin')` | Regular user approves their own expense |
| Reject unprotected | expenseRoutes.js:12 | Missing `requireRole('manager', 'admin')` | Regular user rejects peer's expense |
| Delete unprotected | expenseRoutes.js:13 | Missing `requireRole('admin')` | User deletes any expense without audit trail |
| Update unprotected | expenseController.js:38 | No ownership check, no role restriction | User A edits User B's submitted expense |
| User GET unprotected | userRoutes.js:7 | Missing `requireRole('admin')` | Regular user enumerates all staff |
| Role update unprotected | userRoutes.js:8 | Missing `requireRole('admin')` | User promotes themselves to admin |

---

## Access Model — Current vs. Required

### Access Model (Required by Product)
| Action | Endpoint | Allowed Roles |
|--------|----------|---------------|
| Submit an expense | POST /api/expenses | user, manager, admin |
| View own expenses | GET /api/expenses/mine | user, manager, admin |
| View ALL expenses | GET /api/expenses | manager, admin |
| Approve an expense | PUT /api/expenses/:id/approve | manager, admin |
| Reject an expense | PUT /api/expenses/:id/reject | manager, admin |
| Delete an expense | DELETE /api/expenses/:id | admin only |
| View all users | GET /api/users | admin only |
| Change a user's role | PUT /api/users/:id/role | admin only |
| View own profile | GET /api/users/me | user, manager, admin |
| Edit own expense | PUT /api/expenses/:id | owner only (+ privileged roles) |

---

## What I Fixed — Implementation Details

### Fix 1: Add Role to JWT Token

**File**: `controllers/authController.js`

**Before**:
```javascript
const token = jwt.sign(
  { userId: user._id, email: user.email }, // ❌ missing role
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**After**:
```javascript
const token = jwt.sign(
  { userId: user._id, email: user.email, role: user.role }, // ✅ role included
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**Applied in**: Both `login()` and `signup()` functions (2 locations)

---

### Fix 2: Create and Apply requireRole Middleware

**File**: `middleware/roleMiddleware.js` (NEW FILE)

```javascript
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required: ${allowedRoles.join(' or ')}.`
      });
    }
    next();
  };
};
```

**Route Updates**:

#### expenseRoutes.js
| Endpoint | Before | After |
|----------|--------|-------|
| GET /api/expenses | `router.get('/', protect, getAllExpenses)` | `router.get('/', protect, requireRole('manager', 'admin'), getAllExpenses)` |
| GET /api/expenses/mine | `router.get('/mine', protect, getMyExpenses)` | ✅ No change (all users) |
| POST /api/expenses | `router.post('/', protect, createExpense)` | ✅ No change (all users) |
| PUT /api/expenses/:id | `router.put('/:id', protect, updateExpense)` | Ownership check added to controller |
| PUT /api/expenses/:id/approve | `router.put('/:id/approve', protect, approveExpense)` | `router.put('/:id/approve', protect, requireRole('manager', 'admin'), approveExpense)` |
| PUT /api/expenses/:id/reject | `router.put('/:id/reject', protect, rejectExpense)` | `router.put('/:id/reject', protect, requireRole('manager', 'admin'), rejectExpense)` |
| DELETE /api/expenses/:id | `router.delete('/:id', protect, deleteExpense)` | `router.delete('/:id', protect, requireRole('admin'), deleteExpense)` |

#### userRoutes.js
| Endpoint | Before | After |
|----------|--------|-------|
| GET /api/users | `router.get('/', protect, getAllUsers)` | `router.get('/', protect, requireRole('admin'), getAllUsers)` |
| PUT /api/users/:id/role | `router.put('/:id/role', protect, updateUserRole)` | `router.put('/:id/role', protect, requireRole('admin'), updateUserRole)` |
| GET /api/users/me | `router.get('/me', protect, getUserProfile)` | ✅ No change (all users) |

---

### Fix 3: Add Ownership Check for Expense Edits

**File**: `controllers/expenseController.js`

**Before**:
```javascript
export const updateExpense = async (req, res) => {
  // ❌ Any user can update any expense — no check
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(expense);
};
```

**After**:
```javascript
export const updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  
  // ✅ Ownership check: user can only edit their own expenses
  const isOwner = expense.submittedBy.toString() === req.user._id.toString();
  const isPrivileged = ['manager', 'admin'].includes(req.user.role);
  
  if (!isOwner && !isPrivileged) {
    return res.status(403).json({ message: 'You can only modify your own expenses.' });
  }
  
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedExpense);
};
```

**Note**: `deleteExpense()` is already protected by `requireRole('admin')` in the route, so additional ownership check is not needed.

---

## Verification Results

### Test Scenario Results

| # | Scenario | User Role | Endpoint | Expected Status | Actual Status | Result | Screenshot |
|---|----------|-----------|----------|-----------------|---------------|--------|-----------|
| 1 | Regular user tries to approve expense | user | PUT /api/expenses/:id/approve | 403 | 403 | ✅ PASS | screenshots/01-user-approve.png |
| 2 | Regular user tries to delete expense | user | DELETE /api/expenses/:id | 403 | 403 | ✅ PASS | screenshots/02-user-delete.png |
| 3 | Regular user tries to change user role | user | PUT /api/users/:id/role | 403 | 403 | ✅ PASS | screenshots/03-user-role-change.png |
| 4 | Regular user tries to edit another user's expense | user | PUT /api/expenses/:id | 403 | 403 | ✅ PASS | screenshots/04-user-edit-others.png |
| 5 | Manager approves an expense | manager | PUT /api/expenses/:id/approve | 200 | 200 | ✅ PASS | screenshots/05-manager-approve.png |
| 6 | Manager tries to change a user's role | manager | PUT /api/users/:id/role | 403 | 403 | ✅ PASS | screenshots/06-manager-role-change.png |
| 7 | Admin deletes an expense | admin | DELETE /api/expenses/:id | 200 | 200 | ✅ PASS | screenshots/07-admin-delete.png |
| 8 | Admin changes a user's role | admin | PUT /api/users/:id/role | 200 | 200 | ✅ PASS | screenshots/08-admin-role.png |

---

## Summary of Changes
- ✅ Added role field to JWT token payload (2 locations in authController.js)
- ✅ Created roleMiddleware.js with requireRole() function
- ✅ Applied requireRole middleware to 5 sensitive routes
- ✅ Added ownership check to updateExpense() controller
- ✅ All 8 verification scenarios passed
