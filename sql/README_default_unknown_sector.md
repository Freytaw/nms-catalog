# Migration : Secteur Inconnu par défaut

## 📋 Objectif

Créer un secteur par défaut "Secteur Inconnu" qui sera automatiquement utilisé lors de la création de systèmes sans secteur spécifié.

## 🎯 Problème résolu

Quand un utilisateur crée un nouveau système depuis la liste globale (et non depuis une page de secteur), il doit pouvoir le faire sans nécessairement choisir un secteur existant. Le système sera créé dans "Secteur Inconnu" par défaut, et pourra être réassigné plus tard.

## 🔧 Solution

### **Secteur par défaut créé**

```
ID: 00000000-0000-0000-0000-000000000000 (UUID fixe)
Nom: Secteur Inconnu
Galaxie: Inconnu
Date de découverte: 2000-01-01
Notes: Secteur par défaut pour les systèmes dont le secteur n'est pas encore défini.
```

### **UUID fixe**

L'utilisation d'un UUID fixe (`00000000-0000-0000-0000-000000000000`) permet de :
- Référencer ce secteur directement dans le code de l'application
- Garantir que ce secteur existe toujours
- Éviter les problèmes de synchronisation entre environnements

## 📝 Installation de la migration

### **Étape 1 : Exécuter la migration SQL**

Dans Supabase SQL Editor :
```sql
-- Copier/coller le contenu de :
sql/migration_default_unknown_sector.sql
```

Cette migration :
1. Crée le secteur "Secteur Inconnu"
2. Utilise `ON CONFLICT DO NOTHING` pour éviter les doublons
3. Ajoute un commentaire explicatif sur la table

### **Étape 2 : Vérifier la création**

```sql
SELECT id, name, galaxy 
FROM sectors 
WHERE id = '00000000-0000-0000-0000-000000000000';
```

Résultat attendu :
```
id                                   | name            | galaxy
-------------------------------------|-----------------|--------
00000000-0000-0000-0000-000000000000 | Secteur Inconnu | Inconnu
```

## 🎨 Utilisation

### **Création d'un système depuis la liste globale**

```
1. User va sur page /systems
2. Clique "➕ Ajouter un système"
3. Formulaire s'ouvre
4. ✅ Secteur pré-sélectionné : "Secteur Inconnu"
5. User remplit les infos du système
6. Sauvegarde
7. Système créé dans "Secteur Inconnu"
8. User peut modifier plus tard pour changer le secteur
```

### **Création d'un système depuis une page de secteur**

```
1. User va sur SectorDetail de "Secteur Alpha"
2. Clique "➕ Ajouter un système"
3. Formulaire s'ouvre
4. ✅ Secteur pré-sélectionné : "Secteur Alpha"
5. User remplit les infos du système
6. Sauvegarde
7. Système créé dans "Secteur Alpha"
```

## 🔄 Workflow de réassignation

### **Déplacer un système de "Inconnu" vers un secteur réel**

```
1. User consulte SystemDetail d'un système
2. Système actuel : "Secteur Inconnu"
3. Clique "✏️ Modifier"
4. Change le secteur : "Secteur Inconnu" → "Secteur Beta"
5. Sauvegarde
6. ✅ Système maintenant dans "Secteur Beta"
```

## 📊 Avantages

### ✅ **Facilité de création**
- Pas besoin de créer un secteur avant de créer un système
- Workflow plus fluide et rapide
- Moins de friction pour l'utilisateur

### ✅ **Organisation progressive**
- Créer d'abord les systèmes rapidement
- Organiser en secteurs plus tard
- Approche "bottom-up" possible

### ✅ **Flexibilité**
- Peut créer plusieurs systèmes dans "Inconnu"
- Les réassigner ensuite par batch
- Facilite l'import de données

### ✅ **Pas de valeur null**
- Toujours une référence valide vers un secteur
- Pas de problèmes de clé étrangère
- Requêtes SQL simplifiées

## 🎯 Cas d'usage

### **Scénario 1 : Découverte rapide**
```
Exploration en jeu → Découvre 5 systèmes rapidement
→ Crée les 5 dans "Secteur Inconnu"
→ Continue l'exploration
→ Plus tard : Organise en secteurs appropriés
```

