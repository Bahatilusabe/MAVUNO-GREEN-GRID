-- Migration: 004_create_resources_table.sql
-- Description: Create RESOURCES table for farm resources and inventory
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE resources;

CREATE TABLE resources (
    id NUMBER(19) PRIMARY KEY,
    farm_id NUMBER(19) NOT NULL,
    resource_type VARCHAR2(100) NOT NULL,
    name VARCHAR2(255) NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    unit VARCHAR2(50) NOT NULL,
    status VARCHAR2(50) NOT NULL DEFAULT 'AVAILABLE',
    purchase_date DATE,
    expiry_date DATE,
    cost DECIMAL(15, 2),
    supplier VARCHAR2(255),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT fk_resources_farm_id FOREIGN KEY (farm_id) REFERENCES farms(id),
    CONSTRAINT chk_resource_qty CHECK (quantity >= 0),
    CONSTRAINT chk_resource_cost CHECK (cost >= 0 OR cost IS NULL),
    CONSTRAINT chk_resource_status CHECK (status IN ('AVAILABLE', 'IN_USE', 'DEPLETED', 'EXPIRED', 'ARCHIVED'))
);

-- Create sequence
CREATE SEQUENCE seq_resources_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_resources_id
    BEFORE INSERT ON resources
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_resources_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_resources_farm_id ON resources(farm_id);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_expiry ON resources(expiry_date);
CREATE INDEX idx_resources_created_at ON resources(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE resources IS 'Farm resources inventory (seeds, fertilizer, equipment, etc.)';
COMMENT ON COLUMN resources.id IS 'Unique resource identifier';
COMMENT ON COLUMN resources.farm_id IS 'Reference to farm';
COMMENT ON COLUMN resources.resource_type IS 'Type of resource (SEEDS, FERTILIZER, PESTICIDE, EQUIPMENT, etc.)';
COMMENT ON COLUMN resources.name IS 'Resource name/description';
COMMENT ON COLUMN resources.quantity IS 'Available quantity';
COMMENT ON COLUMN resources.unit IS 'Unit of measurement (KG, LITERS, UNITS, etc.)';
COMMENT ON COLUMN resources.status IS 'Resource status';
COMMENT ON COLUMN resources.purchase_date IS 'Date resource was purchased';
COMMENT ON COLUMN resources.expiry_date IS 'Resource expiry date';
COMMENT ON COLUMN resources.cost IS 'Purchase cost';
COMMENT ON COLUMN resources.supplier IS 'Supplier name';
COMMENT ON COLUMN resources.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN resources.updated_at IS 'Last update timestamp';
