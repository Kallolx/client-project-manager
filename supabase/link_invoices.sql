-- Link invoices to specific payments
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payment_records(id) ON DELETE SET NULL;
