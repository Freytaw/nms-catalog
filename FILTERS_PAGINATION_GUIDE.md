# 🔍 Guide d'implémentation - Filtres & Pagination

## ✅ Exemple complet : Page Secteurs

La page **Secteurs** (`/src/pages/Sectors.jsx`) a été complètement implémentée avec filtres et pagination.

**Utilise-la comme référence pour implémenter les autres pages.**

---

## 📋 Pages à implémenter

Les 5 pages suivantes doivent être modifiées selon le même pattern :

### 1. **Systems.jsx** - Systèmes
**Filtres requis :**
- Nom de secteur (text)
- Nom de système (text)
- Classe d'étoile (select - valeurs existantes en base)
- Type de système (select - valeurs existantes en base)
- Race dominante (select - valeurs existantes en base)

### 2. **Planets.jsx** - Planètes  
**Filtres requis :**
- Nom de secteur (text)
- Nom de système (text)
- Nom de planète (text)
- Type de planète (select - valeurs existantes en base)
- Climat (select - valeurs existantes en base)
- Sentinelles (select - valeurs existantes en base)

### 3. **Creatures.jsx** - Créatures
**Filtres requis :**
- Nom de secteur (text)
- Nom de système (text)
- Nom de planète (text)
- Nom de créature (text)

### 4. **Bases.jsx** - Bases
**Filtres requis :**
- Nom de secteur (text)
- Nom de système (text)
- Nom de planète (text)
- Nom de base (text)

### 5. **PointsOfInterest.jsx** - POI
**Filtres requis :**
- Nom de secteur (text)
- Nom de système (text)
- Nom de planète (text)
- Nom de POI (text)
- Type de POI (select - valeurs existantes en base)

---

## 🛠️ Pattern d'implémentation

### **Étape 1 : Imports**

```javascript
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
```

### **Étape 2 : États pour filtres et pagination**

```javascript
// Filters - Un état par filtre
const [filterSectorName, setFilterSectorName] = useState('')
const [filterSystemName, setFilterSystemName] = useState('')
const [filterPlanetName, setFilterPlanetName] = useState('')
const [filterName, setFilterName] = useState('')
const [filterType, setFilterType] = useState('all')
// ... autres filtres selon les besoins

// Pagination
const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState(50)
```

### **Étape 3 : Extraction des valeurs uniques pour dropdowns**

```javascript
// Exemple : obtenir les types uniques
const uniqueTypes = [...new Set(items.map(item => item.type).filter(Boolean))]
const uniqueClimates = [...new Set(planets.map(p => p.climate).filter(Boolean))]
// etc.
```

### **Étape 4 : Fonction de filtrage**

```javascript
function getFilteredItems() {
  return items.filter(item => {
    // Filtre par secteur (via relations)
    if (filterSectorName && 
        !item.planets?.systems?.sectors?.name?.toLowerCase().includes(filterSectorName.toLowerCase())) {
      return false
    }
    
    // Filtre par système (via relations)
    if (filterSystemName && 
        !item.planets?.systems?.name?.toLowerCase().includes(filterSystemName.toLowerCase())) {
      return false
    }
    
    // Filtre par planète
    if (filterPlanetName && 
        !item.planets?.name?.toLowerCase().includes(filterPlanetName.toLowerCase())) {
      return false
    }
    
    // Filtre par nom de l'item
    if (filterName && 
        !item.name.toLowerCase().includes(filterName.toLowerCase())) {
      return false
    }
    
    // Filtre par type (dropdown)
    if (filterType !== 'all' && item.type !== filterType) {
      return false
    }
    
    return true
  })
}
```

### **Étape 5 : Fonction de regroupement + pagination**

```javascript
function getItemsByPlanet() {
  const filtered = getFilteredItems()
  const grouped = {}
  
  // Grouper
  filtered.forEach(item => {
    const planetName = item.planets?.name || 'Planète Inconnue'
    if (!grouped[planetName]) {
      grouped[planetName] = []
    }
    grouped[planetName].push(item)
  })
  
  // Trier les groupes
  const sortedPlanets = Object.keys(grouped).sort((a, b) => a.localeCompare(b))
  
  // Aplatir pour pagination
  const allItems = sortedPlanets.flatMap(planetName => 
    grouped[planetName].sort((a, b) => a.name.localeCompare(b.name))
  )
  
  // Appliquer la pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = allItems.slice(startIndex, endIndex)
  
  // Regrouper les items paginés
  const paginatedGrouped = {}
  paginatedItems.forEach(item => {
    const planetName = item.planets?.name || 'Planète Inconnue'
    if (!paginatedGrouped[planetName]) {
      paginatedGrouped[planetName] = []
    }
    paginatedGrouped[planetName].push(item)
  })
  
  return {
    groups: Object.keys(paginatedGrouped).sort((a, b) => a.localeCompare(b)).map(planetName => ({
      planetName,
      items: paginatedGrouped[planetName]
    })),
    totalCount: filtered.length
  }
}

const { groups, totalCount } = getItemsByPlanet()
const totalPages = Math.ceil(totalCount / itemsPerPage)
```

