-- Migration: Déplacer les coordonnées de sectors vers systems
-- Exécute ce script dans Supabase SQL Editor

-- Ajouter la colonne coordinates à systems
ALTER TABLE systems 
ADD COLUMN IF NOT EXISTS coordinates TEXT;

-- Supprimer la colonne coordinates de sectors
ALTER TABLE sectors 
DROP COLUMN IF EXISTS coordinates;

-- Vérification
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name = 'coordinates' 
AND table_schema = 'public'
ORDER BY table_name;
