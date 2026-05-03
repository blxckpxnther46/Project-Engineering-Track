# 🐛 BUG REPORT — ShopWave Dashboard

---

## Bug #1 — Infinite API Request Loop

**File:** `src/pages/ProductSearch.jsx`
**Line(s):** Around line where `useEffect` dependency array is defined 

---

### Expected Behaviour

* API should be called **only when the search query changes**
* One request per user input (or debounced)

---

### Actual Behaviour

* Thousands of API requests per second
* Browser tab freezes
* Network tab shows continuous repeated requests
* CPU usage spikes heavily

---

### Root Cause

The `useEffect` dependency array includes `results`, which is updated inside the same effect.

```js
useEffect(() => { ... }, [query, results])
```

Every time `setResults()` runs:

1. `results` changes
2. Effect runs again
3. Another API call is triggered
4. `setResults()` runs again

This creates an **infinite re-render loop**.

👉 This violates React’s rule:

> Effects should not depend on values they directly update unless intentionally required.

---

### Fix Applied

**Before**

```js
useEffect(() => {
  searchProducts(query).then(setResults);
}, [query, results]);
```

**After**

```js
useEffect(() => {
  searchProducts(query).then(setResults);
}, [query]);
```

Removed `results` from dependencies to stop the loop.

---

## Bug #2 — Stale Search Results (Race Condition)

**File:** `src/pages/ProductSearch.jsx`
**Line(s):** Same `useEffect` block 

---

### Expected Behaviour

* UI should always display results for the **latest query typed**
* Older API responses should not override newer ones

---

### Actual Behaviour

* Typing quickly shows incorrect (older) results
* Example:

  * Type "head" → request sent
  * Type "headphones" → second request sent
  * If "head" resolves later → UI shows wrong results

Network tab shows **multiple overlapping requests**

---

### Root Cause

No handling of asynchronous race conditions.

Multiple API calls are fired without:

* Debouncing input
* Cancelling previous requests
* Validating latest request before updating state

👉 This violates:

> React does not automatically handle async race conditions — developers must control which response updates state.

---

### Fix Applied

Added:

* **Debounce (300ms)**
* **Cleanup flag to ignore stale responses**

**After**

```js
useEffect(() => {
  if (!query.trim()) return;

  const timeout = setTimeout(() => {
    let isActive = true;

    searchProducts(query).then((data) => {
      if (isActive) setResults(data);
    });

    return () => {
      isActive = false;
    };
  }, 300);

  return () => clearTimeout(timeout);
}, [query]);
```

---

## Bug #3 — Order Status Not Updating

**File:** `src/pages/OrderManager.jsx`
**Line(s):** Inside `handleStatusChange` function 

---

### Expected Behaviour

* When order status changes:

  * UI should update immediately
  * Badge color should reflect new status

---

### Actual Behaviour

* API call succeeds (200 OK)
* UI does NOT update
* Users click multiple times thinking it failed

---

### Root Cause

Direct mutation of React state:

```js
const updatedOrders = orders;
order.status = newStatus;
setOrders(updatedOrders);
```

* `updatedOrders` references the **same array**
* React compares references → sees no change
* No re-render triggered

👉 This violates React rule:

> State must be treated as immutable — always return a new reference

---

### Fix Applied

Used immutable update pattern:

**After**

```js
setOrders((prev) =>
  prev.map((o) =>
    o.id === orderId ? { ...o, status: newStatus } : o
  )
);
```

* Creates new array
* Creates new object for updated item
* React detects change → re-renders UI

---

# ✅ Summary

| Bug | Issue         | Fix                          |
| --- | ------------- | ---------------------------- |
| 1   | Infinite loop | Removed incorrect dependency |
| 2   | Stale data    | Added debounce + cleanup     |
| 3   | No UI update  | Fixed state immutability     |

---

# 🎯 Final Outcome

* No more infinite API calls
* Search results always accurate
* Order status updates instantly
* App performance stabilized

---
