# 🔧 Changes Made – Caching Fix

## 📌 Overview

The backend system had a caching layer that improved speed but caused major inconsistencies such as stale data, incorrect responses, and memory leaks. The goal was to fix these issues and make the system reliable.

---

## ❌ Issues Identified

### 1. Global Cache Key

* A single cache key (`global_data_key`) was used for all requests
* Caused incorrect data sharing across endpoints

---

### 2. Promise Stored in Cache

* Missing `await` resulted in Promises being cached instead of actual data
* Led to unpredictable responses

---

### 3. No Cache Invalidation

* After DELETE or POST operations, cache was not cleared
* Result: deleted tasks still appeared

---

### 4. Null Values Cached

* If a task was not found, `null` was cached permanently
* Result: incorrect responses for valid future requests

---

### 5. Missing TTL (Time-To-Live)

* Cache entries never expired
* Result: memory usage kept increasing

---

### 6. Wrong HTTP Status Codes

* Used `200` for all responses
* Violated REST API standards

---

### 7. Errors Swallowed

* Errors were only logged using `console.log`
* No response sent → requests hung indefinitely

---

## ✅ Improvements Implemented

### 1. Namespaced Cache Keys

* `tasks:list` for all tasks
* `task:{id}` for individual tasks

✔ Prevents data collision

---

### 2. Proper Async Handling

* Added `await` to all Prisma queries
* Ensured only resolved data is cached

---

### 3. Cache Invalidation

* On POST → clear `tasks:list`
* On DELETE → clear both list and individual cache

✔ Ensures fresh data is always returned

---

### 4. Prevent Null Caching

* Cache is only set if valid data exists

✔ Avoids incorrect responses

---

### 5. TTL Added

* Each cache entry expires after 60 seconds

✔ Prevents memory leaks and stale data

---

### 6. Correct Status Codes

* `200` → success
* `201` → created
* `204` → delete success
* `404` → not found
* `500` → server error

---

### 7. Proper Error Handling

* Errors now return structured JSON responses
* No hanging requests

---

## 🧠 Result

The system is now:

* ✅ Consistent
* ✅ Reliable
* ✅ Memory-efficient
* ✅ Predictable

Caching now improves performance **without breaking data integrity**.
