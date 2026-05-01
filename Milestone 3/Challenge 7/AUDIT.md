# AUDIT.md

## Issues Found

1. No tenant isolation
- Tables like users, projects, billing_details do not have tenant_id
- A query without WHERE returns all data across organisations

2. Cross-tenant access risk
- Foreign keys do not enforce tenant boundaries
- A project can reference a user from another tenant

3. Sensitive data exposure
- Fields like salary, billing_card_last4, ssn are exposed to all roles
- No restriction based on user role

4. No role-based access control
- No distinction between Admin, Manager, and User
- All users can access all data

5. No API-level filtering
- Responses return raw DB objects
- Sensitive fields are not filtered

6. Missing indexes
- No indexes on tenant_id
- Queries will be slow and unsafe at scale

7. No security documentation
- No explanation of access control or risks