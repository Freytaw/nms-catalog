-- Migration: Create points_of_interest table
-- Date: 2026-02-13

CREATE TABLE IF NOT EXISTS points_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_points_of_interest_planet_id ON points_of_interest(planet_id);

-- Enable Row Level Security
ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth setup)
CREATE POLICY "Enable read access for all users" ON points_of_interest
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON points_of_interest
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON points_of_interest
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON points_of_interest
  FOR DELETE USING (true);

-- Comment
COMMENT ON TABLE points_of_interest IS 'Points of interest discovered on planets';
