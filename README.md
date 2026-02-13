# NMS Catalog - Catalogue No Man's Sky

Application web complète pour cataloguer toutes vos découvertes dans No Man's Sky.

![No Man's Sky](https://img.shields.io/badge/No%20Man's%20Sky-Catalog-00d9ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase)

## 📋 Vue d'ensemble

NMS Catalog est une application web moderne qui vous permet d'organiser et de documenter l'ensemble de vos découvertes dans No Man's Sky. De vos secteurs d'exploration à vos bases, en passant par les créatures rencontrées et les points d'intérêt remarquables, gardez une trace complète de votre voyage spatial.

## ✨ Fonctionnalités principales

### 🗂️ Organisation hiérarchique

```
Secteur
  └─ Système
      └─ Planète
          ├─ Créatures
          ├─ Bases
          └─ Points d'Intérêt
```

### 📊 Entités gérées

- **🗺️ Secteurs** : Régions de l'espace regroupant plusieurs systèmes
- **🌟 Systèmes** : Systèmes stellaires avec étoile, économie, race dominante
- **🌍 Planètes** : Mondes avec climat, ressources, faune et flore
- **🦎 Créatures** : Espèces découvertes avec caractéristiques détaillées
- **🏠 Bases** : Vos constructions et avant-postes
- **📍 Points d'Intérêt** : Ruines, monuments, épaves et sites remarquables

### 🎯 Fonctionnalités avancées

#### Navigation intelligente
- **Hiérarchie complète** : Navigation ascendante et descendante entre entités
- **Quick-create** : Boutons de création rapide depuis les pages parentes
- **Redirection auto** : Redirection vers les détails après création/modification
- **Breadcrumbs** : Fil d'Ariane complet (Secteur → Système → Planète)

#### Gestion des images
- **Upload multiple** : Galerie d'images pour chaque entité
- **Lightbox interactif** : Visualisation plein écran avec navigation clavier
- **Vignettes** : Aperçus dans les listes et pages de détails
- **Scroll optimisé** : Navigation fluide dans les galeries

#### Données automatisées
- **Faune découverte** : Calcul automatique basé sur le nombre de créatures
- **Triggers SQL** : Mise à jour en temps réel
- **Secteur par défaut** : "Secteur Inconnu" pour les systèmes non classés

#### Découvertes planétaires
- **Faune** : Découvert/Total avec comptage automatique
- **Flore** : Espèces découvertes
- **Minéraux** : Minéraux identifiés
- **Coordonnées portail** : Upload d'image dédiée

## 🚀 Installation

### Prérequis

- Node.js 16+
- Compte Supabase
- Git

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/Freytaw/nms-catalog.git
cd nms-catalog
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier `.env.template` vers `.env`
3. Remplir avec vos credentials Supabase :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Étape 4 : Créer la base de données

Dans l'éditeur SQL de Supabase, exécuter dans l'ordre :

```sql
-- 1. Structure principale
sql/supabase_schema.sql

-- 2. Configuration du storage
sql/supabase_storage_setup.sql

-- 3. Migrations optionnelles (selon vos besoins)
sql/migration_default_unknown_sector.sql
sql/migration_auto_fauna_discovered.sql
sql/migration_add_points_of_interest.sql
```

### Étape 5 : Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📖 Guide d'utilisation

### Dashboard

Le tableau de bord affiche :
- Statistiques globales (secteurs, systèmes, planètes, etc.)
- Accès rapide à toutes les sections
- Vue d'ensemble de votre exploration

### Workflow recommandé

#### 1. Créer un secteur
```
Dashboard → Secteurs → ➕ Ajouter un secteur
→ Remplir nom, galaxie, date
→ Sauvegarder
→ Redirigé vers SectorDetail
```

#### 2. Ajouter un système
```
SectorDetail → ➕ Ajouter un système
→ Formulaire ouvert avec secteur pré-sélectionné
→ Remplir coordonnées, étoile, économie
→ Sauvegarder
→ Redirigé vers SystemDetail
```

#### 3. Ajouter une planète
```
SystemDetail → ➕ Ajouter une planète
→ Formulaire ouvert avec système pré-sélectionné
→ Remplir type, climat, ressources
→ Sauvegarder
→ Redirigé vers PlanetDetail
```

#### 4. Documenter la faune
```
PlanetDetail → ➕ Ajouter une créature
→ Remplir nom, genre, comportement
→ Ajouter photos
→ Sauvegarder
→ Compteur "Faune découverte" mis à jour automatiquement
```

#### 5. Marquer un point d'intérêt
```
PlanetDetail → ➕ Ajouter un point d'intérêt
→ Remplir nom, type (Ruines, Épave, Monument...)
→ Ajouter photos
→ Sauvegarder
```

### Fonctionnalités spéciales

