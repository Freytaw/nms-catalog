-- Migration: Ajouter le support d'images multiples à toutes les tables
-- Exécute ce script dans Supabase SQL Editor

-- Ajouter la colonne images aux secteurs
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Ajouter la colonne images aux planètes (si pas déjà fait)
ALTER TABLE planets ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Ajouter la colonne images aux créatures (si pas déjà fait)
ALTER TABLE creatures ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Ajouter la colonne images aux bases (si pas déjà fait)
ALTER TABLE bases ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Vérification
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name = 'images' 
AND table_schema = 'public'
ORDER BY table_name;
