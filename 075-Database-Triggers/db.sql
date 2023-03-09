DROP SCHEMA IF EXISTS cc_user CASCADE;
CREATE SCHEMA cc_user;
SET SEARCH_PATH = cc_user;

CREATE TABLE customers
	(
	customer_id		INTEGER			GENERATED ALWAYS AS IDENTITY	PRIMARY KEY,
	--ADD a username, MODIFY the INDEXes AS needed, UPDATE the bulk file LOAD, esnure that the username IS UNIQUE, maybe ADD a NUMBER WHEN already EXISTS.
	first_name		VARCHAR(100)	NOT NULL,
	last_name		VARCHAR(100)	NOT NULL,
	email_address	VARCHAR(300)	NULL,
	home_phone		VARCHAR(100)	NULL,
	city				VARCHAR(50)		NULL,
	state_name		VARCHAR(50)		NULL,
	years_old		INTEGER			NULL
	);
	
CREATE TABLE customers_log
	(
	changed_by	VARCHAR(100)	NOT NULL,
	time_changed	TIMESTAMP	NOT NULL,
	change_type	VARCHAR(100)	NOT NULL
	);

CREATE OR REPLACE FUNCTION override_with_min_age() RETURNS TRIGGER AS $$
	BEGIN
		NEW.years_old := 13;
		RETURN NEW;
	END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION log_customers_change() RETURNS TRIGGER AS $$
	BEGIN
		IF (TG_OP = 'UPDATE') THEN
			IF (NEW.first_name <> OLD.first_name OR NEW.last_name <> OLD.last_name) THEN
				INSERT INTO customers_log (changed_by, time_changed, change_type) VALUES (User, DATE_TRUNC('minute',NOW()), 'UPDATE');
			END IF;
		END IF;
		IF (TG_OP = 'INSERT') THEN
			INSERT INTO customers_log (changed_by, time_changed, change_type) VALUES (User, DATE_TRUNC('minute',NOW()), 'INSERT');
		END IF;
		RETURN NEW;
	END;
$$ LANGUAGE PLPGSQL;

\COPY customers FROM 'customers.txt' DELIMITER ',' CSV HEADER;

select setval(pg_get_serial_sequence('customers', 'customer_id'), 
              (select max(customer_id) from customers) 
       ); 
