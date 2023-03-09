SELECT * FROM customers LIMIT 10;
SELECT * FROM orders LIMIT 10;
SELECT * FROM books LIMIT 10;

SELECT *
FROM pg_indexes
WHERE tablename = 'customers';

SELECT *
FROM pg_indexes
WHERE tablename = 'books';

SELECT *
FROM pg_indexes
WHERE tablename = 'orders';

CREATE INDEX orders_customer_book ON orders(customer_id,book_id);

EXPLAIN ANALYZE SELECT original_language, title, sales_in_millions FROM books WHERE original_language = 'French';

SELECT pg_size_pretty(pg_total_relation_size('books'));

CREATE INDEX books_language_titles_copies ON books(original_language,title,sales_in_millions);

EXPLAIN ANALYZE SELECT original_language, title, sales_in_millions FROM books;

DROP INDEX IF EXISTS books_language_titles_copies;

DROP INDEX IF EXISTS orders_customer_book;

SELECT NOW();
 
\COPY orders FROM 'orders_add.txt' DELIMITER ',' CSV HEADER;
 
SELECT NOW();
