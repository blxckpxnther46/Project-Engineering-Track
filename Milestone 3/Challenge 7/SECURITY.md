# SECURITY.md

## Sensitive Fields

- salary → only Admin
- ssn → only Admin
- billing_card_last4 → Admin only
- bank_account → Admin only

## Role Access

Admin:
- Full access within tenant
- Can view sensitive data

Manager:
- Can view users and projects
- Cannot see financial or sensitive fields

User:
- Can view only own data
- Cannot see other users

## Tenant Isolation

All tables include tenant_id
Every query filters using tenant_id
Foreign keys ensure relationships stay within tenant

## Cross-Tenant Risk Prevention

- No record can reference another tenant’s data
- Queries without tenant_id are disallowed

## Indexing

Indexes added on tenant_id for:
- users
- projects
- billing_details

Improves performance and enforces scoped queries