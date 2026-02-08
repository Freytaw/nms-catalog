-- Migration SQL : Ajouter les nouveaux champs à la table systems
-- Exécute ce script dans Supabase SQL Editor pour ajouter les nouveaux champs

-- Ajouter les nouvelles colonnes
ALTER TABLE systems ADD COLUMN IF NOT EXISTS conflict_level TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS economy TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS planet_count INTEGER DEFAULT 0;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS system_type TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS dominant_race TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS interesting_buy TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS interesting_sell TEXT;
ALTER TABLE systems ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Vérification : afficher la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'systems'
ORDER BY ordinal_position;
