# Pre-Refactor Audit

This document outlines all issues identified in the original codebase before refactoring.

---

## 1. Poor Variable Naming

- Variables like `d`, `x`, `arr`, `res2` were used.
- These names do not describe the data they hold.
- Makes code hard to read and understand.

Example:
- `d` → unclear (should represent request body)
- `x` → used as ID counter
- `arr` → used for sorted confessions

---

## 2. Monolithic Function (handleAll)

- A single function `handleAll()` handled:
  - Input validation
  - Business logic
  - Database (array) operations
  - Response formatting
- Violates **Single Responsibility Principle**
- Hard to debug and maintain

---

## 3. No Separation of Concerns

- Entire application logic exists in one file (`app.js`)
- No separation between:
  - Routes
  - Controllers
  - Business logic

---

## 4. Hardcoded Values

- Port number `3000` is hardcoded
- Delete token `"supersecret123"` is hardcoded
- Category list repeated in multiple places

---

## 5. Deep Nested Conditionals

- Multiple nested `if` statements
- Makes logic hard to follow

Example:
- `if → if → if → if` chains for validation

---

## 6. Inconsistent Error Handling

- Some errors use `.json()`
- Some use `.send()`
- Some return unclear messages like `"bad"` or `"broken"`

---

## 7. No Input Validation Abstraction

- Validation logic is inline
- Not reusable
- Not testable separately

---

## 8. No Modular Structure

- No folder organization
- No reusable components
- Everything tightly coupled

---

## 9. No Environment Configuration

- No `.env` file used
- Not production-ready

---

## 10. Lack of Comments

- No explanation of:
  - Why logic exists
  - Edge cases
- Makes onboarding difficult

---

## 11. Repeated Logic

- Category validation repeated
- Filtering logic not reusable

---

## 12. Poor Readability

- Mixed use of `var`, `let`, `const`
- Inconsistent formatting
- Long function blocks

---

## 13. Potential Bugs

- Using wrong property names (`complete` vs `completed`)
- Manual parsing of IDs without validation
- Direct array mutation without safeguards

---

## Summary

The application works functionally but suffers from:
- Poor readability
- Lack of structure
- Tight coupling
- Hardcoded configurations

These issues make it difficult to scale, debug, and maintain.