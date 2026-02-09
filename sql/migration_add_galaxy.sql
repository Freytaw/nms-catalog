-- Migration: Ajouter le champ Galaxie aux secteurs
-- Exécute ce script dans Supabase SQL Editor

-- Ajouter la colonne galaxy (NOT NULL avec valeur par défaut)
ALTER TABLE sectors 
ADD COLUMN IF NOT EXISTS galaxy TEXT NOT NULL DEFAULT 'Euclide';

-- Mettre à jour tous les secteurs existants avec "Euclide"
UPDATE sectors 
SET galaxy = 'Euclide' 
WHERE galaxy IS NULL OR galaxy = '';

-- Vérification
SELECT id, name, galaxy, coordinates 
FROM sectors 
ORDER BY galaxy, name;
