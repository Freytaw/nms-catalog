import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function PointsOfInterest() {
  const location = useLocation()
  const navigate = useNavigate()
  const [pointsOfInterest, setPointsOfInterest] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPOI, setEditingPOI] = useState(null)
  const [formData, setFormData] = useState({
    planet_id: '',
    name: '',
    type: '',
    notes: '',
    images: []
  })

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

  async function handleSubmit(e) {
    e.preventDefault()
    
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
    setFormData({
      planet_id: '',
      name: '',
      type: '',
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
      <div className="header">
        <h1>
          <MapPin size={32} />
          Points d'Intérêt
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          {showForm ? 'Annuler' : 'Ajouter un point d\'intérêt'}
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
                placeholder="Ex: Ruines, Monument, Épave, Site archéologique"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
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

      {pointsOfInterest.length === 0 ? (
        <div className="empty-state">
          <MapPin size={64} />
          <p>Aucun point d'intérêt enregistré</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {pointsOfInterest.map((poi) => {
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
      )}
    </div>
  )
}

export default PointsOfInterest
