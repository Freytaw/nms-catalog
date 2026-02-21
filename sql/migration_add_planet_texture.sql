-- Migration: Add planet_texture field to planets table
-- Date: 2026-02-21
-- Description: Allow custom texture selection for planet maps

-- Add texture field to planets table
ALTER TABLE planets
ADD COLUMN planet_texture TEXT DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN planets.planet_texture IS 'Custom texture for planet map canvas (overrides default type-based texture)';

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'planets' AND column_name = 'planet_texture';
