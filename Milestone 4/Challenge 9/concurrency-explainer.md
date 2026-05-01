# Concurrency Explainer

The original system used a check-then-insert approach which fails under concurrent load. Two users can both see the seat as available and both proceed to book it.

This creates a race condition because the check and insert are separate operations. The solution is to enforce uniqueness at the database level using a composite unique constraint on seatId and showId.

The rate limiter prevents excessive requests and protects the server but does not stop race conditions.

When duplicate inserts occur, Prisma throws a P2002 error. This is caught and converted into a 409 Conflict response.

This ensures one request succeeds and others fail gracefully.