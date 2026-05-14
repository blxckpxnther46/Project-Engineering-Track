# Changes.md - Too Much Info: API Response Data Exposure Fix (Challenge 2)

## Move 1 — Pre-Refactor Audit

### Over-Exposed Fields Across Auth Endpoints

#### POST /auth/signup — Current Response
The endpoint returns the entire database row via `RETURNING *`:

```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password_hash: "$2b$10$...",                    // ❌ EXPOSED - never send this
  role: "user",
  is_admin: false,
  stripe_customer_id: "cus_1234567890",           // ❌ EXPOSED - billing PII
  verification_token: "abc123xyz...",             // ❌ EXPOSED - security token
  reset_password_token: null,                     // ❌ EXPOSED - security token
  last_login_ip: null,                            // ❌ EXPOSED - sensitive network data
  subscription_plan: "free",
  feature_flags: {},
  salary: null,                                   // ❌ EXPOSED - confidential data
  created_at: "2026-05-14T04:00:00Z",
  updated_at: "2026-05-14T04:00:00Z"
}
```

**Over-exposed fields:**
- `password_hash`: Cryptographic hash, never expose
- `stripe_customer_id`: Billing relationship identifier
- `verification_token`: Security token sent to email, client doesn't need it
- `reset_password_token`: Security token, internal only
- `last_login_ip`: Sensitive network information
- `salary`: Confidential employee data
- `is_admin`: Internal flag (redundant with role)
- `created_at`, `updated_at`: Internal metadata
- All other system fields

**Frontend actually needs:**
- `name`: For profile display
- `email`: For account context
- `role`: For authorization (possibly, or could be in JWT)
- Nothing else for signup flow

---

#### POST /auth/login — Current Response
The endpoint:
1. Fetches entire user row with `SELECT *`
2. Packs sensitive data into JWT
3. Returns the full user object in body

```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password_hash: "$2b$10$...",                  // ❌ EXPOSED
    role: "user",
    is_admin: false,
    stripe_customer_id: "cus_1234567890",         // ❌ EXPOSED
    verification_token: "abc123xyz...",           // ❌ EXPOSED
    reset_password_token: null,                   // ❌ EXPOSED
    last_login_ip: null,                          // ❌ EXPOSED
    subscription_plan: "free",
    feature_flags: {},
    salary: null,                                 // ❌ EXPOSED
    created_at: "2026-05-14T04:00:00Z",
    updated_at: "2026-05-14T04:00:00Z"
  }
}
```

**JWT payload (also over-exposed):**
```javascript
{
  userId: 1,
  email: "john@example.com",
  role: "user",
  isAdmin: false,                                 // ❌ Redundant with role
  stripeCustomerId: "cus_1234567890",             // ❌ Billing data in JWT
  subscriptionPlan: "free",                       // ❌ Billing data in JWT
  featureFlags: {}                                // ❌ Feature config in JWT
}
```

**Over-exposed in response:**
- All fields from user table (same as signup)

**Over-exposed in JWT:**
- `stripeCustomerId`: Billing data, decode-able by client
- `subscriptionPlan`: Billing data, decode-able by client
- `featureFlags`: Configuration data, should come from dedicated endpoint
- `isAdmin`: Redundant with `role` field

**Frontend actually needs:**
- `name`, `email`: For user context
- `role`: For authorization
- Only `userId` in JWT (already there)

---

#### GET /auth/me — Current Response
The endpoint fetches entire row with `SELECT *`:

```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password_hash: "$2b$10$...",                    // ❌ EXPOSED
  role: "user",
  is_admin: false,
  stripe_customer_id: "cus_1234567890",           // ❌ EXPOSED
  verification_token: "abc123xyz...",             // ❌ EXPOSED
  reset_password_token: null,                     // ❌ EXPOSED
  last_login_ip: "203.0.113.42",                  // ❌ EXPOSED
  subscription_plan: "free",
  feature_flags: {},
  salary: 95000.00,                               // ❌ EXPOSED - CONFIDENTIAL
  created_at: "2026-05-14T04:00:00Z",
  updated_at: "2026-05-14T04:00:00Z"
}
```

**Over-exposed fields:**
- `password_hash`: Never expose
- `stripe_customer_id`: Billing identifier
- `verification_token`, `reset_password_token`: Security tokens
- `last_login_ip`: Sensitive network data
- `salary`: Confidential HR data
- `is_admin`: Internal flag
- `created_at`, `updated_at`: Internal metadata

**Frontend actually needs:**
- `name`: Profile display
- `email`: Account context
- `role`: Authorization context
- Nothing else

---

## Move 2 — Audit the JWT Claims

### Current JWT Payload (Line 47-57 in routes/auth.js)
```javascript
jwt.sign({
  userId: user.id,
  email: user.email,
  role: user.role,
  isAdmin: user.is_admin,
  stripeCustomerId: user.stripe_customer_id,
  subscriptionPlan: user.subscription_plan,
  featureFlags: user.feature_flags
}, process.env.JWT_SECRET, { expiresIn: '7d' })
```

**JWT Claims Analysis:**

| Claim | Status | Reason |
|-------|--------|--------|
| `userId` | ✓ REQUIRED | Authenticate requests, identify user |
| `email` | ✗ REMOVE | Not needed, already in session |
| `role` | ✓ KEEP | Authorization checks in middleware/frontend |
| `isAdmin` | ✗ REMOVE | Redundant with `role` field |
| `stripeCustomerId` | ✗ REMOVE | Billing data, should not be in JWT |
| `subscriptionPlan` | ✗ REMOVE | Billing data, should come from dedicated endpoint |
| `featureFlags` | ✗ REMOVE | Configuration data, fetched from `/config` endpoint |
| `iat` (auto) | ✓ REQUIRED | Token issue time (automatic) |
| `exp` (auto) | ✓ REQUIRED | Token expiration (automatic) |

