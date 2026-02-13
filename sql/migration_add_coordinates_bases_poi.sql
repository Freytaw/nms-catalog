-- Migration: Add coordinates to bases and points_of_interest
-- Date: 2026-02-13

-- Add coordinates column to bases table
ALTER TABLE bases
ADD COLUMN IF NOT EXISTS coordinates TEXT;

-- Add coordinates column to points_of_interest table
ALTER TABLE points_of_interest
ADD COLUMN IF NOT EXISTS coordinates TEXT;

-- Comment
COMMENT ON COLUMN bases.coordinates IS 'Geographic coordinates (latitude/longitude) of the base location';
COMMENT ON COLUMN points_of_interest.coordinates IS 'Geographic coordinates (latitude/longitude) of the point of interest';
