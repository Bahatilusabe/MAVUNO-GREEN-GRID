CREATE TABLE geo_places (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    source VARCHAR2(20) DEFAULT 'osm' NOT NULL,
    source_id VARCHAR2(80) NOT NULL,
    type VARCHAR2(30) NOT NULL CHECK (type IN ('market', 'cold_store', 'water')),
    name VARCHAR2(255),
    lat NUMBER(9, 6) NOT NULL,
    lng NUMBER(9, 6) NOT NULL,
    tags VARCHAR2(2000),
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT geo_places_src_uq UNIQUE (source, source_id)
);

CREATE INDEX geo_places_type_geo_idx ON geo_places (type, lat, lng);

CREATE TABLE geo_fetches (
    type VARCHAR2(30) NOT NULL,
    cell VARCHAR2(40) NOT NULL,
    radius_km NUMBER(5) NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT geo_fetches_pk PRIMARY KEY (type, cell, radius_km)
);

ALTER TABLE match_requests MODIFY (partner_id NULL);

ALTER TABLE match_requests ADD (place_id VARCHAR2(36) REFERENCES geo_places(id));

ALTER TABLE match_requests ADD (idempotency_key VARCHAR2(64));

ALTER TABLE match_requests ADD (notes VARCHAR2(1000));

ALTER TABLE match_requests ADD CONSTRAINT match_requests_target_chk CHECK (partner_id IS NOT NULL OR place_id IS NOT NULL);

CREATE UNIQUE INDEX match_requests_idem_uq ON match_requests (CASE WHEN idempotency_key IS NOT NULL THEN farmer_id END, idempotency_key);

DECLARE
  v_cond VARCHAR2(4000);
BEGIN
  FOR c IN (SELECT constraint_name, search_condition
              FROM user_constraints
             WHERE table_name = 'MATCH_REQUESTS' AND constraint_type = 'C') LOOP
    v_cond := c.search_condition;
    IF UPPER(v_cond) LIKE '%STATUS IN (%' THEN
      EXECUTE IMMEDIATE 'ALTER TABLE match_requests DROP CONSTRAINT "' || c.constraint_name || '"';
    END IF;
  END LOOP;
END;
/

ALTER TABLE match_requests ADD CONSTRAINT match_requests_status_chk CHECK (status IN ('pending', 'declined', 'cancelled', 'scheduled', 'in_transit', 'delivered'));