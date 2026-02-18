// Configuration des icônes pour la carte
// Ajoute tes nouvelles icônes ici au fur et à mesure

export const POI_ICONS = {
  // Types avec icônes custom
  'Abri': '/icons/abri.png',
  'Bâtiment abandonné': '/icons/abandonne.png',
  'Tour de communication holographique': '/icons/tour_com.png',
  'Tas de déchets': '/icons/dechet.png',
  'Vaisseau écrasé': '/icons/crash_shuttle.png',
  'Débris': '/icons/debris.png',
  'Tour de retransmission': '/icons/retransmission.png',
  'Capsule de sauvetage': '/icons/capsule.png',
  'Campement mineur': '/icons/campement.png',
  'Vaisseau cargo écrasé': '/icons/crash_cargo.png',
  'Comptoir commercial': '/icons/comptoir.png',
  'Plaque ancienne': '/icons/plaque.png',
  'Usine de traitement des déchets': '/icons/usine.png',
  'Balise': '/icons/balise.png',
  'Monilithe': '/icons/monolith.png',
  
  // Fallback emoji pour les types sans icône custom
  'default': '📍'
}

export const BASE_ICON = '/icons/base.png'

// Liste des types POI prédéfinis (pour datalist)
export const POI_TYPES = [
  'Abri',
  'Bâtiment abandonné',
  'Tour de communication holographique',
  'Tas de déchets',
  'Vaisseau écrasé',
  'Débris',
  'Tour de retransmission',
  'Capsule de sauvetage',
  'Campement mineur',
  'Vaisseau cargo écrasé',
  'Comptoir commercial',
  'Plaque ancienne',
  'Usine de traitement des déchets',
  'Balise',
  'Monilithe'
]

// Fonction pour obtenir l'icône POI (chemin image ou emoji)
export function getPOIIcon(type) {
  return POI_ICONS[type] || POI_ICONS.default
}

// Vérifie si c'est une image (path) ou un emoji
export function isImageIcon(icon) {
  return icon && icon.startsWith('/')
}
