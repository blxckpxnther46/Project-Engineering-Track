# 🧾 STATES AUDIT — ShopDash

## 📊 Current State Analysis

| Screen    | Loading State | Error State | Empty State | Current Behavior               |
| --------- | ------------- | ----------- | ----------- | ------------------------------ |
| Dashboard | ❌ Missing     | ❌ Missing   | ❌ Missing   | Blank cards area while loading |
| Orders    | ❌ Missing     | ❌ Missing   | ❌ Missing   | Empty list appears             |
| Products  | ❌ Missing     | ❌ Missing   | ❌ Missing   | Blank grid                     |
| Customers | ❌ Missing     | ❌ Missing   | ❌ Missing   | Empty table                    |

---

## 🔍 Observations

* While loading → UI appears **broken / empty**
* On error → user sees **nothing**
* On empty → no feedback or CTA
* No retry mechanism anywhere

---

## 🧠 Loading Strategy

* Lists (Orders, Products, Customers) → **Skeleton cards**
* Dashboard stats → **Skeleton boxes**

👉 Reason: Layout stability + better perceived performance

---

## ⚠️ Error State Copy

* Orders: "We couldn't load your orders. Try again."
* Products: "Inventory failed to load. Retry."
* Customers: "Customer data unavailable. Check connection."
* Dashboard: "Dashboard stats failed to load."

All include **Retry button**

---

## 📭 Empty States

* Orders:

  * Title: "No Orders Yet"
  * Message: "You haven't received any orders yet."
  * CTA: "Refresh"

* Products:

  * Title: "No Products Found"
  * Message: "Add your first product to get started."
  * CTA: "Add Product"

* Customers:

  * Title: "No Customers"
  * Message: "Customers will appear here once orders are placed."

---

## 🎯 Plan

* Build 3 reusable components:

  * SkeletonCard
  * ErrorMessage
  * EmptyState

* Integrate into ALL pages using:
  Loading → Error → Empty → Data

---
