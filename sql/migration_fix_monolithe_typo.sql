-- Migration: Fix POI type "Monilithe" to "Monolithe"
-- Date: 2026-02-19
-- Description: Correct typo in POI type name

-- Update all existing POI with type "Monilithe" to "Monolithe"
UPDATE points_of_interest
SET type = 'Monolithe'
WHERE type = 'Monilithe';

-- Verify the update
SELECT COUNT(*) as updated_count
FROM points_of_interest
WHERE type = 'Monolithe';

-- Check if any "Monilithe" remain (should be 0)
SELECT COUNT(*) as remaining_count
FROM points_of_interest
WHERE type = 'Monilithe';
