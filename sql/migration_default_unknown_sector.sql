-- Migration: Create default "Secteur Inconnu"
-- Date: 2026-02-13
-- Purpose: Provide a default sector for systems created without a specific sector

-- Insert "Secteur Inconnu" with a fixed UUID
-- Using a fixed UUID allows us to reference it in the app code
INSERT INTO sectors (
  id,
  name,
  galaxy,
  discovery_date,
  notes,
  image_url,
  images
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Secteur Inconnu',
  'Inconnu',
  '2000-01-01',
  'Secteur par défaut pour les systèmes dont le secteur n''est pas encore défini.',
  NULL,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Note: This sector serves as a placeholder when creating systems
-- Users can later reassign systems to proper sectors
COMMENT ON TABLE sectors IS 'Contains all discovered sectors. ID 00000000-0000-0000-0000-000000000000 is reserved for "Secteur Inconnu"';
