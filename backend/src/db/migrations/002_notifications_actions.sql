ALTER TABLE notifications ADD (action_label VARCHAR2(255));

ALTER TABLE notifications ADD (dismissed_at TIMESTAMP WITH TIME ZONE);

CREATE INDEX notifications_active_idx ON notifications (user_id, dismissed_at, created_at DESC);