--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sensors; Type: SCHEMA; Schema: -; Owner: dustinwilson
--

DROP SCHEMA IF EXISTS sensors CASCADE;

CREATE SCHEMA sensors;


ALTER SCHEMA sensors OWNER TO ccuser;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

-- SET default_table_access_method = heap;

--
-- Name: observations; Type: TABLE; Schema: sensors; Owner: dustinwilson
--

CREATE TABLE sensors.observations (
    id text PRIMARY KEY,
    datetime timestamp without time zone,
    location_id int,
    duration double precision,
    distance double precision,
    category text
);

create index on sensors.observations using btree(location_id, datetime);


ALTER TABLE sensors.observations OWNER TO ccuser;

--
-- Data for Name: observations; Type: TABLE DATA; Schema: sensors; Owner: dustinwilson
--

\COPY sensors.observations (id, datetime, location_id, duration, distance, category) FROM './original_obs_types.csv' WITH DELIMITER ',' CSV HEADER;

ALTER TABLE sensors.observations SET (autovacuum_enabled=true);

--
-- PostgreSQL database dump complete
--

