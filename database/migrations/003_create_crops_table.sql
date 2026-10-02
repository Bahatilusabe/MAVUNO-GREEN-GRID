-- Migration: 003_create_crops_table.sql
-- Description: Create CROPS table for crop information
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE crops;

CREATE TABLE crops (
    id NUMBER(19) PRIMARY KEY,
    farm_id NUMBER(19) NOT NULL,
    crop_type VARCHAR2(100) NOT NULL,
    variety VARCHAR2(100),
    planting_date DATE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    area_planted DECIMAL(10, 2),
    expected_yield DECIMAL(15, 2),
    actual_yield DECIMAL(15, 2),
    yield_unit VARCHAR2(50) DEFAULT 'KG',
    status VARCHAR2(50) NOT NULL DEFAULT 'PLANNING',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT fk_crops_farm_id FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT chk_crop_area CHECK (area_planted > 0),
    CONSTRAINT chk_crop_yield CHECK (actual_yield >= 0 OR actual_yield IS NULL),
    CONSTRAINT chk_crop_dates CHECK (expected_harvest_date >= planting_date OR expected_harvest_date IS NULL),
    CONSTRAINT chk_crop_status CHECK (status IN ('PLANNING', 'PLANTED', 'GROWING', 'READY_TO_HARVEST', 'HARVESTED', 'ARCHIVED'))
);

-- Create sequence
CREATE SEQUENCE seq_crops_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_crops_id
    BEFORE INSERT ON crops
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_crops_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_crops_farm_id ON crops(farm_id);
CREATE INDEX idx_crops_crop_type ON crops(crop_type);
CREATE INDEX idx_crops_status ON crops(status);
CREATE INDEX idx_crops_planting_date ON crops(planting_date);
CREATE INDEX idx_crops_created_at ON crops(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_crops_updated_at
    BEFORE UPDATE ON crops
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE crops IS 'Crop information and planting records';
COMMENT ON COLUMN crops.id IS 'Unique crop identifier';
COMMENT ON COLUMN crops.farm_id IS 'Reference to parent farm';
COMMENT ON COLUMN crops.crop_type IS 'Type of crop (e.g., MAIZE, BEANS, WHEAT)';
COMMENT ON COLUMN crops.variety IS 'Specific variety of crop';
COMMENT ON COLUMN crops.planting_date IS 'Date crop was planted';
COMMENT ON COLUMN crops.expected_harvest_date IS 'Anticipated harvest date';
COMMENT ON COLUMN crops.actual_harvest_date IS 'Actual harvest date';
COMMENT ON COLUMN crops.area_planted IS 'Area planted in hectares';
COMMENT ON COLUMN crops.expected_yield IS 'Expected yield amount';
COMMENT ON COLUMN crops.actual_yield IS 'Actual yield amount';
COMMENT ON COLUMN crops.yield_unit IS 'Unit of yield measurement';
COMMENT ON COLUMN crops.status IS 'Crop lifecycle status';
COMMENT ON COLUMN crops.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN crops.updated_at IS 'Last update timestamp';
