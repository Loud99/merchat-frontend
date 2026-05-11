CREATE TABLE IF NOT EXISTS support_tickets (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID        NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS support_tickets_merchant_id_idx ON support_tickets (merchant_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx      ON support_tickets (status);
