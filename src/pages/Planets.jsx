import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Globe } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import SingleImageUpload from '../components/SingleImageUpload'

function Planets() {
  const location = useLocation()
  const navigate = useNavigate()
  const [planets, setPlanets] = useState([])
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlanet, setEditingPlanet] = useState(null)
  const [formData, setFormData] = useState({
    system_id: '',
    name: '',
    type: '',
    climate: '',
    sentinels: '',
    resources: '',
    fauna_total: 0,
    flora_discovered: 0,
    minerals_discovered: 0,
    portal_coordinates: '',
    notes: '',
    images: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  // Detect navigation from detail page
  useEffect(() => {
    if (location.state?.editItem) {
      handleEdit(location.state.editItem)
      // Clear the state
      window.history.replaceState({}, document.title)
    } else if (location.state?.createWithSystemId) {
      setFormData({ ...formData, system_id: location.state.createWithSystemId })
      setShowForm(true)
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location])

  async function fetchData() {
    try {
      const [planetsRes, systemsRes] = await Promise.all([
        supabase.from('planets').select(`
          *,
          systems (name, sectors(name))
        `).order('name'),
        supabase.from('systems').select('*').order('name')
      ])

      if (planetsRes.error) throw planetsRes.error
      if (systemsRes.error) throw systemsRes.error

      setPlanets(planetsRes.data || [])
      setSystems(systemsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingPlanet) {
        const { error } = await supabase
          .from('planets')
          .update(formData)
          .eq('id', editingPlanet.id)
        
        if (error) throw error
        
        // Redirect to the updated planet's detail page
        navigate(`/planets/${editingPlanet.id}`)
        return
      } else {
        const { data, error } = await supabase
          .from('planets')
          .insert([formData])
          .select()
        
        if (error) throw error
        
        // Redirect to the newly created planet's detail page
        if (data && data[0]) {
          navigate(`/planets/${data[0].id}`)
          return
        }
      }

      setFormData({
        system_id: '',
        name: '',
        type: '',
        climate: '',
        sentinels: '',
        resources: '',
        fauna_total: 0,
        flora_discovered: 0,
        minerals_discovered: 0,
        portal_coordinates: '',
        notes: '',
        images: []
      })
      setEditingPlanet(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving planet:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette planète ?')) return

    try {
      const { error } = await supabase
        .from('planets')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting planet:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleEdit(planet) {
    setEditingPlanet(planet)
    setFormData({
      system_id: planet.system_id,
      name: planet.name,
      type: planet.type || '',
      climate: planet.climate || '',
      sentinels: planet.sentinels || '',
      resources: planet.resources || '',
      fauna_total: planet.fauna_total || 0,
      flora_discovered: planet.flora_discovered || 0,
      minerals_discovered: planet.minerals_discovered || 0,
      portal_coordinates: planet.portal_coordinates || '',
      notes: planet.notes || '',
      images: planet.images || []
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingPlanet(null)
    setFormData({
      system_id: '',
      name: '',
      type: '',
      climate: '',
      sentinels: '',
      resources: '',
      fauna_total: 0,
      flora_discovered: 0,
      minerals_discovered: 0,
      portal_coordinates: '',
      notes: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des planètes...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Planètes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nouvelle Planète
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingPlanet ? 'Modifier la planète' : 'Nouvelle planète'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Système *</label>
              <select
                className="form-select"
                value={formData.system_id}
                onChange={(e) => setFormData({ ...formData, system_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un système</option>
                {systems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type de planète</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Gelée, Sporifère, Pourpre"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Climat</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Grêle flamboyante, Tempête de neige"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sentinelles</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Absentes, Éparses, Observatrices, Agressives, Hostiles"
                value={formData.sentinels}
                onChange={(e) => setFormData({ ...formData, sentinels: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ressources principales</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Cadmium, Or, Phosphore"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Faune découverte</label>
              <p style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--nms-dark)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--nms-cyan)',
                color: 'var(--nms-gray)',
                fontSize: '0.875rem'
              }}>
                🔢 Calculé automatiquement en fonction du nombre de créatures associées à cette planète
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Faune totale</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 8"
                value={formData.fauna_total}
                onChange={(e) => setFormData({ ...formData, fauna_total: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Flore découverte</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 10"
                value={formData.flora_discovered}
                onChange={(e) => setFormData({ ...formData, flora_discovered: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minéraux découverts</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 3"
                value={formData.minerals_discovered}
                onChange={(e) => setFormData({ ...formData, minerals_discovered: parseInt(e.target.value) || 0 })}
              />
            </div>

            <SingleImageUpload
              imageUrl={formData.portal_coordinates}
              onChange={(url) => setFormData({ ...formData, portal_coordinates: url })}
              label="Coordonnées du portail"
            />

            <ImageUpload
              images={formData.images}
              onChange={(newImages) => {
                setFormData({ 
                  ...formData, 
                  images: newImages
                })
              }}
              label="Images de la planète"
            />

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Caractéristiques, observations..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingPlanet ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {planets.length === 0 ? (
        <div className="empty-state">
          <Globe size={64} />
          <p>Aucune planète enregistrée</p>
          <p>Commence par créer ta première planète !</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {planets.map((planet) => {
            const images = planet.images || []
            const mainImage = images[0]
            
            return (
            <div key={planet.id} className="card">
              {mainImage && (
                <img 
                  src={mainImage} 
                  alt={planet.name}
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
                <Link to={`/planets/${planet.id}`} className="card-title">
                  {planet.name}
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(planet)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(planet.id)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                {planet.systems && (
                  <p><strong>Système :</strong> {planet.systems.name}</p>
                )}
                {planet.type && (
                  <p><strong>Type :</strong> {planet.type}</p>
                )}
                {planet.climate && (
                  <p><strong>Climat :</strong> {planet.climate}</p>
                )}
                {planet.sentinels && (
                  <p><strong>Sentinelles :</strong> {planet.sentinels}</p>
                )}
                {(planet.fauna_discovered > 0 || planet.fauna_total > 0) && (
                  <p><strong>Faune :</strong> {planet.fauna_discovered}/{planet.fauna_total || '?'} espèce(s)</p>
                )}
                {planet.flora_discovered > 0 && (
                  <p><strong>Flore :</strong> {planet.flora_discovered} espèce(s)</p>
                )}
                {planet.minerals_discovered > 0 && (
                  <p><strong>Minéraux :</strong> {planet.minerals_discovered}</p>
                )}
                {planet.notes && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)' }}>{planet.notes}</p>
                )}
              </div>
            </div>
          )
          })}
        </div>
      )}
    </div>
  )
}

export default Planets
