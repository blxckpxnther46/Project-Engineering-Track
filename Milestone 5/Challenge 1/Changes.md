# 🧾 Orders Dashboard — UX States Implementation

## 📌 Overview

This project improves the **Orders Dashboard** by implementing all four essential UX states for async data fetching:

* Loading
* Success
* Empty
* Error

Previously, the dashboard showed a blank screen or raw data, creating confusion for users. These changes ensure the UI clearly communicates what’s happening at all times.

---

## 🚀 What Was Implemented

### 1. ⏳ Loading State

* Added animated **skeleton rows**
* Mimics actual table structure
* Prevents layout shift and reassures users that data is loading

---

### 2. ✅ Success State

* Displays full orders table with:

  * Order ID
  * Customer Name
  * Product
  * Amount
  * Status
  * Date
* Clean mapping using reusable `OrderRow` component

---

### 3. 📭 Empty State

* Custom UI instead of blank table
* Includes:

  * Icon (📭)
  * Clear heading: *"No Orders Found"*
  * Helpful message
  * CTA button ("Create Order")

---

### 4. ⚠️ Error State

* Displays real error message from API
* Includes:

  * Visual indicator (⚠️)
  * Clear explanation
  * Functional **Retry button**
* Retry triggers API call again

---

## 🔁 State Handling Logic

Conditional rendering inside `<tbody>`:

```jsx
{loading && <SkeletonRows />}
{!loading && error && <ErrorState />}
{!loading && !error && orders.length === 0 && <EmptyState />}
{!loading && !error && orders.length > 0 && <SuccessTable />}
```

This ensures all possible async outcomes are handled.

---

## 🧪 Testing

Modify `SIMULATE` in `mockApi.js`:

```js
export const SIMULATE = 'loading'
```

| Mode    | Result              |
| ------- | ------------------- |
| loading | Shows skeleton UI   |
| success | Displays orders     |
| empty   | Shows empty state   |
| error   | Shows error + retry |

---

## 🧠 Key Improvements

* Eliminates user confusion
* Prevents blank screen experience
* Improves perceived performance
* Adds clear recovery paths for failures
* Makes UI predictable and user-friendly

---

## 📦 Tech Stack

* React (Hooks)
* Vite
* Custom CSS variables

---

## 🎯 Conclusion

The dashboard now properly communicates system state at all times.
Instead of leaving users guessing, it provides **clarity, feedback, and control** — which is critical for real-world applications.

---
