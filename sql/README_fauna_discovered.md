# Migration : Calcul automatique de "Faune découverte"

## 📋 Objectif

Le champ `fauna_discovered` dans la table `planets` est désormais calculé automatiquement en fonction du nombre de créatures associées à chaque planète. Ce champ n'est plus modifiable manuellement depuis l'interface.

## 🔧 Comment ça fonctionne

### Triggers PostgreSQL

Trois triggers ont été créés pour maintenir à jour automatiquement le champ `fauna_discovered` :

1. **trigger_creature_insert** : Lors de l'ajout d'une créature
2. **trigger_creature_delete** : Lors de la suppression d'une créature
3. **trigger_creature_update** : Lors de la modification du `planet_id` d'une créature

### Interface utilisateur

Dans le formulaire de planète :
- ✅ Le champ "Faune découverte" n'est plus éditable
- ✅ Un message informatif indique que la valeur est calculée automatiquement
- ✅ Le champ "Faune totale" reste éditable (objectif à atteindre)

## 📝 Installation de la migration

### 1. Exécuter le fichier SQL

Dans Supabase SQL Editor, exécuter le fichier :
```
sql/migration_auto_fauna_discovered.sql
```

Ce fichier va :
1. Créer la fonction `update_planet_fauna_discovered()`
2. Créer les 3 triggers sur la table `creatures`
3. Initialiser les valeurs de `fauna_discovered` pour toutes les planètes existantes

### 2. Vérification

Après l'exécution, vérifier que :
```sql
-- Vérifier les triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table = 'creatures';

-- Vérifier les valeurs calculées
SELECT 
  p.name, 
  p.fauna_discovered,
  (SELECT COUNT(*) FROM creatures WHERE planet_id = p.id) as actual_count
FROM planets p;
```

## 🎯 Avantages

- ✅ **Précision** : Le nombre de faune découverte est toujours exact
- ✅ **Cohérence** : Plus de risque de désynchronisation entre les créatures et le compteur
- ✅ **Simplicité** : Pas besoin de mettre à jour manuellement le compteur
- ✅ **Automatique** : Se met à jour en temps réel lors de l'ajout/suppression de créatures

## 🔄 Fonctionnement en pratique

### Scénario 1 : Ajout d'une créature
```
1. User crée une créature pour "Planète Alpha"
2. Trigger : fauna_discovered de "Planète Alpha" passe de 3 à 4
3. ✅ Affichage automatiquement mis à jour : "Faune : 4/8 espèces"
```

### Scénario 2 : Suppression d'une créature
```
1. User supprime une créature de "Planète Beta"
2. Trigger : fauna_discovered de "Planète Beta" passe de 6 à 5
3. ✅ Affichage automatiquement mis à jour : "Faune : 5/10 espèces"
```

### Scénario 3 : Déplacement d'une créature
```
1. User modifie le planet_id d'une créature (Planète A → Planète B)
2. Trigger : 
   - fauna_discovered de Planète A diminue de 1
   - fauna_discovered de Planète B augmente de 1
3. ✅ Les deux planètes sont mises à jour automatiquement
```

## ⚠️ Notes importantes

- Le champ `fauna_discovered` existe toujours en base de données
- Il est maintenu à jour automatiquement par les triggers
- Il n'est plus présent dans le formulaire d'édition
- La valeur s'affiche normalement dans les cartes et pages de détails
- Le champ `fauna_total` reste éditable (objectif/maximum de faune)

## 🧪 Test de la migration

Après installation, tester :

1. **Créer une nouvelle planète** → fauna_discovered = 0
2. **Ajouter 3 créatures** → fauna_discovered = 3
3. **Supprimer 1 créature** → fauna_discovered = 2
4. **Modifier une planète** → fauna_discovered reste inchangé
5. **Déplacer une créature vers une autre planète** → Les deux planètes sont mises à jour

## 📊 Structure finale

```
Table: planets
├─ fauna_discovered (INTEGER) - 🔒 CALCULÉ AUTOMATIQUEMENT
├─ fauna_total (INTEGER) - ✏️ ÉDITABLE (objectif)
├─ flora_discovered (INTEGER) - ✏️ ÉDITABLE
└─ minerals_discovered (INTEGER) - ✏️ ÉDITABLE
```

## 🔙 Rollback (si nécessaire)

Pour annuler la migration :

```sql
-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_creature_insert ON creatures;
DROP TRIGGER IF EXISTS trigger_creature_delete ON creatures;
DROP TRIGGER IF EXISTS trigger_creature_update ON creatures;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS update_planet_fauna_discovered();

-- Le champ fauna_discovered reste en base
-- Il faudra le rendre à nouveau éditable dans l'interface
```