#### Secteur Inconnu
Les systèmes peuvent être créés sans secteur spécifique :
- Création rapide sans organisation préalable
- Assignation ultérieure à un secteur réel
- Aucune contrainte de hiérarchie

#### Calcul automatique de la faune
Le nombre de créatures découvertes est calculé automatiquement :
- Pas de saisie manuelle nécessaire
- Mise à jour en temps réel
- Cohérence garantie avec les données

#### Coordonnées du portail
Champ dédié pour l'image des coordonnées :
- Upload séparé de la galerie principale
- Affichage optimisé dans PlanetDetail
- Facilite le partage de découvertes

## 🛠️ Technologies utilisées

### Frontend
- **React 18.3** - Framework UI
- **React Router 7** - Navigation
- **Lucide React** - Icônes
- **Vite** - Build tool

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de données
  - Storage - Stockage d'images
  - Row Level Security - Sécurité

### Fonctionnalités Supabase
- Triggers SQL pour calculs automatiques
- Policies RLS pour sécurité
- Storage buckets pour images
- Real-time updates (optionnel)

## 📁 Structure du projet

```
nms-catalog/
├── src/
│   ├── components/
│   │   ├── ImageGallery.jsx       # Galerie avec lightbox
│   │   ├── ImageUpload.jsx        # Upload multiple
│   │   └── SingleImageUpload.jsx  # Upload simple
│   ├── pages/
│   │   ├── Dashboard.jsx          # Tableau de bord
│   │   ├── Sectors.jsx            # Liste secteurs
│   │   ├── Systems.jsx            # Liste systèmes
│   │   ├── Planets.jsx            # Liste planètes
│   │   ├── Creatures.jsx          # Liste créatures
│   │   ├── Bases.jsx              # Liste bases
│   │   ├── PointsOfInterest.jsx   # Liste POI
│   │   └── DetailPages.jsx        # Toutes pages de détails
│   ├── App.jsx                    # Routes et navigation
│   ├── index.css                  # Styles NMS
│   └── main.jsx                   # Point d'entrée
├── sql/
│   ├── supabase_schema.sql        # Schéma complet
│   ├── supabase_storage_setup.sql # Configuration storage
│   └── migration_*.sql            # Migrations
├── .env.template                  # Template configuration
├── package.json                   # Dépendances
└── README.md                      # Ce fichier
```

## 🎨 Design

L'application utilise une palette inspirée de No Man's Sky :

```css
--nms-primary: #00d9ff    /* Cyan */
--nms-secondary: #ff006e  /* Rose */
--nms-accent: #ffd60a     /* Jaune */
--nms-dark: #0d0d0d       /* Noir profond */
--nms-gray: #a0a0a0       /* Gris */
```

## 📝 Migrations disponibles

### migration_default_unknown_sector.sql
Crée un secteur "Secteur Inconnu" par défaut pour les systèmes non classés.

### migration_auto_fauna_discovered.sql
Configure le calcul automatique de la faune découverte via triggers SQL.

### migration_add_points_of_interest.sql
Ajoute la table et fonctionnalités pour les points d'intérêt.

### migration_add_portal_coordinates.sql
Ajoute le champ pour les coordonnées de portail des planètes.

## 🔧 Développement

### Lancer en mode développement
```bash
npm run dev
```

### Build pour production
```bash
npm run build
```

### Preview du build
```bash
npm run preview
```

## 📚 Documentation supplémentaire

Consultez les README spécifiques dans `/sql/` :
- `README_fauna_discovered.md` - Détails sur le calcul automatique
- `README_default_unknown_sector.md` - Guide du secteur inconnu

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🎮 Crédits

- **No Man's Sky** par Hello Games
- Développé avec ❤️ par Frey
- Icônes par [Lucide](https://lucide.dev)

## 🐛 Bugs connus et solutions

### Images ne s'affichent pas
- Vérifier que le bucket Supabase est public
- Vérifier les policies RLS du storage
- Consulter `SETUP_IMAGES.md`

### Erreur "relation does not exist"
- Vérifier que toutes les migrations SQL ont été exécutées
- Vérifier l'ordre d'exécution des migrations

### Faune découverte ne se met pas à jour
- Vérifier que `migration_auto_fauna_discovered.sql` a été exécutée
- Vérifier les triggers avec : `SELECT * FROM information_schema.triggers WHERE event_object_table = 'creatures'`

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Supabase
- Vérifier les fichiers README dans `/sql/`

## 🗺️ Roadmap

Fonctionnalités futures potentielles :
- [ ] Export/Import de données (JSON, CSV)
- [ ] Recherche et filtres avancés
- [ ] Statistiques et graphiques
- [ ] Mode hors-ligne (PWA)
- [ ] Partage de découvertes
- [ ] Annotations sur images
- [ ] Mode sombre/clair
- [ ] Multi-utilisateurs avec partage

---

**Bon voyage, explorateur ! 🚀✨**
