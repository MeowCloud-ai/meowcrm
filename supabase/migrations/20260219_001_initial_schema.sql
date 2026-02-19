-- MeowCRM Initial Schema
-- Run this via Supabase Dashboard SQL Editor

-- Organizations (multi-tenant)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Organization members
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date DATE,
  notes TEXT,
  source TEXT,
  meeting_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  summary TEXT,
  details TEXT,
  meeting_ref TEXT,
  occurred_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_org ON customers(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_customer ON contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(org_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_customer ON tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_org ON activities(org_id);
CREATE INDEX IF NOT EXISTS idx_activities_customer ON activities(customer_id);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies: organizations
CREATE POLICY "users can view own org" ON organizations
  FOR SELECT USING (
    id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can update own org" ON organizations
  FOR UPDATE USING (
    id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- Allow insert for new org creation (before org_id is set in JWT)
CREATE POLICY "authenticated users can create orgs" ON organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies: org_members
CREATE POLICY "users can view own org members" ON org_members
  FOR SELECT USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can insert own org members" ON org_members
  FOR INSERT WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
    OR user_id = auth.uid()
  );

-- RLS Policies: customers
CREATE POLICY "users can view own org customers" ON customers
  FOR SELECT USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
    AND deleted_at IS NULL
  );

CREATE POLICY "users can insert own org customers" ON customers
  FOR INSERT WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can update own org customers" ON customers
  FOR UPDATE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can delete own org customers" ON customers
  FOR DELETE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- RLS Policies: contacts
CREATE POLICY "users can view own org contacts" ON contacts
  FOR SELECT USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can insert own org contacts" ON contacts
  FOR INSERT WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can update own org contacts" ON contacts
  FOR UPDATE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can delete own org contacts" ON contacts
  FOR DELETE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- RLS Policies: tasks
CREATE POLICY "users can view own org tasks" ON tasks
  FOR SELECT USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can insert own org tasks" ON tasks
  FOR INSERT WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can update own org tasks" ON tasks
  FOR UPDATE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can delete own org tasks" ON tasks
  FOR DELETE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- RLS Policies: activities
CREATE POLICY "users can view own org activities" ON activities
  FOR SELECT USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can insert own org activities" ON activities
  FOR INSERT WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can update own org activities" ON activities
  FOR UPDATE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

CREATE POLICY "users can delete own org activities" ON activities
  FOR DELETE USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- Function to handle new user org setup
-- This trigger sets org_id in user's app_metadata after org creation
CREATE OR REPLACE FUNCTION public.handle_org_member_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's app_metadata with org_id
  UPDATE auth.users 
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('org_id', NEW.org_id::text)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_org_member_insert
  AFTER INSERT ON org_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_org_member_insert();
