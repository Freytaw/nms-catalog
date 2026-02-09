import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Map } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function Sectors() {
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSector, setEditingSector] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    coordinates: '',
    discovery_date: new Date().toISOString().split('T')[0],
    notes: '',
    image_url: '',
    images: []
  })

  useEffect(() => {
    fetchSectors()
  }, [])

  async function fetchSectors() {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('discovery_date', { ascending: false })

      if (error) throw error
      setSectors(data || [])
    } catch (error) {
      console.error('Error fetching sectors:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingSector) {
        const { error } = await supabase
          .from('sectors')
          .update(formData)
          .eq('id', editingSector.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('sectors')
          .insert([formData])
        
        if (error) throw error
      }

      setFormData({
        name: '',
        coordinates: '',
        discovery_date: new Date().toISOString().split('T')[0],
        notes: '',
        image_url: '',
        images: []
      })
      setEditingSector(null)
      setShowForm(false)
      fetchSectors()
    } catch (error) {
      console.error('Error saving sector:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) return

    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSectors()
    } catch (error) {
      console.error('Error deleting sector:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleEdit(sector) {
    setEditingSector(sector)
    setFormData({
      name: sector.name,
      coordinates: sector.coordinates || '',
      discovery_date: sector.discovery_date,
      notes: sector.notes || '',
      image_url: sector.image_url || '',
      images: sector.images || []
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingSector(null)
    setFormData({
      name: '',
      coordinates: '',
      discovery_date: new Date().toISOString().split('T')[0],
      notes: '',
      image_url: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des secteurs...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Secteurs</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nouveau Secteur
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingSector ? 'Modifier le secteur' : 'Nouveau secteur'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
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
              <label className="form-label">Coordonnées</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: HUKYA:046A:0081:0D6D:0038"
                value={formData.coordinates}
                onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date de découverte</label>
              <input
                type="date"
                className="form-input"
                value={formData.discovery_date}
                onChange={(e) => setFormData({ ...formData, discovery_date: e.target.value })}
              />
            </div>

            <ImageUpload
              images={formData.images}
              onChange={(newImages) => {
                setFormData({ 
                  ...formData, 
                  images: newImages,
                  image_url: newImages[0] || '' 
                })
              }}
              label="Images du secteur"
            />

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes et observations..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingSector ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {sectors.length === 0 ? (
        <div className="empty-state">
          <Map size={64} />
          <p>Aucun secteur enregistré</p>
          <p>Commence par créer ton premier secteur !</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {sectors.map((sector) => (
            <div key={sector.id} className="card">
              {sector.image_url && (
                <img 
                  src={sector.image_url} 
                  alt={sector.name}
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
                <Link to={`/sectors/${sector.id}`} className="card-title">
                  {sector.name}
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(sector)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(sector.id)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                {sector.coordinates && (
                  <p><strong>Coordonnées :</strong> {sector.coordinates}</p>
                )}
                {sector.discovery_date && (
                  <p><strong>Découvert le :</strong> {new Date(sector.discovery_date).toLocaleDateString('fr-FR')}</p>
                )}
                {sector.notes && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)' }}>{sector.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Sectors
