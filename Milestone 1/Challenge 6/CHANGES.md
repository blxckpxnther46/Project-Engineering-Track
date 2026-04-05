# Refactoring Changes

This document records all major refactoring decisions made during cleanup.

---

## Section 1 — Variable Renames

| Old Name | New Name | Why |
|---|---|---|
| d | confessionData | Clearly represents request body data |
| x | currentId | Indicates it is an ID counter |
| arr | sortedConfessions | Describes sorted list of confessions |
| r | requestParams | Represents route parameters |
| res2 | deletedConfession | Represents deleted item |
| tmp | newConfession | More descriptive object name |
| info | foundConfession | Clearly indicates fetched result |
| handler | confessionIndex | Indicates index position in array |

---

## Section 2 — Function Splits

### Original Function:
handleAll()

### Split Into:

- validateConfessionInput()
  - Validates text length, category, and structure
  - Prevents invalid data from entering system

- createConfession()
  - Handles creation of confession object
  - Generates ID and timestamp

- getAllConfessions()
  - Sorts and returns all confessions

- getConfessionById()
  - Retrieves a single confession by ID

- getConfessionsByCategory()
  - Filters confessions based on category

- deleteConfession()
  - Handles deletion logic with authentication

---

### Why:

The original function had multiple responsibilities:
- Validation
- Data processing
- Business logic
- Response handling

Splitting functions:
- Improves readability
- Makes testing easier
- Enables reuse of logic
- Reduces bugs

---

## Section 3 — MVC Architecture

### Introduced Structure:

- routes/
  - Handles HTTP endpoints only

- controllers/
  - Extracts request data and sends responses

- services/
  - Contains business logic and data operations

- data/
  - Stores in-memory data and ID generator

---

### Why:

- Separation of concerns
- Improves scalability
- Easier debugging
- Matches industry standards

---

## Section 4 — Environment Variables

### Moved:

- PORT → `.env`
- DELETE_TOKEN → `.env`

---

### Why:

- Removes hardcoded sensitive values
- Makes app configurable
- Improves security and portability

---

## Section 5 — Code Readability Improvements

- Replaced nested `if` statements with early returns
- Standardized error responses using `.json()`
- Used consistent naming conventions
- Improved formatting

---

## Section 6 — Comments Added

- Added comments explaining:
  - Why validation is required
  - Why certain checks exist
  - Purpose of each function

---

## Section 7 — Logic Improvements

- Centralized category validation
- Used consistent filtering logic
- Prevented duplicate logic across functions

---

## Section 8 — Error Handling Improvements

- Standardized error messages
- Clear HTTP status codes
- Removed vague responses like `"bad"` or `"broken"`

---

## Final Outcome

The refactored codebase is now:
- Modular
- Readable
- Maintainable
- Scalable
- Production-ready

All original functionality has been preserved.