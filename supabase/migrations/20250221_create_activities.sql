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

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage activities in their org"
  ON activities FOR ALL
  USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
