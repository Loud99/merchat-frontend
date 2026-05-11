-- Stores partial onboarding progress so merchants can resume later.
CREATE TABLE onboarding_sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token      TEXT        NOT NULL UNIQUE,
  email      TEXT        NOT NULL,
  step       INTEGER     NOT NULL DEFAULT 1,
  form_data  JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE INDEX idx_onboarding_sessions_token ON onboarding_sessions(token);
CREATE INDEX idx_onboarding_sessions_email ON onboarding_sessions(email);

ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- No auth required — merchant hasn't created an account yet.
CREATE POLICY "public_insert"  ON onboarding_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select"  ON onboarding_sessions FOR SELECT USING (true);
CREATE POLICY "public_update"  ON onboarding_sessions FOR UPDATE USING (true);
