-- Migration: 002_create_farms_table.sql
-- Description: Create FARMS table for farm information
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE farms;

CREATE TABLE farms (
    id NUMBER(19) PRIMARY KEY,
    user_id NUMBER(19) NOT NULL,
    name VARCHAR2(255) NOT NULL,
    location VARCHAR2(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    size_hectares DECIMAL(10, 2),
    soil_type VARCHAR2(100),
    climate_zone VARCHAR2(100),
    status VARCHAR2(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT fk_farms_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_farm_size CHECK (size_hectares > 0),
    CONSTRAINT chk_farm_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

-- Create sequence
CREATE SEQUENCE seq_farms_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_farms_id
    BEFORE INSERT ON farms
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_farms_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_farms_status ON farms(status);
CREATE INDEX idx_farms_location ON farms(location);
CREATE INDEX idx_farms_created_at ON farms(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_farms_updated_at
    BEFORE UPDATE ON farms
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE farms IS 'Farm information and profiles';
COMMENT ON COLUMN farms.id IS 'Unique farm identifier';
COMMENT ON COLUMN farms.user_id IS 'Reference to farm owner (farmer)';
COMMENT ON COLUMN farms.name IS 'Farm name';
COMMENT ON COLUMN farms.location IS 'Farm location/address';
COMMENT ON COLUMN farms.latitude IS 'Farm latitude coordinate';
COMMENT ON COLUMN farms.longitude IS 'Farm longitude coordinate';
COMMENT ON COLUMN farms.size_hectares IS 'Total farm size in hectares';
COMMENT ON COLUMN farms.soil_type IS 'Soil type classification';
COMMENT ON COLUMN farms.climate_zone IS 'Climate zone classification';
COMMENT ON COLUMN farms.status IS 'Farm status: ACTIVE, INACTIVE, ARCHIVED';
COMMENT ON COLUMN farms.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN farms.updated_at IS 'Last update timestamp';
