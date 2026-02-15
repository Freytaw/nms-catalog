import { useRef, useEffect } from 'react'

// Planet colors based on type
const planetColors = {
  'Toxique': { primary: '#7dff00', secondary: '#5bbd00' },
  'Radioactive': { primary: '#ff6b00', secondary: '#cc5500' },
  'Gelée': { primary: '#00d9ff', secondary: '#0099bb' },
  'Brûlante': { primary: '#ff0000', secondary: '#cc0000' },
  'Tempérée': { primary: '#00ff88', secondary: '#00bb66' },
  'Aride': { primary: '#ffcc00', secondary: '#cc9900' },
  'Morte': { primary: '#666666', secondary: '#444444' },
  'Exotique': { primary: '#ff00ff', secondary: '#cc00cc' },
  'Default': { primary: '#00d9ff', secondary: '#0099bb' }
}

// POI symbols based on type
const poiSymbols = {
  'Ruines': '🏛️',
  'Monument': '🗿',
  'Épave': '💀',
  'Site archéologique': '⚱️',
  'Transmission': '📡',
  'Portail': '🌀',
  'Grotte': '🕳️',
  'Structure': '🏗️',
  'Observatoire': '🔭',
  'Tour de communication': '📡',
  'default': '📍'
}

function PlanetMapCanvas({ 
  planet, 
  bases = [], 
  pointsOfInterest = [],
  width = 800,
  height = 400
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    drawMap(ctx, { planet, bases, pointsOfInterest }, width, height)
  }, [planet, bases, pointsOfInterest, width, height])

  // Parse coordinates from string "+12.34, -56.78"
  function parseCoordinates(coordString) {
    if (!coordString) return null
    
    const regex = /([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)/
    const match = coordString.match(regex)
    
    if (!match) return null
    
    const lat = parseFloat(match[1])
    const lon = parseFloat(match[2])
    
    // Validate ranges
    if (lat < -180 || lat > 180 || lon < -180 || lon > 180) {
      return null
    }
    
    return { lat, lon }
  }

  // Convert lat/lon to canvas x/y (equirectangular projection)
  function latLonToXY(lat, lon, width, height) {
    // Longitude: -180 (left) to +180 (right)
    // Latitude: +90 (top) to -90 (bottom)
    const x = ((lon + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    
    return { x, y }
  }

  // Get planet colors
  function getPlanetColors(planetType) {
    return planetColors[planetType] || planetColors.Default
  }

  // Get POI symbol
  function getPOISymbol(poiType) {
    return poiSymbols[poiType] || poiSymbols.default
  }

  // Draw planet background
  function drawPlanetBackground(ctx, planet, width, height) {
    const colors = getPlanetColors(planet.type)
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, width / 1.5
    )
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(1, colors.secondary)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  // Draw grid lines (optional, for reference)
  function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    
    // Vertical lines (longitude)
    for (let lon = -180; lon <= 180; lon += 30) {
      const { x } = latLonToXY(0, lon, width, height)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal lines (latitude)
    for (let lat = -90; lat <= 90; lat += 30) {
      const { y } = latLonToXY(lat, 0, width, height)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  // Draw a marker on the map
  function drawMarker(ctx, x, y, symbol, name, color = '#00d9ff') {
    ctx.save()
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 5
    ctx.shadowOffsetY = 2
    
    // Pin circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // Reset shadow for symbol
    ctx.shadowColor = 'transparent'
    
    // Symbol emoji
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(symbol, x, y)
    
    // Label
    if (name) {
      ctx.font = 'bold 11px Arial'
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 3
      ctx.strokeText(name, x, y + 20)
      ctx.fillText(name, x, y + 20)
    }
    
    ctx.restore()
  }

  // Main drawing function
  function drawMap(ctx, mapData, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // 1. Draw background
    drawPlanetBackground(ctx, mapData.planet, width, height)
    
    // 2. Draw grid (optional)
    drawGrid(ctx, width, height)
    
    // 3. Draw bases
    mapData.bases.forEach(base => {
      const coords = parseCoordinates(base.coordinates)
      if (coords) {
        const { x, y } = latLonToXY(coords.lat, coords.lon, width, height)
        drawMarker(ctx, x, y, '🏠', base.name, '#00ff88')
      }
    })
    
    // 4. Draw POI
    mapData.pointsOfInterest.forEach(poi => {
      const coords = parseCoordinates(poi.coordinates)
      if (coords) {
        const { x, y } = latLonToXY(coords.lat, coords.lon, width, height)
        const symbol = getPOISymbol(poi.type)
        drawMarker(ctx, x, y, symbol, poi.name, '#ffd60a')
      }
    })
  }

  return (
    <div className="planet-map-container" style={{ marginTop: '2rem' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '2px solid var(--nms-primary)',
          borderRadius: 'var(--radius-md)',
          cursor: 'crosshair',
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  )
}

export default PlanetMapCanvas
