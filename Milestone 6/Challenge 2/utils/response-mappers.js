/**
 * Response Mappers for CorpAuth API
 * 
 * These mappers enforce data minimization on all auth endpoints.
 * They strip sensitive fields that should never be transmitted to the frontend:
 * - Cryptographic hashes (password_hash)
 * - Payment/billing identifiers (stripe_customer_id, subscription_plan)
 * - Security tokens (verification_token, reset_password_token)
 * - Sensitive timing/network data (last_login_ip)
 * - Confidential data (salary)
 * - Database metadata (created_at, updated_at)
 * - Internal flags (is_admin - redundant with role)
 * - Configuration data (feature_flags - fetched from dedicated endpoint)
 */

/**
 * Maps user database record to safe auth response
 * Used for: POST /auth/signup, POST /auth/login
 * 
 * Contains only data needed to initialize frontend session and display user context.
 * 
 * @param {Object} user - User record from PostgreSQL
 * @returns {Object} Sanitized user object with only safe, client-facing fields
 */
export const toAuthUser = (user) => {
  return {
    name: user.name,
    email: user.email,
    role: user.role
  }
}

/**
 * Maps user database record to profile response
 * Used for: GET /auth/me
 * 
 * Profile endpoint may need slightly more context than auth response,
 * but still excludes all sensitive/internal/confidential fields.
 * 
 * What's included and why:
 * - name: User's display name for profile
 * - email: Account identifier
 * - role: Authorization context (show admin features, etc)
 * 
 * What's excluded and why:
 * - id: Internal DB reference
 * - password_hash: Never expose cryptographic material
 * - stripe_customer_id: Billing PII, breaks user privacy
 * - subscription_plan: Billing data, breaks user privacy
 * - verification_token, reset_password_token: Security tokens, only used server-side
 * - last_login_ip: Sensitive network information
 * - is_admin: Redundant with role field
 * - salary: Confidential HR/payroll data
 * - feature_flags: Configuration data, should come from dedicated /config endpoint
 * - created_at, updated_at: Database metadata, not user-facing
 * 
 * @param {Object} user - User record from PostgreSQL
 * @returns {Object} Sanitized user object for profile display
 */
export const toProfileUser = (user) => {
  return {
    name: user.name,
    email: user.email,
    role: user.role
  }
}
