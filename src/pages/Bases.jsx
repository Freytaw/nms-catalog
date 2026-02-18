import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Building } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function Bases() {
  const location = useLocation()
  const navigate = useNavigate()
  const [bases, setBases] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBase, setEditingBase] = useState(null)
  const [coordinatesError, setCoordinatesError] = useState('')
  const [formData, setFormData] = useState({
    planet_id: '',
    name: '',
    location_description: '',
    coordinates: '',
    resources_nearby: '',
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

  // Detect navigation from detail page
  useEffect(() => {
    if (location.state?.editItem) {
      handleEdit(location.state.editItem)
      // Clear the state
      window.history.replaceState({}, document.title)
    } else if (location.state?.createWithPlanetId) {
      setFormData({ ...formData, planet_id: location.state.createWithPlanetId })
      setShowForm(true)
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  async function fetchData() {
    try {
      const [basesRes, planetsRes] = await Promise.all([
        supabase.from('bases').select(`
          *,
          planets (name, systems(name))
        `).order('name'),
        supabase.from('planets').select('*').order('name')
      ])

      if (basesRes.error) throw basesRes.error
      if (planetsRes.error) throw planetsRes.error

      setBases(basesRes.data || [])
      setPlanets(planetsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group bases by planet and sort alphabetically
  function getBasesByPlanet() {
    const grouped = {}
    
    bases.forEach(base => {
      const planetName = base.planets?.name || 'Planète Inconnue'
      if (!grouped[planetName]) {
        grouped[planetName] = []
      }
      grouped[planetName].push(base)
    })
    
    // Sort planet names alphabetically
    const sortedPlanets = Object.keys(grouped).sort((a, b) => a.localeCompare(b))
    
    return sortedPlanets.map(planetName => ({
      planetName,
      bases: grouped[planetName].sort((a, b) => a.name.localeCompare(b.name)) // Sort bases alphabetically
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate coordinates before submitting
    if (!validateCoordinates(formData.coordinates)) {
      return // Stop if validation fails
    }
    
    try {
      if (editingBase) {
        const { error } = await supabase
          .from('bases')
          .update(formData)
          .eq('id', editingBase.id)
        
        if (error) throw error
        
        // Redirect to the updated base's detail page
        navigate(`/bases/${editingBase.id}`)
        return
      } else {
        const { data, error } = await supabase
          .from('bases')
          .insert([formData])
          .select()
        
        if (error) throw error
        
        // Redirect to the newly created base's detail page
        if (data && data[0]) {
          navigate(`/bases/${data[0].id}`)
          return
        }
      }

      setFormData({
        planet_id: '',
        name: '',
        location_description: '',
        resources_nearby: '',
        notes: '',
        images: []
      })
      setEditingBase(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving base:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette base ?')) return

    try {
      const { error } = await supabase
        .from('bases')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting base:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleEdit(base) {
    setEditingBase(base)
    setFormData({
      planet_id: base.planet_id,
      name: base.name,
      location_description: base.location_description || '',
      coordinates: base.coordinates || '',
      resources_nearby: base.resources_nearby || '',
      notes: base.notes || '',
      images: base.images || []
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingBase(null)
    setCoordinatesError('')
    setFormData({
      planet_id: '',
      name: '',
      location_description: '',
      coordinates: '',
      resources_nearby: '',
      notes: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des bases...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Bases</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nouvelle Base
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingBase ? 'Modifier la base' : 'Nouvelle base'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Planète *</label>
              <select
                className="form-select"
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
                placeholder="Ex: Station Fubuki, Refuge Kodama"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Localisation</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Plaine de Fubuki, Promontoire forestier"
                value={formData.location_description}
                onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
              />
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
              <label className="form-label">Ressources à proximité</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Phosphore, Cadmium"
                value={formData.resources_nearby}
                onChange={(e) => setFormData({ ...formData, resources_nearby: e.target.value })}
              />
            </div>

            <ImageUpload
              images={formData.images}
              onChange={(newImages) => {
                setFormData({ 
                  ...formData, 
                  images: newImages
                })
              }}
              label="Images de la base"
            />

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Description, objectif de la base..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingBase ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {bases.length === 0 ? (
        <div className="empty-state">
          <Building size={64} />
          <p>Aucune base enregistrée</p>
          <p>Commence par créer ta première base !</p>
        </div>
      ) : (
        <div>
          {getBasesByPlanet().map(({ planetName, bases: planetBases }) => (
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
              <div className="grid grid-2">
                {planetBases.map((base) => {
                  const images = base.images || []
                  const mainImage = images[0]
                  
                  return (
                    <div key={base.id} className="card">
                      {mainImage && (
                        <img 
                          src={mainImage} 
                          alt={base.name}
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
                        <Link to={`/bases/${base.id}`} className="card-title">
                          {base.name}
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => handleEdit(base)}
                            style={{ padding: '0.5rem' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDelete(base.id)}
                            style={{ padding: '0.5rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="card-content">
                        {base.planets && (
                          <p><strong>Planète :</strong> {base.planets.name}</p>
                        )}
                        {base.location_description && (
                          <p><strong>Localisation :</strong> {base.location_description}</p>
                        )}
                        {base.resources_nearby && (
                          <p><strong>Ressources :</strong> {base.resources_nearby}</p>
                        )}
                        {base.notes && (
                          <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)' }}>{base.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bases
