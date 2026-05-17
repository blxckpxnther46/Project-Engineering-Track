# Still In? – Bug Fix Log

## 🛠️ Vulnerabilities Fixed

### 1. Expired Token Returns Wrong HTTP Status (Server)
- **Problem**: When JWT tokens expired, the server's `authMiddleware` caught the `TokenExpiredError` but returned `500 Internal Server Error` instead of `401 Unauthorized`. This prevented the frontend from distinguishing between authentication failures and actual server errors.
- **Discovery**: Code audit of `server/middleware/auth.js` revealed generic error handling that caught all exceptions identically.
- **Solution**: Modified `server/middleware/auth.js` to specifically check for `TokenExpiredError` using `err.name === "TokenExpiredError"` and return `401 Unauthorized` with message "Token expired. Please login again." Other authentication errors also return `401` for consistency.
- **Impact**: Frontend can now properly detect session expiration and respond appropriately.

### 2. Voting Logic Allows Duplicate Votes (Server)
- **Problem**: The voting duplicate-check had a critical type mismatch bug. The code compared `votedUserIds.find(id => id === req.user.email)` but stored `userId` (numeric) while checking against `req.user.email` (string). Since these types never match, the condition always failed, allowing infinite votes from one user.
- **Discovery**: Code audit of `server/routes/poll.js` revealed inconsistent data type usage between the comparison and storage operations.
- **Solution**: Changed `votedUserIds.find(id => id === req.user.email)` to `votedUserIds.includes(userId)` to use consistent numeric user IDs and the correct Array method for membership testing.
- **Impact**: Voting duplicate prevention now works correctly, preventing users from voting multiple times.

### 3. Frontend Ignores Authentication Errors (Client)
- **Problem**: The Axios HTTP client had no response interceptor to handle `401 Unauthorized` responses. When tokens expired, the frontend would receive 401 errors but continue operating as if authenticated, leaving stale tokens in localStorage and preventing proper session cleanup.
- **Discovery**: Code audit of `client/src/api/client.js` revealed a request interceptor for adding tokens but no response interceptor for error handling.
- **Solution**: Added a response interceptor that:
  - Checks if the error status is `401`
  - Clears `token` and `user` from `localStorage`
  - Redirects to `/login` page using `window.location.href`
  - Returns the promise rejection for components to handle
- **Impact**: Sessions properly terminate when tokens expire, and users are redirected to login automatically.

### 4. Polling Interval Keeps Running After Expiry (Client)
- **Problem**: The `Dashboard.jsx` component set up a 10-second polling interval using `setInterval()` to fetch poll results, but when the token expired and API returned 401/500, the error was only logged with `console.error()`. The interval continued firing indefinitely, making repeated requests with an invalid/expired token, wasting resources and providing poor user experience.
- **Discovery**: Code audit of `client/src/pages/Dashboard.jsx` showed the `useEffect` cleanup only called `clearInterval()` on component unmount, not on authentication failures.
- **Solution**: Modified `Dashboard.jsx` to:
  - Check for `401` status in `fetchPoll()` error handler
  - Clear the polling interval with `clearInterval(intervalRef.current)` when 401 occurs
  - Call `logout()` to clear auth context
  - Navigate to login page with `navigate('/login')`
  - Also updated the logout button to clear the interval before logging out
  - Updated `handleVote()` error handler similarly for consistency
- **Impact**: Polling stops immediately when authentication fails, reducing unnecessary requests and properly terminating user sessions.

## 📊 Summary

| Vulnerability | Severity | File | Status |
|---------------|----------|------|--------|
| Wrong HTTP Status for Expired Token | High | `server/middleware/auth.js` | ✅ Fixed |
| Duplicate Vote Prevention Bug | Critical | `server/routes/poll.js` | ✅ Fixed |
| Missing Auth Error Handler | High | `client/src/api/client.js` | ✅ Fixed |
| Polling Continues After Expiry | Medium | `client/src/pages/Dashboard.jsx` | ✅ Fixed |

All vulnerabilities have been identified, documented, and fixed. The application now properly handles authentication failures, prevents duplicate voting, and cleans up resources when sessions expire.
