CREATE TABLE users (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    phone VARCHAR2(50),
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(50) NOT NULL CHECK (role IN ('farmer', 'partner', 'admin')),
    status VARCHAR2(50) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'pending', 'suspended')),
    county VARCHAR2(100),
    language VARCHAR2(10) DEFAULT 'en' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE farms (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    owner_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR2(255) NOT NULL,
    county VARCHAR2(100) NOT NULL,
    sub_county VARCHAR2(100),
    area_ha NUMBER(8, 2) NOT NULL CHECK (area_ha > 0),
    farm_type VARCHAR2(100) DEFAULT 'Smallholder' NOT NULL,
    water_source VARCHAR2(100),
    irrigation VARCHAR2(100),
    lat NUMBER(9, 6),
    lng NUMBER(9, 6),
    photo_url VARCHAR2(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX farms_owner_idx ON farms (owner_id);

CREATE TABLE crops (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    farm_id VARCHAR2(36) NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR2(255) NOT NULL,
    stage VARCHAR2(100),
    expected_kg INTEGER DEFAULT 0 NOT NULL CHECK (expected_kg >= 0),
    expected_harvest DATE,
    risk VARCHAR2(50) DEFAULT 'low' NOT NULL CHECK (risk IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX crops_farm_idx ON crops (farm_id);

CREATE TABLE partners (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    user_id VARCHAR2(36) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR2(255) NOT NULL,
    type VARCHAR2(50) NOT NULL CHECK (type IN ('buyer', 'processor', 'storage', 'transport')),
    county VARCHAR2(100),
    lat NUMBER(9, 6),
    lng NUMBER(9, 6),
    price_per_kg NUMBER(8, 2),
    capacity_kg INTEGER,
    accepting NUMBER(1) DEFAULT 1 NOT NULL CHECK (accepting IN (0, 1)),
    status VARCHAR2(50) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE TABLE match_requests (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    farmer_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_id VARCHAR2(36) NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    crop_id VARCHAR2(36) REFERENCES crops(id) ON DELETE SET NULL,
    kg INTEGER NOT NULL CHECK (kg > 0),
    price_per_kg NUMBER(8, 2) NOT NULL,
    pickup_date DATE,
    status VARCHAR2(50) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'declined', 'scheduled', 'in_transit', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX match_requests_partner_idx ON match_requests (partner_id, status);
CREATE INDEX match_requests_farmer_idx ON match_requests (farmer_id);

-- Oracle Trigger to automatically handle updated_at for match_requests
CREATE OR REPLACE TRIGGER trg_match_req_updated_at
    BEFORE UPDATE ON match_requests
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

CREATE TABLE notifications (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind VARCHAR2(50) NOT NULL CHECK (kind IN ('alert', 'message', 'system')),
    icon VARCHAR2(100) NOT NULL,
    tone VARCHAR2(50) NOT NULL,
    title VARCHAR2(255) NOT NULL,
    body VARCHAR2(4000),
    action_to VARCHAR2(255),
    unread NUMBER(1) DEFAULT 1 NOT NULL CHECK (unread IN (0, 1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX notifications_user_idx ON notifications (user_id, created_at DESC);