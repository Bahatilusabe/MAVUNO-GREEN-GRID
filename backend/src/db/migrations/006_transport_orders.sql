CREATE TABLE transport_requests (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    match_request_id VARCHAR2(36) UNIQUE REFERENCES match_requests(id) ON DELETE CASCADE,
    farmer_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id VARCHAR2(36) NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id VARCHAR2(36) REFERENCES crops(id) ON DELETE SET NULL,
    partner_id VARCHAR2(36) REFERENCES partners(id) ON DELETE SET NULL,
    place_id VARCHAR2(36) REFERENCES geo_places(id) ON DELETE SET NULL,
    load_weight_kg INTEGER NOT NULL CHECK (load_weight_kg > 0),
    pickup_lat NUMBER(9, 6),
    pickup_lng NUMBER(9, 6),
    transporter_id VARCHAR2(36) REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR2(30) DEFAULT 'pending' NOT NULL
        CHECK (status IN ('pending', 'accepted', 'planned', 'in_transit', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT transport_requests_target_chk CHECK (partner_id IS NOT NULL OR place_id IS NOT NULL)
);

CREATE INDEX transport_requests_farmer_idx ON transport_requests (farmer_id, created_at DESC);
CREATE INDEX transport_requests_farm_idx ON transport_requests (farm_id, created_at DESC);

CREATE OR REPLACE TRIGGER trg_transport_req_updated_at
    BEFORE UPDATE ON transport_requests
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/
