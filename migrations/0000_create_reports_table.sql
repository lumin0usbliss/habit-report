-- Create reports table for storing clean report data
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  report_data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_sent_at INTEGER,
  brevo_message_id TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reports_token_hash ON reports(token_hash);
CREATE INDEX IF NOT EXISTS idx_reports_expires_at ON reports(expires_at);
