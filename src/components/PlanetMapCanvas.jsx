import { useRef, useEffect, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'
import { getPOIIcon, isImageIcon, BASE_ICON } from '../config/poiIcons'
import { getPlanetTexture, generateTexturePattern } from '../config/planetTextures'

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

function PlanetMapCanvas({ 
  planet, 
  bases = [], 
  pointsOfInterest = [],
  width = 1600,
  height = 800
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  
  // Zoom and pan state
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width, height })
  const [loadedImages, setLoadedImages] = useState({})
  const [textureCanvas, setTextureCanvas] = useState(null)

  // Generate planet texture once
  useEffect(() => {
    if (!planet) return
    
    // Create off-screen canvas for texture
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = width
    offscreenCanvas.height = height
    const ctx = offscreenCanvas.getContext('2d')
    
    // Generate texture
    const texture = getPlanetTexture(planet.type, planet.planet_texture)
    generateTexturePattern(ctx, texture, width, height)
    
    setTextureCanvas(offscreenCanvas)
  }, [planet?.type, planet?.planet_texture, width, height])

  // Preload POI and base images
  useEffect(() => {
    const imagesToLoad = {}
    const imagePromises = []

    // Load base icon if we have bases
    if (bases.length > 0 && !loadedImages[BASE_ICON]) {
      const img = new Image()
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          imagesToLoad[BASE_ICON] = img
          resolve()
        }
        img.onerror = reject
      })
      img.src = BASE_ICON
      imagePromises.push(promise)
    }

    // Collect all unique POI types with image icons
    const poiTypes = new Set(pointsOfInterest.map(poi => poi.type).filter(Boolean))
    
    poiTypes.forEach(type => {
      const icon = getPOIIcon(type)
      if (isImageIcon(icon) && !loadedImages[icon]) {
        const img = new Image()
        const promise = new Promise((resolve, reject) => {
          img.onload = () => {
            imagesToLoad[icon] = img
            resolve()
          }
          img.onerror = reject
        })
        img.src = icon
        imagePromises.push(promise)
      }
    })

    if (imagePromises.length > 0) {
      Promise.all(imagePromises).then(() => {
        setLoadedImages(prev => ({ ...prev, ...imagesToLoad }))
      }).catch(err => {
        console.error('Error loading map icons:', err)
      })
    }
  }, [pointsOfInterest, bases])

  useEffect(() => {
    redraw()
  }, [planet, bases, pointsOfInterest, scale, offset, canvasSize, loadedImages, textureCanvas])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)
      
      if (isNowFullscreen) {
        setCanvasSize({
          width: window.screen.width,
          height: window.screen.height
        })
      } else {
        setCanvasSize({ width, height })
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [width, height])

  // Prevent page scroll when wheeling over container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const preventPageScroll = (e) => {
      e.preventDefault()
    }

    container.addEventListener('wheel', preventPageScroll, { passive: false })
    return () => container.removeEventListener('wheel', preventPageScroll)
  }, [])

  function redraw() {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    drawMap(ctx, { planet, bases, pointsOfInterest }, canvasSize.width, canvasSize.height, scale, offset)
  }

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
    const x = ((lon + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    return { x, y }
  }

  // Get planet colors
  function getPlanetColors(planetType) {
    return planetColors[planetType] || planetColors.Default
  }

  // Draw planet background
  function drawPlanetBackground(ctx, planet, width, height) {
    // Use pre-generated texture canvas
    if (textureCanvas) {
      ctx.drawImage(textureCanvas, 0, 0, width, height)
    } else {
      // Fallback: solid color if texture not ready
      ctx.fillStyle = '#00d9ff'
      ctx.fillRect(0, 0, width, height)
    }
  }

  // Draw grid lines
  function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1
    
    // Vertical lines (longitude) every 30°
    for (let lon = -180; lon <= 180; lon += 30) {
      const { x } = latLonToXY(0, lon, width, height)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
      
      // Label longitude
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${lon}°`, x, height - 5)
    }
    
    // Horizontal lines (latitude) every 30°
    for (let lat = -90; lat <= 90; lat += 30) {
      const { y } = latLonToXY(lat, 0, width, height)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
      
      // Label latitude
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`${lat}°`, 5, y - 5)
    }
  }

  // Draw a marker on the map (with constant size regardless of zoom)
  function drawMarker(ctx, x, y, symbol, name, color = '#00d9ff', currentScale, image = null) {
    ctx.save()
    
    // Move to position, then inverse scale to keep marker at constant size
    ctx.translate(x, y)
    ctx.scale(1 / currentScale, 1 / currentScale)
    
    if (image) {
      // Reset all styles completely for image
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      // Use native image size (should be 64x64) - no resizing to avoid pixel alignment issues
      const iconSize = image.width || 64
      ctx.drawImage(image, -iconSize/2, -iconSize/2)
    } else {
      // Shadow for emoji markers
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2
      
      // Pin circle for emoji
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.shadowColor = 'transparent'
      
      // Symbol emoji
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(symbol, 0, 0)
    }
    
    // Reset shadow for label
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Label
    if (name) {
      ctx.font = 'bold 14px Arial'
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.lineWidth = 4
      ctx.textAlign = 'center'
      const labelY = image ? 38 : 25  // Further down for larger image
      ctx.strokeText(name, 0, labelY)
      ctx.fillText(name, 0, labelY)
    }
    
    ctx.restore()
  }

  // Main drawing function
  function drawMap(ctx, mapData, width, height, scale, offset) {
    // Clear and reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    
    // Apply zoom and pan transform
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)
    
    // Draw background
    drawPlanetBackground(ctx, mapData.planet, width, height)
    
    // Draw grid
    drawGrid(ctx, width, height)
    
    // Draw bases
    mapData.bases.forEach(base => {
      const coords = parseCoordinates(base.coordinates)
      if (coords) {
        const { x, y } = latLonToXY(coords.lat, coords.lon, width, height)
        const baseImage = loadedImages[BASE_ICON]
        if (baseImage) {
          drawMarker(ctx, x, y, '', base.name, '#00ff88', scale, baseImage)
        } else {
          // Fallback to emoji if image not loaded
          drawMarker(ctx, x, y, '🏠', base.name, '#00ff88', scale)
        }
      }
    })
    
    // Draw POI
    mapData.pointsOfInterest.forEach(poi => {
      const coords = parseCoordinates(poi.coordinates)
      if (coords) {
        const { x, y } = latLonToXY(coords.lat, coords.lon, width, height)
        const icon = getPOIIcon(poi.type)
        
        if (isImageIcon(icon)) {
          // Use custom image if loaded
          const image = loadedImages[icon]
          drawMarker(ctx, x, y, '', poi.name, '#ffd60a', scale, image)
        } else {
          // Use emoji fallback
          drawMarker(ctx, x, y, icon, poi.name, '#ffd60a', scale)
        }
      }
    })
  }

  // Zoom controls
  function handleZoomIn() {
    const container = containerRef.current
    if (!container) return
    
    // Zoom toward center of visible area
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const newScale = Math.min(scale * 1.5, 50) // Max 5000%
    const scaleChange = newScale / scale
    
    const newOffsetX = centerX - (centerX - offset.x) * scaleChange
    const newOffsetY = centerY - (centerY - offset.y) * scaleChange
    
    setScale(newScale)
    setOffset({ x: newOffsetX, y: newOffsetY })
  }

  function handleZoomOut() {
    const container = containerRef.current
    if (!container) return
    
    // Zoom toward center of visible area
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const newScale = Math.max(scale / 1.5, 0.5) // Min 50%
    const scaleChange = newScale / scale
    
    const newOffsetX = centerX - (centerX - offset.x) * scaleChange
    const newOffsetY = centerY - (centerY - offset.y) * scaleChange
    
    setScale(newScale)
    setOffset({ x: newOffsetX, y: newOffsetY })
  }

  function handleResetZoom() {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  function handleFullscreen() {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Erreur fullscreen:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Mouse wheel zoom
  function handleWheel(e) {
    e.preventDefault()
    e.stopPropagation()
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Mouse position relative to canvas
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Zoom factor
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
    const newScale = Math.max(0.5, Math.min(scale * zoomFactor, 50)) // Max 5000%
    
    // Adjust offset to zoom toward mouse position
    const scaleChange = newScale / scale
    const newOffsetX = mouseX - (mouseX - offset.x) * scaleChange
    const newOffsetY = mouseY - (mouseY - offset.y) * scaleChange
    
    setScale(newScale)
    setOffset({ x: newOffsetX, y: newOffsetY })
  }

  // Mouse drag to pan
  function handleMouseDown(e) {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  function handleMouseMove(e) {
    if (!isDragging) return
    
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  return (
    <div className="planet-map-container" style={{ marginTop: '2rem' }}>
      {/* Zoom controls */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1rem',
        alignItems: 'center'
      }}>
        <button 
          className="btn btn-secondary"
          onClick={handleZoomIn}
          title="Zoomer"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleZoomOut}
          title="Dézoomer"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleResetZoom}
          title="Réinitialiser (100%)"
        >
          <RotateCcw size={20} />
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleFullscreen}
          title="Plein écran"
        >
          <Maximize2 size={20} />
        </button>
        <span style={{ 
          color: 'var(--nms-gray)', 
          fontSize: '0.875rem',
          marginLeft: '1rem'
        }}>
          Zoom: {Math.round(scale * 100)}%
        </span>
        <span style={{ 
          color: 'var(--nms-gray)', 
          fontSize: '0.875rem',
          marginLeft: '1rem',
          fontStyle: 'italic'
        }}>
          💡 Molette pour zoomer, cliquer-glisser pour déplacer
        </span>
      </div>

      {/* Canvas container */}
      <div 
        ref={containerRef}
        style={{ 
          overflow: 'hidden',
          border: isFullscreen ? 'none' : '2px solid var(--nms-primary)',
          borderRadius: isFullscreen ? '0' : 'var(--radius-md)',
          backgroundColor: '#000',
          maxHeight: isFullscreen ? '100vh' : '600px',
          height: isFullscreen ? '100vh' : 'auto',
          width: '100%',
          maxWidth: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            display: 'block',
            imageRendering: 'crisp-edges',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  )
}

export default PlanetMapCanvas
