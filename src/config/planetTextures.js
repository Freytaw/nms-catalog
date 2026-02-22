// Planet textures based on type
// Format: CSS pattern or image path

export const PLANET_TEXTURES = {
  // Textures par type de planète
  'Toxique': 'toxic',
  'Radioactive': 'radioactive',
  'Gelée': 'ice',
  'Glacée': 'ice',
  'Brûlante': 'volcanic',
  'Volcanique': 'volcanic',
  'Tempérée': 'temperate',
  'Luxuriante': 'lush',
  'Aride': 'desert',
  'Désertique': 'desert',
  'Morte': 'barren',
  'Stérile': 'sterile',
  'Exotique': 'exotic',
  'Paradisiaque': 'paradise',
  'Jade condamnée': 'jade',
  'Sporifère': 'spore',
  'Abandonnée': 'abandoned',
  'Pourpre': 'purple',
  'Isotopique': 'isotopic',
  'Default': 'barren'
}

// Available texture patterns
export const TEXTURE_PATTERNS = [
  { value: 'toxic', label: 'Toxique (vert acide)', color: '#7dff00' },
  { value: 'radioactive', label: 'Radioactive (orange)', color: '#ff6b00' },
  { value: 'ice', label: 'Gelée (bleu glacier)', color: '#00d9ff' },
  { value: 'volcanic', label: 'Volcanique (rouge lave)', color: '#ff0000' },
  { value: 'temperate', label: 'Tempérée (vert)', color: '#00ff88' },
  { value: 'lush', label: 'Luxuriante (vert foncé)', color: '#00bb44' },
  { value: 'desert', label: 'Désertique (jaune)', color: '#ffcc00' },
  { value: 'barren', label: 'Morte (gris)', color: '#666666' },
  { value: 'exotic', label: 'Exotique (violet)', color: '#ff00ff' },
  { value: 'paradise', label: 'Paradisiaque (cyan clair)', color: '#88ffff' },
  { value: 'sterile', label: 'Stérile (orange)', color: '#ff9933' },
  { value: 'jade', label: 'Jade condamnée (rose violet)', color: '#cc66cc' },
  { value: 'spore', label: 'Sporifère (vert spore)', color: '#66dd44' },
  { value: 'abandoned', label: 'Abandonnée (noir orange)', color: '#442200' },
  { value: 'purple', label: 'Pourpre (gris rouge)', color: '#884444' },
  { value: 'isotopic', label: 'Isotopique (bleu électrique)', color: '#00aaff' }
]

// Get texture for a planet type
export function getPlanetTexture(planetType, customTexture = null) {
  // Custom texture overrides default
  if (customTexture) {
    return customTexture
  }
  
  // Get texture from type
  return PLANET_TEXTURES[planetType] || PLANET_TEXTURES.Default
}

// Get texture color
export function getTextureColor(texture) {
  const pattern = TEXTURE_PATTERNS.find(p => p.value === texture)
  return pattern ? pattern.color : '#00d9ff'
}

// Generate canvas pattern for texture
export function generateTexturePattern(ctx, texture, width, height) {
  const color = getTextureColor(texture)
  
  // Base color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  
  // Add texture overlay based on type
  switch (texture) {
    case 'toxic':
      addToxicPattern(ctx, width, height)
      break
    case 'radioactive':
      addRadioactivePattern(ctx, width, height)
      break
    case 'ice':
      addIcePattern(ctx, width, height)
      break
    case 'volcanic':
      addVolcanicPattern(ctx, width, height)
      break
    case 'temperate':
    case 'lush':
      addVegetationPattern(ctx, width, height)
      break
    case 'desert':
      addDesertPattern(ctx, width, height)
      break
    case 'exotic':
      addExoticPattern(ctx, width, height)
      break
    case 'paradise':
      addParadisePattern(ctx, width, height)
      break
    case 'sterile':
      addSterilePattern(ctx, width, height)
      break
    case 'jade':
      addJadePattern(ctx, width, height)
      break
    case 'spore':
      addSporePattern(ctx, width, height)
      break
    case 'abandoned':
      addAbandonedPattern(ctx, width, height)
      break
    case 'purple':
      addPurplePattern(ctx, width, height)
      break
    case 'isotopic':
      addIsotopicPattern(ctx, width, height)
      break
    case 'barren':
    default:
      addBarrenPattern(ctx, width, height)
      break
  }
}

// Toxic pattern: green streaks
function addToxicPattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.fillStyle = '#5bbd00'
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const w = Math.random() * 100 + 50
    const h = Math.random() * 20 + 5
    ctx.fillRect(x, y, w, h)
  }
  ctx.globalAlpha = 1
}