### **Étape 6 : Fonctions utilitaires**

```javascript
function resetFilters() {
  setFilterSectorName('')
  setFilterSystemName('')
  setFilterPlanetName('')
  setFilterName('')
  setFilterType('all')
  // ... reset autres filtres
  setCurrentPage(1)
}

function handlePageChange(page) {
  setCurrentPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleItemsPerPageChange(count) {
  setItemsPerPage(count)
  setCurrentPage(1)
}
```

### **Étape 7 : Composant FilterBar dans le rendu**

```javascript
{!showForm && items.length > 0 && (
  <FilterBar
    filters={[
      {
        type: 'text',
        name: 'sectorName',
        label: 'Nom du secteur',
        value: filterSectorName,
        onChange: (value) => {
          setFilterSectorName(value)
          setCurrentPage(1)
        }
      },
      {
        type: 'text',
        name: 'systemName',
        label: 'Nom du système',
        value: filterSystemName,
        onChange: (value) => {
          setFilterSystemName(value)
          setCurrentPage(1)
        }
      },
      {
        type: 'select',
        name: 'type',
        label: 'Type',
        value: filterType,
        onChange: (value) => {
          setFilterType(value)
          setCurrentPage(1)
        },
        options: uniqueTypes
      }
      // ... autres filtres
    ]}
    onReset={resetFilters}
    resultCount={totalCount}
  />
)}
```

### **Étape 8 : Message si aucun résultat**

```javascript
{totalCount === 0 ? (
  <div className="empty-state">
    <Icon size={64} />
    <p>Aucun résultat</p>
    <p>Modifie tes filtres pour voir des items</p>
  </div>
) : (
  // ... rendu normal
)}
```

### **Étape 9 : Composant Pagination après le rendu**

```javascript
{totalPages > 1 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalItems={totalCount}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    onItemsPerPageChange={handleItemsPerPageChange}
  />
)}
```

---

## 🔑 Points clés

### **Filtrage des relations (secteur/système/planète)**

Les créatures, bases et POI ont des relations imbriquées :
```
Creature → Planet → System → Sector
```

Pour filtrer par secteur sur une créature :
```javascript
if (filterSectorName && 
    !creature.planets?.systems?.sectors?.name?.toLowerCase().includes(filterSectorName.toLowerCase())) {
  return false
}
```

### **Requête Supabase pour relations**

Assure-toi que les relations sont chargées :
```javascript
supabase.from('creatures').select(`
  *,
  planets (
    name,
    systems (
      name,
      sectors (name)
    )
  )
`)
```

### **Reset des filtres**

Toujours reset la page à 1 quand un filtre change :
```javascript
onChange: (value) => {
  setFilterName(value)
  setCurrentPage(1)  // ← Important !
}
```

---

## 📝 Checklist par page

Pour chaque page à modifier :

- [ ] Importer FilterBar et Pagination
- [ ] Ajouter états pour filtres
- [ ] Ajouter états pagination
- [ ] Créer fonction getFilteredItems()
- [ ] Créer fonction getItemsByGroup()
- [ ] Extraire valeurs uniques pour dropdowns
- [ ] Créer resetFilters()
- [ ] Créer handlePageChange()
- [ ] Créer handleItemsPerPageChange()
- [ ] Ajouter FilterBar dans le rendu
- [ ] Ajouter message "Aucun résultat"
- [ ] Ajouter Pagination après le rendu
- [ ] Tester tous les filtres
- [ ] Tester la pagination
- [ ] Vérifier le scroll auto vers le haut

---

## 🎯 Résultat attendu

Chaque page doit avoir :
- ✅ Barre de filtres avec tous les champs requis
- ✅ Bouton "Réinitialiser"
- ✅ Compteur de résultats
- ✅ Message "Aucun résultat" si filtres trop restrictifs
- ✅ Pagination avec sélecteur 50/100/200
- ✅ Scroll automatique en haut au changement de page
- ✅ Groupement par parent maintenu
- ✅ Tri alphabétique maintenu

---

**Référence complète : `/src/pages/Sectors.jsx`**
