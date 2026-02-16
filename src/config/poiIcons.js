// Configuration des icônes POI
// Ajoute tes nouvelles icônes ici au fur et à mesure

export const POI_ICONS = {
  // Types avec icônes custom
  'Abri': '/icons/abri.png',
  
  // Fallback emoji pour les types sans icône custom
  'default': '📍'
}

// Fonction pour obtenir l'icône (chemin image ou emoji)
export function getPOIIcon(type) {
  return POI_ICONS[type] || POI_ICONS.default
}

// Vérifie si c'est une image (path) ou un emoji
export function isImageIcon(icon) {
  return icon.startsWith('/')
}
