import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import { POI_TYPES } from '../config/poiIcons'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'

function PointsOfInterest() {
  const location = useLocation()
  const navigate = useNavigate()
  const [pointsOfInterest, setPointsOfInterest] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPOI, setEditingPOI] = useState(null)
  const [coordinatesError, setCoordinatesError] = useState('')
  
  // Filters
  const [filterSectorName, setFilterSectorName] = useState('')
  const [filterSystemName, setFilterSystemName] = useState('')
  const [filterPlanetName, setFilterPlanetName] = useState('')
  const [filterPOIName, setFilterPOIName] = useState('')
  const [filterPOIType, setFilterPOIType] = useState('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)
  
  const [formData, setFormData] = useState({
    planet_id: '',
    name: '',
    type: '',
    coordinates: '',
    notes: '',
    images: []
  })

  // Validate coordinates format: "+12.34, -56.78"
  function validateCoordinates(coords) {
    if (!coords || coords.trim() === '') {
      setCoordinatesError('')
      return true // Empty is valid (optional field)
    }

    // Regex: [+/-]number.number, [+/-]number.number
    const regex = /^([+-]?\d+\.?\d*)\s*,\s*([+-]?\d+\.?\d*)$/
    const match = coords.match(regex)

    if (!match) {
      setCoordinatesError('Format invalide. Utilisez : +12.34, -56.78')
      return false
    }

    const lat = parseFloat(match[1])
    const lon = parseFloat(match[2])

    if (lat < -180 || lat > 180) {
      setCoordinatesError('Latitude doit être entre -180 et +180')
      return false
    }

    if (lon < -180 || lon > 180) {
      setCoordinatesError('Longitude doit être entre -180 et +180')
      return false
    }

    setCoordinatesError('')
    return true
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle quick-create from planet detail page
  useEffect(() => {
    if (location.state?.createWithPlanetId) {
      setFormData({
        ...formData,
        planet_id: location.state.createWithPlanetId
      })
      setShowForm(true)
    }
  }, [location])

  useEffect(() => {
    if (location.state?.editItem) {
      handleEdit(location.state.editItem)
    }
  }, [location])

  async function fetchData() {
    try {
      const [poisRes, planetsRes] = await Promise.all([
        supabase.from('points_of_interest').select(`
          *,
          planets (name, systems(name, sectors(name)))
        `).order('name'),
        supabase.from('planets').select('id, name').order('name')
      ])

      if (poisRes.error) throw poisRes.error
      if (planetsRes.error) throw planetsRes.error

      setPointsOfInterest(poisRes.data || [])
      setPlanets(planetsRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // Group POI by planet and sort alphabetically
  // Get unique POI types for filter dropdown
  const uniquePOITypes = [...new Set(pointsOfInterest.map(poi => poi.type).filter(Boolean))]

  // Apply filters
  function getFilteredPOI() {
    return pointsOfInterest.filter(poi => {
      // Filter by sector name (via relations)
      if (filterSectorName && 
          !poi.planets?.systems?.sectors?.name?.toLowerCase().includes(filterSectorName.toLowerCase())) {
        return false
      }
      
      // Filter by system name (via relations)
      if (filterSystemName && 
          !poi.planets?.systems?.name?.toLowerCase().includes(filterSystemName.toLowerCase())) {
        return false
      }
      
      // Filter by planet name (via relations)
      if (filterPlanetName && 
          !poi.planets?.name?.toLowerCase().includes(filterPlanetName.toLowerCase())) {
        return false
      }
      
      // Filter by POI name
      if (filterPOIName && 
          !poi.name.toLowerCase().includes(filterPOIName.toLowerCase())) {
        return false
      }
      
      // Filter by POI type
      if (filterPOIType !== 'all' && poi.type !== filterPOIType) {
        return false
      }
      
      return true
    })
  }

  function getPOIByPlanet() {
    const filtered = getFilteredPOI()
    const grouped = {}
    
    filtered.forEach(poi => {
      const planetName = poi.planets?.name || 'Planète Inconnue'
      if (!grouped[planetName]) {
        grouped[planetName] = []
      }
      grouped[planetName].push(poi)
    })
    
    const sortedPlanets = Object.keys(grouped).sort((a, b) => a.localeCompare(b))
    
    // Flatten for pagination
    const allPOIs = sortedPlanets.flatMap(planetName => 
      grouped[planetName].sort((a, b) => a.name.localeCompare(b.name))
    )
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedPOIs = allPOIs.slice(startIndex, endIndex)
    
    // Regroup paginated POIs
    const paginatedGrouped = {}
    paginatedPOIs.forEach(poi => {
      const planetName = poi.planets?.name || 'Planète Inconnue'
      if (!paginatedGrouped[planetName]) {
        paginatedGrouped[planetName] = []
      }
      paginatedGrouped[planetName].push(poi)
    })
    
    return {
      groups: Object.keys(paginatedGrouped).sort((a, b) => a.localeCompare(b)).map(planetName => ({
        planetName,
        pois: paginatedGrouped[planetName]
      })),
      totalCount: filtered.length
    }
  }

  function resetFilters() {
    setFilterSectorName('')
    setFilterSystemName('')
    setFilterPlanetName('')
    setFilterPOIName('')
    setFilterPOIType('all')
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

  const { groups, totalCount } = getPOIByPlanet()
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate coordinates before submitting
    if (!validateCoordinates(formData.coordinates)) {
      return // Stop if validation fails
    }
    
    try {
      if (editingPOI) {
        const { error } = await supabase
          .from('points_of_interest')
          .update(formData)
          .eq('id', editingPOI.id)
        
        if (error) throw error
        
        // Redirect to the updated POI's detail page
        navigate(`/points-of-interest/${editingPOI.id}`)
        return
      } else {
        const { data, error } = await supabase
          .from('points_of_interest')
          .insert([formData])
          .select()
        
        if (error) throw error
        
        // Redirect to the newly created POI's detail page
        if (data && data[0]) {
          navigate(`/points-of-interest/${data[0].id}`)
          return
        }
      }

      setFormData({
        planet_id: '',
        name: '',
        type: '',
        notes: '',
        images: []
      })
      setEditingPOI(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving point of interest:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  function handleEdit(poi) {
    setEditingPOI(poi)
    setFormData({
      planet_id: poi.planet_id,
      name: poi.name,
      type: poi.type || '',
      coordinates: poi.coordinates || '',
      notes: poi.notes || '',
      images: poi.images || []
    })
    setShowForm(true)
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce point d\'intérêt ?')) return

    try {
      const { error } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting point of interest:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingPOI(null)
    setCoordinatesError('')
    setFormData({
      planet_id: '',
      name: '',
      type: '',
      coordinates: '',
      notes: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>
          <MapPin size={32} />
          Points d'Intérêt
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Annuler' : 'Nouveau Point d\'Intérêt'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2>{editingPOI ? 'Modifier le point d\'intérêt' : 'Nouveau point d\'intérêt'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="card-content">
            <div className="form-group">
              <label className="form-label">Planète *</label>
              <select
                className="form-input"
                value={formData.planet_id}
                onChange={(e) => setFormData({ ...formData, planet_id: e.target.value })}
                required
              >
                <option value="">Sélectionner une planète</option>
                {planets.map((planet) => (
                  <option key={planet.id} value={planet.id}>
                    {planet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Ruines anciennes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <input
                type="text"
                className="form-input"
                placeholder="Choisissez un type ou saisissez-en un nouveau"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                list="poi-types-list"
              />
              <datalist id="poi-types-list">
                {POI_TYPES.map(type => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Coordonnées</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: +12.34, -56.78"
                value={formData.coordinates}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, coordinates: value })
                  validateCoordinates(value)
                }}
                style={coordinatesError ? { borderColor: 'var(--nms-secondary)' } : {}}
              />
              {coordinatesError && (
                <p style={{ 
                  color: 'var(--nms-secondary)', 
                  fontSize: '0.875rem', 
                  marginTop: '0.25rem' 
                }}>
                  {coordinatesError}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                placeholder="Détails supplémentaires..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Images</label>
              <ImageUpload
                images={formData.images}
                onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                label=""
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingPOI ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      {!showForm && pointsOfInterest.length > 0 && (
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
              type: 'text',
              name: 'planetName',
              label: 'Nom de la planète',
              value: filterPlanetName,
              onChange: (value) => {
                setFilterPlanetName(value)
                setCurrentPage(1)
              }
            },
            {
              type: 'text',
              name: 'poiName',
              label: 'Nom du POI',
              value: filterPOIName,
              onChange: (value) => {
                setFilterPOIName(value)
                setCurrentPage(1)
              }
            },
            {
              type: 'select',
              name: 'poiType',
              label: 'Type de POI',
              value: filterPOIType,
              onChange: (value) => {
                setFilterPOIType(value)
                setCurrentPage(1)
              },
              options: uniquePOITypes.sort()
            }
          ]}
          onReset={resetFilters}
          resultCount={totalCount}
        />
      )}

      {pointsOfInterest.length === 0 ? (
        <div className="empty-state">
          <MapPin size={64} />
          <p>Aucun point d'intérêt enregistré</p>
        </div>
      ) : totalCount === 0 ? (
        <div className="empty-state">
          <MapPin size={64} />
          <p>Aucun résultat</p>
          <p>Modifie tes filtres pour voir des points d'intérêt</p>
        </div>
      ) : (
        <>
          <div>
            {groups.map(({ planetName, pois: planetPOIs }) => (
              <div key={planetName} style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  color: 'var(--nms-primary)', 
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                  borderBottom: '2px solid var(--nms-primary)',
                  paddingBottom: '0.5rem'
                }}>
                  {planetName}
                </h2>
                <div className="grid grid-3">
                  {planetPOIs.map((poi) => {
                    const images = poi.images || []
                    const mainImage = images[0]
                    
                    return (
                      <div key={poi.id} className="card">
                        {mainImage && (
                          <img 
                            src={mainImage} 
                            alt={poi.name}
                            style={{ 
                              width: '100%', 
                              height: '200px', 
                              objectFit: 'cover', 
                              borderRadius: 'var(--radius-md)',
                              marginBottom: '1rem'
                            }}
                          />
                        )}
                        <div className="card-header">
                          <Link to={`/points-of-interest/${poi.id}`} className="card-title">
                            {poi.name}
                          </Link>
                          <div className="card-actions">
                            <button 
                              className="btn-icon"
                              onClick={() => handleEdit(poi)}
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="btn-icon"
                              onClick={() => handleDelete(poi.id)}
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="card-content">
                          {poi.type && <p><strong>Type:</strong> {poi.type}</p>}
                          {poi.planets && (
                            <p>
                              <strong>Planète:</strong> {poi.planets.name}
                              {poi.planets.systems && poi.planets.systems.name && (
                                <> • {poi.planets.systems.name}</>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  )
}

export default PointsOfInterest
