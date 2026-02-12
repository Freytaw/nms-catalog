-- Script SQL pour créer les tables dans Supabase
-- Copie et exécute ce script dans l'éditeur SQL de Supabase

-- Table: sectors
CREATE TABLE sectors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  galaxy TEXT NOT NULL DEFAULT 'Euclide',
  discovery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table: systems
CREATE TABLE systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  coordinates TEXT,
  star_class TEXT,
  conflict_level TEXT,
  economy TEXT,
  planet_count INTEGER DEFAULT 0,
  system_type TEXT,
  dominant_race TEXT,
  interesting_buy TEXT,
  interesting_sell TEXT,
  discovery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table: planets
CREATE TABLE planets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES systems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  climate TEXT,
  sentinels TEXT,
  resources TEXT,
  fauna_discovered INTEGER DEFAULT 0,
  fauna_total INTEGER DEFAULT 0,
  flora_discovered INTEGER DEFAULT 0,
  minerals_discovered INTEGER DEFAULT 0,
  portal_coordinates TEXT,
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table: creatures
CREATE TABLE creatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_name TEXT,
  genus TEXT,
  height TEXT,
  weight TEXT,
  behavior TEXT,
  diet TEXT,
  special_abilities TEXT,
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Table: bases
CREATE TABLE bases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  planet_id UUID REFERENCES planets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_description TEXT,
  resources_nearby TEXT,
  notes TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) pour la sécurité
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE planets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE bases ENABLE ROW LEVEL SECURITY;

-- Policies pour permettre toutes les opérations (pour une utilisation personnelle)
-- Note: Pour un usage partagé, tu devrais créer des policies plus restrictives

CREATE POLICY "Enable all operations for sectors" ON sectors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for systems" ON systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for planets" ON planets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for creatures" ON creatures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for bases" ON bases FOR ALL USING (true) WITH CHECK (true);

-- Indexes pour améliorer les performances
CREATE INDEX idx_systems_sector_id ON systems(sector_id);
CREATE INDEX idx_planets_system_id ON planets(system_id);
CREATE INDEX idx_creatures_planet_id ON creatures(planet_id);
CREATE INDEX idx_bases_planet_id ON bases(planet_id);
