# Guide d'installation - Upload d'images

## Configuration Supabase Storage

### Étape 1 : Créer le bucket de stockage

1. Va dans ton projet Supabase
2. **Storage** (menu de gauche) > **New bucket**
3. Nom du bucket : `nms-images`
4. **Public bucket** : ✅ OUI (cocher la case)
5. Cliquer sur **Create bucket**

### Étape 2 : Configurer les policies (permissions)

1. Va dans **SQL Editor** (menu de gauche)
2. Copie-colle le contenu du fichier `supabase_storage_setup.sql`
3. Clique sur **Run** pour exécuter

### Étape 3 : Ajouter les colonnes images aux tables

1. Toujours dans **SQL Editor**
2. Copie-colle le contenu du fichier `migration_add_images.sql`
3. Clique sur **Run** pour exécuter

## Fonctionnalités

### Upload d'images
- **Bouton "Choisir des images"** : Sélectionne des fichiers depuis ton PC
- **Upload automatique** : Les images sont envoyées vers Supabase Storage
- **Aperçu direct** : Vois tes images immédiatement après l'upload
- **Images multiples** : Ajoute autant d'images que tu veux
- **Image principale** : La première image est marquée comme principale
- **Suppression** : Bouton ❌ sur chaque image pour la retirer

### Organisation
- **Secteurs** : Ajoute des images panoramiques de région
- **Systèmes** : Photos d'étoiles, planètes vues de loin
- **Planètes** : Paysages, screenshots de surface
- **Créatures** : Photos de la faune
- **Bases** : Captures de tes constructions

## Structure des fichiers

```
/
├── src/
│   ├── components/
│   │   └── ImageUpload.jsx         # Composant réutilisable d'upload
│   └── pages/
│       ├── Sectors.jsx              # Avec upload d'images
│       ├── Systems.jsx              # Avec upload d'images
│       ├── Planets.jsx              # Avec upload d'images
│       ├── Creatures.jsx            # Avec upload d'images
│       └── DetailPages.jsx          # Pages de détail complètes
├── supabase_storage_setup.sql       # Configuration Storage
├── migration_add_images.sql         # Migration base de données
└── SETUP_IMAGES.md                  # Ce fichier
```

## Dépannage

### Les images ne s'uploadent pas
- Vérifie que le bucket `nms-images` existe dans Storage
- Vérifie que le bucket est **public**
- Vérifie que les policies sont bien créées (SQL Editor)

### Erreur "PolicyViolation"
- Les policies ne sont pas correctement configurées
- Re-exécute le script `supabase_storage_setup.sql`

### Les images ne s'affichent pas
- Vérifie que la colonne `images` existe dans tes tables
- Exécute le script `migration_add_images.sql`
- Vérifie dans Table Editor que la colonne est de type `jsonb`

## Notes

- Les images sont stockées dans Supabase Storage (pas en base de données)
- Le champ `image_url` contient l'URL de la première image
- Le champ `images` (JSONB) contient toutes les URLs
- Les fichiers uploadés sont automatiquement nommés de façon unique
