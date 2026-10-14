CREATE TABLE match_offers (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    match_id VARCHAR2(36) NOT NULL REFERENCES match_requests(id) ON DELETE CASCADE,
    made_by_user_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    made_by_role VARCHAR2(10) NOT NULL CHECK (made_by_role IN ('farmer', 'partner')),
    price_per_kg NUMBER(12, 2) NOT NULL CHECK (price_per_kg > 0),
    status VARCHAR2(12) DEFAULT 'pending' NOT NULL
        CHECK (status IN ('pending', 'accepted', 'declined', 'superseded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX match_offers_match_idx ON match_offers (match_id, created_at);

CREATE UNIQUE INDEX match_offers_one_pending_uq ON match_offers (CASE WHEN status = 'pending' THEN match_id END);

CREATE TABLE deal_messages (
    id VARCHAR2(36) DEFAULT SYS_GUID() PRIMARY KEY,
    match_id VARCHAR2(36) NOT NULL REFERENCES match_requests(id) ON DELETE CASCADE,
    sender_id VARCHAR2(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_role VARCHAR2(10) NOT NULL CHECK (sender_role IN ('farmer', 'partner')),
    body VARCHAR2(2000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
);

CREATE INDEX deal_messages_match_idx ON deal_messages (match_id, created_at);

ALTER TABLE notifications ADD (match_id VARCHAR2(36) REFERENCES match_requests(id) ON DELETE CASCADE);

INSERT INTO match_offers (match_id, made_by_user_id, made_by_role, price_per_kg, status)
SELECT id, farmer_id, 'farmer', price_per_kg, 'pending'
  FROM match_requests
 WHERE status = 'pending' AND partner_id IS NOT NULL;