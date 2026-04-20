-- Fixed Schema

ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(id);

ALTER TABLE products
ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_count >= 0);

ALTER TABLE payments
ADD CONSTRAINT unique_payment_per_order UNIQUE (order_id);
