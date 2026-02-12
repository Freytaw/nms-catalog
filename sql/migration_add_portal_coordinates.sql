-- Migration: Add portal_coordinates field to planets
-- Date: 2026-02-12

-- Ajouter le champ pour l'image des coordonnées du portail
ALTER TABLE planets ADD COLUMN portal_coordinates TEXT;

-- Commentaire pour documentation
COMMENT ON COLUMN planets.portal_coordinates IS 'URL de l''image des coordonnées du portail';
