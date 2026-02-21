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

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their org"
  ON tasks FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert tasks in their org"
  ON tasks FOR INSERT
  WITH CHECK (org_id IN (
    SELECT org_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks in their org"
  ON tasks FOR UPDATE
  USING (org_id IN (
    SELECT org_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tasks in their org"
  ON tasks FOR DELETE
  USING (org_id IN (
    SELECT org_id FROM organization_members WHERE user_id = auth.uid()
  ));
