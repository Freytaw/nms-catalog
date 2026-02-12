-- Migration: Auto-calculate fauna_discovered based on creatures count
-- Date: 2026-02-12

-- Fonction pour mettre à jour fauna_discovered
CREATE OR REPLACE FUNCTION update_planet_fauna_discovered()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour le compte de faune découverte pour la planète concernée
  UPDATE planets
  SET fauna_discovered = (
    SELECT COUNT(*)
    FROM creatures
    WHERE planet_id = COALESCE(NEW.planet_id, OLD.planet_id)
  )
  WHERE id = COALESCE(NEW.planet_id, OLD.planet_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger lors de l'ajout d'une créature
CREATE TRIGGER trigger_creature_insert
AFTER INSERT ON creatures
FOR EACH ROW
EXECUTE FUNCTION update_planet_fauna_discovered();

-- Trigger lors de la suppression d'une créature
CREATE TRIGGER trigger_creature_delete
AFTER DELETE ON creatures
FOR EACH ROW
EXECUTE FUNCTION update_planet_fauna_discovered();

-- Trigger lors de la modification du planet_id d'une créature
CREATE TRIGGER trigger_creature_update
AFTER UPDATE OF planet_id ON creatures
FOR EACH ROW
WHEN (OLD.planet_id IS DISTINCT FROM NEW.planet_id)
EXECUTE FUNCTION update_planet_fauna_discovered();

-- Initialiser les valeurs existantes
UPDATE planets
SET fauna_discovered = (
  SELECT COUNT(*)
  FROM creatures
  WHERE planet_id = planets.id
);

COMMENT ON COLUMN planets.fauna_discovered IS 'Nombre de créatures découvertes (calculé automatiquement)';