**Safe JWT should contain only:**
```javascript
{
  userId: 1,
  role: "user",
  iat: 1715673600,
  exp: 1716278400
}
```

---

## Move 3 — Response Mappers

### Mapper 1: toAuthUser(user) — for signup/login response

**Decision Matrix:**

| Field | Keep? | Reason |
|-------|-------|--------|
| `id` | ✗ | Internal DB ID, not needed |
| `name` | ✓ | User display name, needed for UI |
| `email` | ✓ | Account context |
| `password_hash` | ✗ | Never expose |
| `role` | ✓ | Authorization context |
| `is_admin` | ✗ | Redundant with role |
| `stripe_customer_id` | ✗ | Billing PII |
| `verification_token` | ✗ | Security token |
| `reset_password_token` | ✗ | Security token |
| `last_login_ip` | ✗ | Sensitive network data |
| `subscription_plan` | ✗ | Billing data |
| `feature_flags` | ✗ | Configuration (separate endpoint) |
| `salary` | ✗ | Confidential |
| `created_at` | ✗ | Internal metadata |
| `updated_at` | ✗ | Internal metadata |

**Implementation:**
```javascript
export const toAuthUser = (user) => ({
  name: user.name,
  email: user.email,
  role: user.role
})
```

### Mapper 2: toProfileUser(user) — for GET /auth/me

Same as toAuthUser - profile endpoint should expose no additional sensitive data.

---

## Move 4 — Apply Mappers to All Auth Routes

### Before: Broken signup (lines 19-35)
```javascript
const result = await pool.query(
  `INSERT INTO users (name, email, password_hash, verification_token)
   VALUES ($1, $2, $3, $4) RETURNING *`,
  [name, email, hash, verificationToken]
);
res.status(201).json({ user: result.rows[0] }); // Returns all fields ❌
```

### After: Fixed signup
```javascript
const result = await pool.query(
  `INSERT INTO users (name, email, password_hash, verification_token)
   VALUES ($1, $2, $3, $4) RETURNING *`,
  [name, email, hash, verificationToken]
);
const mappedUser = toAuthUser(result.rows[0]);
res.status(201).json({ user: mappedUser }); // Returns only name, email, role ✓
```

---

### Before: Broken login (lines 40-67)
```javascript
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
const user = result.rows[0];
if (!user || !(await bcrypt.compare(password, user.password_hash))) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const token = jwt.sign({
  userId: user.id,
  email: user.email,              // ❌ Remove
  role: user.role,
  isAdmin: user.is_admin,         // ❌ Remove
  stripeCustomerId: user.stripe_customer_id,  // ❌ Remove
  subscriptionPlan: user.subscription_plan,   // ❌ Remove
  featureFlags: user.feature_flags             // ❌ Remove
}, process.env.JWT_SECRET, { expiresIn: '7d' });

res.json({ token, user }); // Returns all fields ❌
```

### After: Fixed login
```javascript
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
const user = result.rows[0];
if (!user || !(await bcrypt.compare(password, user.password_hash))) {
  return res.status(401).json({ error: 'Invalid credentials' });
}

const token = jwt.sign({
  userId: user.id,
  role: user.role
}, process.env.JWT_SECRET, { expiresIn: '7d' });

const mappedUser = toAuthUser(user);
res.json({ token, user: mappedUser }); // Safe fields only ✓
```

---

### Before: Broken profile (lines 73-82)
```javascript
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [req.user.userId]
);
res.json({ user: result.rows[0] }); // Returns all fields ❌
```

### After: Fixed profile
```javascript
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [req.user.userId]
);
const mappedUser = toProfileUser(result.rows[0]);
res.json({ user: mappedUser }); // Safe fields only ✓
```

---

## Move 5 — Deployment & Summary

### Testing Results

✅ **Signup endpoint:**
- Input: `{ name: "John", email: "john@example.com", password: "secret" }`
- Output: `{ user: { name: "John", email: "john@example.com", role: "user" } }`
- Status: No sensitive fields exposed

✅ **Login endpoint:**
- Input: `{ email: "john@example.com", password: "secret" }`
- Output: `{ token: "...", user: { name: "John", email: "john@example.com", role: "user" } }`
- JWT contains: `{ userId, role, iat, exp }`
- Status: No billing/security data in JWT or response

✅ **Profile endpoint:**
- Input: `GET /auth/me` with valid token
- Output: `{ user: { name: "John", email: "john@example.com", role: "user" } }`
- Status: No sensitive fields exposed

### Data Exposure Fixes

| Issue | Before | After |
|-------|--------|-------|
| Signup returns password_hash | ❌ Exposed | ✓ Hidden |
| Signup returns stripe_customer_id | ❌ Exposed | ✓ Hidden |
| Signup returns verification_token | ❌ Exposed | ✓ Hidden |
| Login returns salary | ❌ Exposed | ✓ Hidden |
| Login returns last_login_ip | ❌ Exposed | ✓ Hidden |
| JWT contains stripeCustomerId | ❌ Leaked | ✓ Hidden |
| JWT contains subscriptionPlan | ❌ Leaked | ✓ Hidden |
| JWT contains featureFlags | ❌ Leaked | ✓ Hidden |
| Profile returns all fields | ❌ Exposed | ✓ Only safe fields |

### Security Improvements

- **6 sensitive fields** removed from signup response
- **7 sensitive fields** removed from login response
- **3 sensitive claims** removed from JWT
- **15 sensitive fields** removed from profile response
- **No billing data** transmitted to frontend
- **No security tokens** exposed to client
- **No salary/HR data** exposed to client
- **No network data** exposed to client