// Radioactive pattern: orange spots
function addRadioactivePattern(ctx, width, height) {
  ctx.globalAlpha = 0.4
  ctx.fillStyle = '#cc5500'
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 30 + 10
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Ice pattern: blue crystals
function addIcePattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 40 + 20
    // Draw crystal
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.lineTo(x + size/2, y)
    ctx.lineTo(x, y + size)
    ctx.lineTo(x - size/2, y)
    ctx.closePath()
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Volcanic pattern: lava flows
function addVolcanicPattern(ctx, width, height) {
  ctx.globalAlpha = 0.4
  ctx.fillStyle = '#cc0000'
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(x + Math.random() * 100 - 50, y + j * 20)
    }
    ctx.lineWidth = Math.random() * 10 + 5
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Vegetation pattern: organic shapes
function addVegetationPattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.fillStyle = '#00bb66'
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 20 + 5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Desert pattern: sand dunes
function addDesertPattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = '#cc9900'
  ctx.lineWidth = 3
  for (let i = 0; i < 15; i++) {
    const y = (i / 15) * height
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < width; x += 50) {
      ctx.quadraticCurveTo(x + 25, y + Math.random() * 20 - 10, x + 50, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Exotic pattern: abstract shapes
function addExoticPattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.fillStyle = '#cc00cc'
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const sides = Math.floor(Math.random() * 5) + 5
    const radius = Math.random() * 30 + 15
    ctx.beginPath()
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Paradise pattern: colorful areas
function addParadisePattern(ctx, width, height) {
  ctx.globalAlpha = 0.2
  const colors = ['#00ffaa', '#00ddff', '#88ffff', '#aaffff']
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 40 + 20
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Barren pattern: craters
function addBarrenPattern(ctx, width, height) {
  ctx.globalAlpha = 0.4
  ctx.fillStyle = '#444444'
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 40 + 10
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    // Inner crater
    ctx.fillStyle = '#333333'
    ctx.beginPath()
    ctx.arc(x, y, r * 0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#444444'
  }
  ctx.globalAlpha = 1
}

// Sterile pattern: orange dusty terrain
function addSterilePattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  ctx.fillStyle = '#cc6600'
  // Dusty patches
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 50 + 20
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // Orange lines (cracks)
  ctx.strokeStyle = '#ff8833'
  ctx.lineWidth = 2
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.random() * 150 - 75, y + Math.random() * 150 - 75)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Jade condemned pattern: pink/purple crystalline
function addJadePattern(ctx, width, height) {
  ctx.globalAlpha = 0.3
  // Purple crystals
  const colors = ['#dd88dd', '#bb66bb', '#ff99ff']
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 35 + 15
    // Draw hexagonal crystal
    ctx.beginPath()
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2
      const px = x + Math.cos(angle) * size
      const py = y + Math.sin(angle) * size
      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }
  // Pink veins
  ctx.strokeStyle = '#ffaaff'
  ctx.lineWidth = 3
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let j = 0; j < 4; j++) {
      ctx.lineTo(x + Math.random() * 100 - 50, y + j * 30)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Spore pattern: green spore clusters
function addSporePattern(ctx, width, height) {
  ctx.globalAlpha = 0.4
  // Spore clusters
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const clusterSize = Math.floor(Math.random() * 5) + 3
    ctx.fillStyle = '#44bb22'
    for (let j = 0; j < clusterSize; j++) {
      const offsetX = Math.random() * 20 - 10
      const offsetY = Math.random() * 20 - 10
      const r = Math.random() * 8 + 4
      ctx.beginPath()
      ctx.arc(x + offsetX, y + offsetY, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  // Spore clouds
  ctx.fillStyle = '#88dd66'
  ctx.globalAlpha = 0.2
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 60 + 30
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Abandoned pattern: dark with orange rust
function addAbandonedPattern(ctx, width, height) {
  // Dark patches
  ctx.globalAlpha = 0.5
  ctx.fillStyle = '#221100'
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 70 + 30
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // Orange rust streaks
  ctx.fillStyle = '#ff6622'
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const w = Math.random() * 80 + 40
    const h = Math.random() * 15 + 5
    const angle = Math.random() * Math.PI * 2
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillRect(-w/2, -h/2, w, h)
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

// Purple pattern: grey-red rocky
function addPurplePattern(ctx, width, height) {
  ctx.globalAlpha = 0.4
  // Dark red patches
  ctx.fillStyle = '#662222'
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 45 + 20
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  // Grey rock formations
  ctx.fillStyle = '#666666'
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const sides = Math.floor(Math.random() * 3) + 4
    const radius = Math.random() * 25 + 15
    ctx.beginPath()
    for (let j = 0; j < sides; j++) {
      const angle = (j / sides) * Math.PI * 2
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }
  // Red-purple cracks
  ctx.strokeStyle = '#aa4444'
  ctx.lineWidth = 2
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let j = 0; j < 3; j++) {
      ctx.lineTo(x + Math.random() * 80 - 40, y + j * 25)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// Isotopic pattern: electric blue energy
function addIsotopicPattern(ctx, width, height) {
  // Electric blue glowing spots
  ctx.globalAlpha = 0.4
  const colors = ["#00ccff", "#0088ff", "#00aaff"]
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 35 + 15
    // Glowing circle
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)])
    gradient.addColorStop(1, "rgba(0, 170, 255, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // Electric arcs
  ctx.strokeStyle = "#66ddff"
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.moveTo(x, y)
    // Zigzag electric arc
    for (let j = 0; j < 5; j++) {
      const offsetX = Math.random() * 60 - 30
      const offsetY = Math.random() * 60 - 30
      ctx.lineTo(x + offsetX, y + offsetY)
    }
    ctx.stroke()
  }
  
  // Energy particles
  ctx.fillStyle = "#ffffff"
  ctx.globalAlpha = 0.6
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 3 + 1
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.globalAlpha = 1
}