### **Scénario 2 : Import de données**
```
Liste de systèmes depuis un fichier
→ Import en masse dans "Secteur Inconnu"
→ Affine manuellement l'organisation
→ Réassigne aux bons secteurs
```

### **Scénario 3 : Débutant**
```
Nouveau joueur ne comprend pas les secteurs
→ Peut créer des systèmes quand même
→ Apprend le concept progressivement
→ Réorganise quand il est prêt
```

## 🔧 Détails techniques

### **Code dans Systems.jsx**

```javascript
// Constante pour le secteur inconnu
const UNKNOWN_SECTOR_ID = '00000000-0000-0000-0000-000000000000'

// État initial du formulaire
const [formData, setFormData] = useState({
  sector_id: UNKNOWN_SECTOR_ID,  // ← Valeur par défaut
  name: '',
  // ... autres champs
})

// Réinitialisation après annulation
function handleCancel() {
  setFormData({
    sector_id: UNKNOWN_SECTOR_ID,  // ← Réinitialise au défaut
    // ... autres champs
  })
}
```

### **Comportement avec création depuis SectorDetail**

Quand on crée un système depuis une page de secteur :

```javascript
// Dans useEffect de Systems.jsx
useEffect(() => {
  if (location.state?.createWithSectorId) {
    setFormData({
      ...formData,
      sector_id: location.state.createWithSectorId  // ← Override le défaut
    })
    setShowForm(true)
  }
}, [location])
```

Le secteur spécifique **override** le secteur inconnu par défaut.

## 📈 Statistiques possibles

### **Requête : Systèmes dans "Secteur Inconnu"**

```sql
SELECT COUNT(*) as unorganized_systems
FROM systems
WHERE sector_id = '00000000-0000-0000-0000-000000000000';
```

### **Requête : Tous les secteurs sauf "Inconnu"**

```sql
SELECT id, name, 
  (SELECT COUNT(*) FROM systems WHERE sector_id = sectors.id) as system_count
FROM sectors
WHERE id != '00000000-0000-0000-0000-000000000000'
ORDER BY name;
```

## ⚠️ Notes importantes

### **Ne pas supprimer "Secteur Inconnu"**
Ce secteur est système et ne doit **jamais être supprimé**. Il sert de référence par défaut.

### **UUID réservé**
L'UUID `00000000-0000-0000-0000-000000000000` est réservé. Ne pas créer d'autres secteurs avec cet ID.

### **Migration idempotente**
La migration utilise `ON CONFLICT DO NOTHING`, donc elle peut être exécutée plusieurs fois sans erreur.

### **Compatibilité**
Cette migration est compatible avec toutes les données existantes. Les systèmes déjà créés gardent leur secteur actuel.

## 🔄 Rollback (si nécessaire)

Pour supprimer le secteur inconnu (déconseillé) :

```sql
-- Attention : Réassigner d'abord tous les systèmes !
UPDATE systems 
SET sector_id = 'autre-secteur-id'
WHERE sector_id = '00000000-0000-0000-0000-000000000000';

-- Puis supprimer
DELETE FROM sectors 
WHERE id = '00000000-0000-0000-0000-000000000000';
```

**Note** : Cette opération est déconseillée car elle casse le comportement par défaut de l'application.

## 📊 Structure finale

```
Table: sectors
├─ 00000000-0000-0000-0000-000000000000 (Secteur Inconnu) ← Système
├─ uuid-secteur-alpha (Secteur Alpha)
├─ uuid-secteur-beta (Secteur Beta)
└─ ...

Table: systems
├─ Système A → sector_id: 00000000... (Secteur Inconnu)
├─ Système B → sector_id: uuid-alpha (Secteur Alpha)
├─ Système C → sector_id: 00000000... (Secteur Inconnu)
└─ ...
```

## ✅ Vérification post-installation

1. Vérifier la présence du secteur :
```sql
SELECT * FROM sectors 
WHERE id = '00000000-0000-0000-0000-000000000000';
```

2. Créer un système test :
- Aller sur /systems
- Créer un système sans changer le secteur
- Vérifier qu'il est dans "Secteur Inconnu"

3. Modifier le système :
- Éditer le système créé
- Changer le secteur
- Vérifier la réassignation
