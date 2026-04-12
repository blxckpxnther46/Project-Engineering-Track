-- UPDATED PRODUCT QUERIES (NORMALIZED)

-- Query 1: Get all products
SELECT * FROM products;


-- Query 2: Find products under a specific category
SELECT p.*
FROM products p
JOIN product_categories pc ON p.product_id = pc.product_id
JOIN categories c ON pc.category_id = c.category_id
WHERE c.category_name = 'Electronics';


-- Query 3: Find supplier details for a product
SELECT p.product_name, s.supplier_name, s.supplier_phone
FROM products p
JOIN suppliers s ON p.supplier_id = s.supplier_id;


-- Query 4: Find products with low stock
SELECT p.product_name, i.stock_quantity
FROM products p
JOIN inventory i ON p.product_id = i.product_id
WHERE i.stock_quantity < 10;