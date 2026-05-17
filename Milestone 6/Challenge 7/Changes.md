# Still In? – Bug Fix Log

## 🛠️ Security Vulnerabilities Fixed

### 1. Expired Token Returns Wrong HTTP Status (Server Authentication)
- **Problem**: When JWT tokens expired, the server's `authMiddleware` caught the `TokenExpiredError` exception but returned `500 Internal Server Error` instead of the proper `401 Unauthorized` status. This prevented the frontend from distinguishing between authentication failures and genuine server errors, breaking the client's ability to handle session expiration gracefully.
- **Discovery**: Code audit of `server/middleware/auth.js` revealed generic error handling with a catch block that returned 500 for all exceptions, including `TokenExpiredError`.
- **Solution**: Modified the error handler to specifically check `if (err.name === "TokenExpiredError")` and return `res.status(401)` with message "Token expired. Please login again." Other authentication errors also return `401` for consistency, preventing information leakage about error types.
- **Impact**: Frontend can now reliably detect session expiration via HTTP 401 status and trigger proper cleanup and redirection.

### 2. Voting Logic Allows Duplicate Votes (Type Mismatch Bug)
- **Problem**: Critical type-safety vulnerability in `server/routes/poll.js`. The code stored `userId` (numeric) but compared using `votedUserIds.find(id => id === req.user.email)` where `req.user.email` is a string. Since numeric !== string, the comparison always failed (false), allowing users to vote unlimited times from a single account.
- **Discovery**: Code audit revealed the mismatch between the stored value (`userId`, numeric from JWT) and the comparison value (`req.user.email`, string). The `find()` method and type mismatch prevented duplicate detection.
- **Solution**: Changed from `votedUserIds.find(id => id === req.user.email)` to `votedUserIds.includes(userId)`, using consistent numeric user IDs and the correct Array method for membership testing.
- **Impact**: Duplicate vote prevention now functions correctly, ensuring one vote per authenticated user per session.

### 3. Frontend Ignores Authentication Errors (Missing Response Interceptor)
- **Problem**: The Axios HTTP client in `client/src/api/client.js` had a request interceptor to add Authorization headers, but lacked a response interceptor to handle authentication failures. When tokens expired and the API returned `401 Unauthorized`, the frontend would receive the error but continue as if authenticated, leaving stale tokens in localStorage and preventing proper session cleanup.
- **Discovery**: Code audit of `client/src/api/client.js` showed request interceptor present but no response interceptor for error handling. Components had to manually handle errors without centralized cleanup.
- **Solution**: Added a response interceptor that:
  - Checks if `error.response.status === 401`
  - Clears both `token` and `user` from `localStorage`
  - Redirects to `/login` using `window.location.href`
  - Returns the promise rejection for component-level error handling
- **Impact**: Sessions automatically terminate on authentication failure, users are redirected to login immediately, and localStorage is cleaned up globally.

### 4. Polling Interval Keeps Running After Session Expires (Resource Leak)
- **Problem**: The `Dashboard.jsx` component created a polling interval with `setInterval()` to fetch poll results every 10 seconds. When the token expired and API returned 401/500 error, the `fetchPoll()` function only logged the error with `console.error()` and continued. The interval kept firing indefinitely, making repeated failed requests with an expired token, wasting network bandwidth and server resources, and degrading user experience.
- **Discovery**: Code audit of `client/src/pages/Dashboard.jsx` revealed:
  - `useEffect` cleanup only called `clearInterval()` on component unmount, not on authentication failures
  - Error handling in `fetchPoll()` had no response to 401 status
  - Vote handler also lacked proper authentication error handling
- **Solution**: Modified Dashboard to:
  - Check `err.response?.status === 401` in `fetchPoll()` error handler
  - Call `clearInterval(intervalRef.current)` to stop polling on 401
  - Call `logout()` to clear AuthContext state
  - Navigate to '/login' with `navigate('/login')`
  - Applied same logic to `handleVote()` error handler for consistency
  - Updated logout button to clear interval before logging out
- **Impact**: Polling stops immediately when authentication fails, preventing unnecessary requests. Resources are properly cleaned up, and users experience clean session termination.

---

## 📊 Vulnerability Summary

| # | Vulnerability | Severity | Type | File | Status |
|---|---|---|---|---|---|
| 1 | Expired Token Wrong Status | High | Auth Bypass | `server/middleware/auth.js` | ✅ Fixed |
| 2 | Duplicate Votes Allowed | Critical | Logic Bug | `server/routes/poll.js` | ✅ Fixed |
| 3 | Missing Auth Error Handler | High | Error Handling | `client/src/api/client.js` | ✅ Fixed |
| 4 | Polling Continues After Expiry | Medium | Resource Leak | `client/src/pages/Dashboard.jsx` | ✅ Fixed |

All security vulnerabilities have been identified, documented, and resolved. The Polling App now properly handles authentication failures, prevents duplicate votes, and cleans up resources when sessions expire.
