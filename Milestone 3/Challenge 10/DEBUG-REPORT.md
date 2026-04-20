# DEBUG-REPORT.md

## Bug 1: Orphan Orders (NULL customer_name)

### Root Cause
Missing FOREIGN KEY constraint on orders.customer_id

### Fix
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(id);

---

## Bug 2: Negative Inventory

### Root Cause
No CHECK constraint on products.inventory_count

### Fix
ALTER TABLE products
ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_count >= 0);

---

## Bug 3: Duplicate Payments

### Root Cause
No UNIQUE constraint on payments.order_id

### Fix
ALTER TABLE payments
ADD CONSTRAINT unique_payment_per_order UNIQUE (order_id);
