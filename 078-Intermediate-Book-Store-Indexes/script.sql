SELECT * FROM customers LIMIT 10;
SELECT * FROM orders LIMIT 10;
SELECT * FROM books LIMIT 10;

SELECT * FROM pg_indexes WHERE tablename = 'customers';
SELECT * FROM pg_indexes WHERE tablename = 'books';
SELECT * FROM pg_indexes WHERE tablename = 'orders';

EXPLAIN ANALYZE SELECT customer_id, quantity FROM orders WHERE quantity > 18;

CREATE INDEX orders_customer_quantity ON orders(customer_id,quantity);

EXPLAIN ANALYZE SELECT customer_id, quantity FROM orders WHERE quantity > 18;

ALTER TABLE customers
  ADD CONSTRAINT customers_pkey
  PRIMARY KEY (customer_id);

EXPLAIN ANALYZE SELECT * FROM customers WHERE customer_id < 100;

SELECT * FROM customers LIMIT 10;

CREATE INDEX orders_customer_book ON orders(customer_id,book_id);

DROP INDEX IF EXISTS orders_customer_book;

CREATE INDEX orders_customer_book ON orders(customer_id,book_id);

EXPLAIN ANALYZE SELECT * FROM orders WHERE (quantity * price_base > 100);

CREATE INDEX orders_total_price ON orders((quantity*price_base));

EXPLAIN ANALYZE SELECT * FROM orders WHERE (quantity*price_base > 100);

SELECT * FROM pg_indexes WHERE tablename IN ('customers','books') ORDER BY tablename, indexname;