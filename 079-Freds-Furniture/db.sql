DROP SCHEMA IF EXISTS cc_user CASCADE;
CREATE SCHEMA cc_user;
SET SEARCH_PATH = cc_user;

/* create the store table */
CREATE TABLE store (
  "order_id" INTEGER PRIMARY KEY,
  "order_date" DATE,
  "customer_id" INTEGER,
  "customer_phone" VARCHAR(12),
  "customer_email" TEXT,
  "item_1_id" INTEGER,
  "item_1_name" VARCHAR(100),
  "item_1_price" NUMERIC,
  "item_2_id" INTEGER,
  "item_2_name" VARCHAR(100),
  "item_2_price" NUMERIC,
  "item_3_id" INTEGER,
  "item_3_name" VARCHAR(100),
  "item_3_price" NUMERIC
);

/* enter data from store.txt into the table */
\copy store FROM 'store.txt' delimiter ',' NULL AS 'NULL' csv header