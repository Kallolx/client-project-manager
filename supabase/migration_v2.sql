-- ============================================
-- kallol.me Client Manager — Migration
-- ============================================

-- Add Logo and Currency columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BDT';

-- Update RLS policies to be sure
CREATE POLICY "Admin can update project logo" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
