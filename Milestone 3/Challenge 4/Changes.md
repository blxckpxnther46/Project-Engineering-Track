## Original index
CREATE INDEX idx_salary_department ON employees(salary, department);

## Issue observed
The query was slow and PostgreSQL used a Sequential Scan instead of an Index Scan.

## Why it was wrong
The index column order was (salary, department) but the query filters by department first.

PostgreSQL follows the Left-Most Prefix Rule, so it could not efficiently use the index.

## Fixed index
CREATE INDEX idx_department_salary ON employees(department, salary);

## Result
After fixing the index:
- PostgreSQL uses Index Scan
- Query performance improved
- No full table scan

## Concept
Left-Most Prefix Rule: Index works only if query starts with first column of index.