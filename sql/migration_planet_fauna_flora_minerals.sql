-- Migration: Update planet fauna/flora/minerals fields
-- Date: 2026-02-12

-- Faune: renommer fauna_count en fauna_discovered et ajouter fauna_total
ALTER TABLE planets RENAME COLUMN fauna_count TO fauna_discovered;
ALTER TABLE planets ADD COLUMN fauna_total INTEGER DEFAULT 0;

-- Flore: renommer flora_count en flora_discovered
ALTER TABLE planets RENAME COLUMN flora_count TO flora_discovered;

-- Minéraux: ajouter minerals_discovered
ALTER TABLE planets ADD COLUMN minerals_discovered INTEGER DEFAULT 0;

-- Commentaires pour documentation
COMMENT ON COLUMN planets.fauna_discovered IS 'Nombre d''espèces de faune découvertes';
COMMENT ON COLUMN planets.fauna_total IS 'Nombre total d''espèces de faune sur la planète';
COMMENT ON COLUMN planets.flora_discovered IS 'Nombre d''espèces de flore découvertes';
COMMENT ON COLUMN planets.minerals_discovered IS 'Nombre de minéraux découverts';
