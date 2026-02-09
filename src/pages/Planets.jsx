import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Globe } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function Planets() {
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
    fauna_count: 0,
    flora_count: 0,
    notes: '',
    images: []
  })

  useEffect(() => {
    fetchData()
  }, [])

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
      } else {
        const { error } = await supabase
          .from('planets')
          .insert([formData])
        
        if (error) throw error
      }

      setFormData({
        system_id: '',
        name: '',
        type: '',
        climate: '',
        sentinels: '',
        resources: '',
        fauna_count: 0,
        flora_count: 0,
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
      fauna_count: planet.fauna_count || 0,
      flora_count: planet.flora_count || 0,
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
      fauna_count: 0,
      flora_count: 0,
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
              <select
                className="form-select"
                value={formData.sentinels}
                onChange={(e) => setFormData({ ...formData, sentinels: e.target.value })}
              >
                <option value="">Sélectionner</option>
                <option value="Absentes">Absentes</option>
                <option value="Éparses">Éparses</option>
                <option value="Observatrices">Observatrices</option>
                <option value="Agressives">Agressives</option>
                <option value="Hostiles">Hostiles</option>
              </select>
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
              <label className="form-label">Nombre d'espèces (Faune)</label>
              <input
                type="number"
                className="form-input"
                value={formData.fauna_count}
                onChange={(e) => setFormData({ ...formData, fauna_count: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre d'espèces (Flore)</label>
              <input
                type="number"
                className="form-input"
                value={formData.flora_count}
                onChange={(e) => setFormData({ ...formData, flora_count: parseInt(e.target.value) || 0 })}
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
          {planets.map((planet) => (
            <div key={planet.id} className="card">
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
                <p><strong>Faune :</strong> {planet.fauna_count} espèce(s)</p>
                {planet.notes && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)' }}>{planet.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Planets
