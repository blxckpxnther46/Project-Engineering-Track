# Observations

## Issues Found

When running the invalid_data.sql file, the following issues were observed:

- Tasks were allowed to have NULL titles
- Duplicate email addresses were inserted into the users table
- Invalid priority values (like 10) were accepted
- Tasks could reference non-existent projects (orphan tasks)

These issues indicated that the database had no proper integrity constraints.

---

## Constraints Implemented

To fix the issues, the following constraints were added:

### NOT NULL
- Applied to:
  - users.name
  - users.email
  - projects.project_name
  - tasks.title
- Reason: These fields are mandatory and should never be empty.

### UNIQUE
- Applied to:
  - users.email
- Reason: Each user must have a unique email address.

### CHECK
- Applied to:
  - tasks.priority
- Rule:
  - priority must be between 1 and 5
- Reason: Prevents invalid priority values that could break sorting/filtering.

### FOREIGN KEY
- Applied to:
  - tasks.project_id → projects.id
  - projects.owner_id → users.id
- Reason: Ensures relationships are valid and prevents orphan records.

---

## Result

After applying the constraints:

- NULL task titles are rejected by the database
- Duplicate emails are rejected
- Invalid priority values (outside 1–5) are rejected
- Tasks referencing non-existent projects are rejected

The database now enforces strict data integrity and prevents invalid data from being inserted at any level.