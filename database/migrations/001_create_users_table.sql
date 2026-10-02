-- Migration: 001_create_users_table.sql
-- Description: Create USERS table for all platform users
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE users;

-- Create USERS table
CREATE TABLE users (
    id NUMBER(19) PRIMARY KEY,
    full_name VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    phone VARCHAR2(30),
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(50) NOT NULL,
    location VARCHAR2(255),
    status VARCHAR2(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT chk_user_role CHECK (role IN ('FARMER', 'BUYER', 'PROCESSOR', 'STORAGE_PROVIDER', 'TRANSPORTER', 'RECOVERY_PARTNER', 'ADMIN', 'ANALYST')),
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'))
);

-- Create sequence for auto-increment ID
CREATE SEQUENCE seq_users_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_users_id
    BEFORE INSERT ON users
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_users_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_updated_at ON users(updated_at);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE users IS 'Central users table for all MAVUNO-GREEN-GRID platform users';
COMMENT ON COLUMN users.id IS 'Unique user identifier';
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: FARMER, BUYER, PROCESSOR, STORAGE_PROVIDER, TRANSPORTER, RECOVERY_PARTNER, ADMIN, ANALYST';
COMMENT ON COLUMN users.location IS 'User location or address';
COMMENT ON COLUMN users.status IS 'Account status: ACTIVE, INACTIVE, SUSPENDED, DELETED';
COMMENT ON COLUMN users.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN users.updated_at IS 'Last update timestamp';
