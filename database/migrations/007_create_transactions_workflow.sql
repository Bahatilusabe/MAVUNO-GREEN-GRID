-- Migration: Create Transport and Storage Workflows
-- Database: Oracle SQL

-- Transport Requests Table
CREATE TABLE transport_requests (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    farm_id VARCHAR2(36) NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    transporter_id VARCHAR2(36) REFERENCES users(id), -- Can be null until 'ACCEPTED'
    load_weight_kg NUMBER(15, 2) NOT NULL CHECK (load_weight_kg > 0),
    pickup_lat NUMBER(9, 6), -- Replaces PostGIS geometry point for Oracle compatibility
    pickup_lng NUMBER(9, 6),
    status VARCHAR2(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'PLANNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

-- Trigger for transport_requests updated_at
CREATE OR REPLACE TRIGGER trg_transport_req_updated_at
    BEFORE UPDATE ON transport_requests
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Storage Reservations Table
CREATE TABLE storage_reservations (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    farm_id VARCHAR2(36) NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    facility_id VARCHAR2(36) NOT NULL,
    volume_tonnes NUMBER(15, 2) NOT NULL CHECK (volume_tonnes > 0),
    status VARCHAR2(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'CONFIRmed', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

-- Trigger for storage_reservations updated_at
CREATE OR REPLACE TRIGGER trg_storage_res_updated_at
    BEFORE UPDATE ON storage_reservations
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Create Indexes
CREATE INDEX idx_transport_farm ON transport_requests(farm_id);
CREATE INDEX idx_transport_status ON transport_requests(status);
CREATE INDEX idx_storage_farm ON storage_reservations(farm_id);
CREATE INDEX idx_storage_status ON storage_reservations(status);