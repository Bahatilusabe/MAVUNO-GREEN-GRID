-- Migration: 006_create_transactions_table.sql
-- Description: Create TRANSACTIONS table for financial transactions and market activities
-- Author: MAVUNO-GREEN-GRID
-- Created: 2026-10-02
-- Rollback: DROP TABLE transactions;

CREATE TABLE transactions (
    id NUMBER(19) PRIMARY KEY,
    buyer_id NUMBER(19) NOT NULL,
    seller_id NUMBER(19) NOT NULL,
    crop_id NUMBER(19),
    transaction_type VARCHAR2(50) NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    unit VARCHAR2(50) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR2(50) NOT NULL DEFAULT 'PENDING',
    payment_status VARCHAR2(50) NOT NULL DEFAULT 'UNPAID',
    delivery_status VARCHAR2(50) NOT NULL DEFAULT 'PENDING',
    transaction_date TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    payment_date DATE,
    notes VARCHAR2(1000),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT fk_trans_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
    CONSTRAINT fk_trans_seller FOREIGN KEY (seller_id) REFERENCES users(id),
    CONSTRAINT fk_trans_crop FOREIGN KEY (crop_id) REFERENCES crops(id),
    CONSTRAINT chk_trans_qty CHECK (quantity > 0),
    CONSTRAINT chk_trans_price CHECK (unit_price >= 0),
    CONSTRAINT chk_trans_type CHECK (transaction_type IN ('PURCHASE', 'SALE', 'TRADE', 'TRANSFER')),
    CONSTRAINT chk_trans_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED')),
    CONSTRAINT chk_delivery_status CHECK (delivery_status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'))
);

-- Create sequence
CREATE SEQUENCE seq_transactions_id
    START WITH 1
    INCREMENT BY 1
    NOCYCLE;

-- Create trigger for auto-increment ID
CREATE OR REPLACE TRIGGER trg_transactions_id
    BEFORE INSERT ON transactions
    FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        :NEW.id := seq_transactions_id.NEXTVAL;
    END IF;
END;
/

-- Create indexes
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_crop ON transactions(crop_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_payment ON transactions(payment_status);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

-- Partition by transaction_date (monthly)
-- This can be added later when table grows

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- Add comments
COMMENT ON TABLE transactions IS 'Financial transactions and market activities';
COMMENT ON COLUMN transactions.id IS 'Unique transaction identifier';
COMMENT ON COLUMN transactions.buyer_id IS 'Reference to buyer user';
COMMENT ON COLUMN transactions.seller_id IS 'Reference to seller user';
COMMENT ON COLUMN transactions.crop_id IS 'Reference to crop being transacted';
COMMENT ON COLUMN transactions.transaction_type IS 'Type of transaction';
COMMENT ON COLUMN transactions.quantity IS 'Quantity transacted';
COMMENT ON COLUMN transactions.unit IS 'Unit of measurement';
COMMENT ON COLUMN transactions.unit_price IS 'Price per unit';
COMMENT ON COLUMN transactions.total_amount IS 'Total transaction amount';
COMMENT ON COLUMN transactions.status IS 'Transaction status';
COMMENT ON COLUMN transactions.payment_status IS 'Payment status';
COMMENT ON COLUMN transactions.delivery_status IS 'Delivery status';
COMMENT ON COLUMN transactions.transaction_date IS 'Date transaction occurred';
COMMENT ON COLUMN transactions.payment_date IS 'Date payment was made';
COMMENT ON COLUMN transactions.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN transactions.updated_at IS 'Last update timestamp';
