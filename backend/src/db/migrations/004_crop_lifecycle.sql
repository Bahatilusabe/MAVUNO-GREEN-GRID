ALTER TABLE crops ADD (variety VARCHAR2(100));

ALTER TABLE crops ADD (planting_date DATE);

ALTER TABLE crops ADD (actual_harvest_date DATE);

ALTER TABLE crops ADD (actual_kg INTEGER);

ALTER TABLE crops ADD (status VARCHAR2(30) DEFAULT 'growing' NOT NULL);

ALTER TABLE crops ADD CONSTRAINT crops_status_chk CHECK (status IN ('planned', 'growing', 'ready_to_harvest', 'harvested', 'sold', 'lost'));

ALTER TABLE crops ADD CONSTRAINT crops_actual_kg_chk CHECK (actual_kg IS NULL OR actual_kg >= 0);