-- Migration: Create logs table for error tracking
-- Date: 2026-02-19
-- Description: Store application warnings and errors in database

CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('warning', 'error')),
  context TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  user_agent TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX idx_logs_level ON logs(level);
CREATE INDEX idx_logs_context ON logs(context);

-- Enable Row Level Security
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for all authenticated users
CREATE POLICY "Allow insert logs for authenticated users"
  ON logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow select for all authenticated users
CREATE POLICY "Allow select logs for authenticated users"
  ON logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comment
COMMENT ON TABLE logs IS 'Application error and warning logs';
COMMENT ON COLUMN logs.level IS 'Log level: warning or error';
COMMENT ON COLUMN logs.context IS 'Logger context: App, Database, API, etc.';
COMMENT ON COLUMN logs.data IS 'Additional data in JSON format';
