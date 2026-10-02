-- Migration: 005_create_interventions_table.sql
-- Description: Create INTERVENTIONS table for farm and crop interventions
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE interventions;

CREATE TABLE interventions (
    id NUMBER(19) PRIMARY KEY,
    farm_id NUMBER(19) NOT NULL,
    crop_id NUMBER(19),
    intervention_type VARCHAR2(100) NOT NULL,
    description VARCHAR2(2000),
    recommended_date DATE,
    implementation_date DATE,
    completion_date DATE,
    status VARCHAR2(50) NOT NULL DEFAULT 'RECOMMENDED',
    outcome VARCHAR2(1000),
    cost DECIMAL(15, 2),
    priority VARCHAR2(50) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT fk_interventions_farm_id FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT fk_interventions_crop_id FOREIGN KEY (crop_id) REFERENCES crops(id),
    CONSTRAINT chk_intervention_cost CHECK (cost >= 0 OR cost IS NULL),
    CONSTRAINT chk_intervention_status CHECK (status IN ('RECOMMENDED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    CONSTRAINT chk_intervention_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Create sequence
CREATE SEQUENCE seq_interventions_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_interventions_id
    BEFORE INSERT ON interventions
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_interventions_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_interventions_farm_id ON interventions(farm_id);
CREATE INDEX idx_interventions_crop_id ON interventions(crop_id);
CREATE INDEX idx_interventions_type ON interventions(intervention_type);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_interventions_priority ON interventions(priority);
CREATE INDEX idx_interventions_created_at ON interventions(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_interventions_updated_at
    BEFORE UPDATE ON interventions
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE interventions IS 'Farm and crop interventions for post-harvest loss prevention';
COMMENT ON COLUMN interventions.id IS 'Unique intervention identifier';
COMMENT ON COLUMN interventions.farm_id IS 'Reference to farm';
COMMENT ON COLUMN interventions.crop_id IS 'Reference to specific crop (optional)';
COMMENT ON COLUMN interventions.intervention_type IS 'Type of intervention';
COMMENT ON COLUMN interventions.description IS 'Detailed description of intervention';
COMMENT ON COLUMN interventions.recommended_date IS 'Date intervention was recommended';
COMMENT ON COLUMN interventions.implementation_date IS 'Date intervention was implemented';
COMMENT ON COLUMN interventions.completion_date IS 'Date intervention was completed';
COMMENT ON COLUMN interventions.status IS 'Intervention status';
COMMENT ON COLUMN interventions.outcome IS 'Outcome and results of intervention';
COMMENT ON COLUMN interventions.cost IS 'Cost of intervention';
COMMENT ON COLUMN interventions.priority IS 'Priority level';
COMMENT ON COLUMN interventions.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN interventions.updated_at IS 'Last update timestamp';
