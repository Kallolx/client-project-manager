-- ============================================
-- kallol.me Client Manager — Supabase Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  project_code TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  company_name TEXT DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  project_name TEXT NOT NULL,
  project_description TEXT NOT NULL DEFAULT '',
  target_audience TEXT DEFAULT '',
  deadline TEXT DEFAULT '',
  brand_colors TEXT DEFAULT '',
  existing_website TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  project_type TEXT NOT NULL DEFAULT 'landing-page',
  features TEXT[] DEFAULT '{}',
  pages INTEGER DEFAULT 1,
  design_complexity TEXT DEFAULT 'moderate',
  responsive BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT FALSE,
  reference_links TEXT[] DEFAULT '{}',
  final_price NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' NOT NULL,
  status TEXT DEFAULT 'under-review' NOT NULL,
  progress INTEGER DEFAULT 5,
  admin_notes TEXT DEFAULT ''
);

-- ============================================
-- PROJECT FILES TABLE
-- ============================================
CREATE TABLE project_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- PAYMENT RECORDS TABLE
-- ============================================
CREATE TABLE payment_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT '',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT DEFAULT '',
  amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_projects_email ON projects(email);
CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_payment ON projects(payment_status);
CREATE INDEX idx_project_files_project ON project_files(project_id);
CREATE INDEX idx_payment_records_project ON payment_records(project_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Projects
CREATE POLICY "Anyone can create projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Project Files
CREATE POLICY "Anyone can insert project files" ON project_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read project files" ON project_files FOR SELECT USING (true);
CREATE POLICY "Admin can delete project files" ON project_files FOR DELETE USING (auth.role() = 'authenticated');

-- Payment Records
CREATE POLICY "Admin can insert payment records" ON payment_records FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anyone can read payment records" ON payment_records FOR SELECT USING (true);
CREATE POLICY "Admin can update payment records" ON payment_records FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete payment records" ON payment_records FOR DELETE USING (auth.role() = 'authenticated');

-- Invoices
CREATE POLICY "Admin can insert invoices" ON invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anyone can read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Admin can delete invoices" ON invoices FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload project files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-files');
CREATE POLICY "Admin can manage project files" ON storage.objects FOR SELECT USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');
