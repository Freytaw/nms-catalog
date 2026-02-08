# No Man's Sky - Catalogue des Découvertes

Application React + Supabase pour cataloguer toutes tes découvertes dans No Man's Sky.

## 🌟 Fonctionnalités

- **Secteurs** : Régions de l'espace regroupant plusieurs systèmes
- **Systèmes** : Systèmes stellaires avec leurs étoiles et caractéristiques
- **Planètes** : Mondes avec leur climat, ressources et faune
- **Créatures** : Faune découverte avec leurs particularités
- **Bases** : Tes avant-postes et refuges construits

### Hiérarchie des données
```
Secteur
  └─ Système(s)
      └─ Planète(s)
          ├─ Créature(s)
          └─ Base(s)
```

## 🚀 Installation

### Prérequis
- Node.js 18+ installé
- Un compte Supabase (gratuit) : https://supabase.com

### Étape 1 : Configuration Supabase

1. Crée un nouveau projet sur https://supabase.com
2. Dans ton projet Supabase, va dans l'**SQL Editor**
3. Copie-colle le contenu du fichier `supabase_schema.sql` et exécute-le
4. Va dans **Settings > API** et note :
   - `Project URL` (SUPABASE_URL)
   - `anon/public key` (SUPABASE_ANON_KEY)

### Étape 2 : Configuration de l'application

1. Clone ou télécharge ce projet
2. Ouvre un terminal dans le dossier du projet
3. Installe les dépendances :
```bash
npm install
```

4. Crée un fichier `.env.local` à la racine du projet :
```bash
cp .env.template .env.local
```

5. Édite `.env.local` et remplace les valeurs :
```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta_clé_anon_ici
```

### Étape 3 : Lancement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📖 Guide d'utilisation

### Créer un secteur
1. Va dans "Secteurs"
2. Clique sur "Nouveau Secteur"
3. Remplis les informations (nom, coordonnées, etc.)
4. Sauvegarde

### Ajouter un système
1. Va dans "Systèmes"
2. Clique sur "Nouveau Système"
3. Sélectionne le secteur parent
4. Remplis les informations (nom, classe d'étoile, etc.)
5. Sauvegarde

### Ajouter une planète
1. Va dans "Planètes"
2. Clique sur "Nouvelle Planète"
3. Sélectionne le système parent
4. Remplis les informations (nom, type, climat, ressources, etc.)
5. Sauvegarde

### Ajouter une créature
1. Va dans "Créatures"
2. Clique sur "Nouvelle Créature"
3. Sélectionne la planète où elle a été trouvée
4. Remplis les informations :
   - **Nom** : Le nom que tu lui as donné (ex: Mochi, Yukitaka)
   - **Nom d'origine** : Le nom généré par le jeu (ex: B. Scoopieusllea)
   - **Genre** : Symétrique, Alpha, etc.
   - **Taille/Poids** : Les dimensions
   - **Comportement** : Paisible, Nerveux, etc.
   - **Régime alimentaire** : Herbivore, Charognard, etc.
   - **Capacités spéciales** : Change de couleur, Écholocalisation, etc.
5. Sauvegarde

### Ajouter une base
1. Va dans "Bases"
2. Clique sur "Nouvelle Base"
3. Sélectionne la planète où elle se trouve
4. Remplis les informations (nom, localisation, ressources à proximité)
5. Sauvegarde

## 🎨 Personnalisation

Les couleurs et le thème sont inspirés de No Man's Sky. Tu peux les modifier dans `src/index.css` :

```css
:root {
  --nms-primary: #00d9ff;    /* Cyan principal */
  --nms-secondary: #ff006e;  /* Rose accent */
  --nms-accent: #ffd60a;     /* Jaune accent */
  /* etc. */
}
```

## 📁 Structure du projet

```
nms-catalog/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Page d'accueil avec statistiques
│   │   ├── Sectors.jsx        # Gestion des secteurs
│   │   ├── Systems.jsx        # Gestion des systèmes
│   │   ├── Planets.jsx        # Gestion des planètes
│   │   ├── Creatures.jsx      # Gestion des créatures
│   │   ├── Bases.jsx          # Gestion des bases
│   │   └── DetailPages.jsx    # Pages de détails (à compléter)
│   ├── App.jsx                # Composant principal avec routing
│   ├── main.jsx               # Point d'entrée
│   ├── index.css              # Styles globaux
│   └── supabaseClient.js      # Configuration Supabase
├── supabase_schema.sql        # Schéma de base de données
├── package.json
└── README.md
```

## 🔮 Améliorations futures

- [ ] Upload d'images avec Supabase Storage
- [ ] Galerie de photos pour chaque entité
- [ ] Pages de détails complètes avec relations
- [ ] Recherche et filtres avancés
- [ ] Export des données en JSON/CSV
- [ ] Mode carte interactive
- [ ] Statistiques avancées
- [ ] Thèmes personnalisables

## 🐛 Dépannage

### L'application ne se connecte pas à Supabase
- Vérifie que le fichier `.env.local` existe et contient les bonnes valeurs
- Vérifie que tu as bien exécuté le script SQL dans Supabase
- Vérifie que les Row Level Security policies sont activées

### Erreur "relation does not exist"
- Tu n'as pas exécuté le script `supabase_schema.sql` dans Supabase
- Va dans ton projet Supabase > SQL Editor et exécute-le

### Les données ne s'affichent pas
- Ouvre la console du navigateur (F12) pour voir les erreurs
- Vérifie que les tables existent dans Supabase (Table Editor)
- Vérifie que les policies RLS permettent l'accès aux données

## 📝 Licence

Projet personnel - Utilise-le comme tu veux !

## 🙏 Crédits

- Inspiré de l'univers de **No Man's Sky** par Hello Games
- Icônes par **Lucide React**
- Base de données par **Supabase**
