ALTER TABLE notifications ADD COLUMN action_label text;
ALTER TABLE notifications ADD COLUMN dismissed_at timestamptz;
CREATE INDEX notifications_active_idx ON notifications (user_id, created_at DESC) WHERE dismissed_at IS NULL;




