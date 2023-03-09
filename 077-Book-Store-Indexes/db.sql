DROP SCHEMA IF EXISTS cc_user CASCADE;
CREATE SCHEMA cc_user;
SET SEARCH_PATH = cc_user;

CREATE TABLE customers
	(
	customer_id		INTEGER			GENERATED ALWAYS AS IDENTITY	PRIMARY KEY,
	first_name		VARCHAR(100)	NOT NULL,
	last_name		VARCHAR(100)	NOT NULL,
	email_address	VARCHAR(300)	NULL,
	home_phone		VARCHAR(100)	NULL,
	city				VARCHAR(50)		NULL,
	state_name		VARCHAR(50)		NULL,
	years_old		INTEGER			NULL
	);

CREATE TABLE books
	(
	book_id					INTEGER			GENERATED ALWAYS AS IDENTITY	PRIMARY KEY,
	title						VARCHAR(100)	NOT NULL,
	author					VARCHAR(100)	NOT NULL,
	original_language		VARCHAR(50)		NOT NULL,
	first_published		INTEGER			NULL,
	sales_in_millions		DECIMAL(8,2)	NULL,
	price						DECIMAL(8,2)	NULL
	);

CREATE TABLE orders
	(
	order_id			INTEGER			GENERATED ALWAYS AS IDENTITY	PRIMARY KEY,
	customer_id		INTEGER			NOT NULL,
	book_id			INTEGER			NOT NULL,
	quantity			INTEGER			NOT NULL,
	price_base		DECIMAL(8,2)	NOT NULL,
	order_date		DATE				NOT NULL,
	ship_date		DATE				NULL
	);

\COPY customers FROM 'customers.txt' DELIMITER ',' CSV HEADER;
\COPY books FROM 'books.txt' DELIMITER ',' CSV HEADER;
\COPY orders FROM 'orders.txt' DELIMITER ',' CSV HEADER;