import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Database } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function Systems() {
  const [systems, setSystems] = useState([])
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSystem, setEditingSystem] = useState(null)
  const [formData, setFormData] = useState({
    sector_id: '',
    name: '',
    star_class: '',
    conflict_level: '',
    economy: '',
    planet_count: 0,
    system_type: '',
    dominant_race: '',
    interesting_buy: '',
    interesting_sell: '',
    discovery_date: new Date().toISOString().split('T')[0],
    notes: '',
    image_url: '',
    images: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [systemsRes, sectorsRes] = await Promise.all([
        supabase.from('systems').select(`
          *,
          sectors (name)
        `).order('discovery_date', { ascending: false }),
        supabase.from('sectors').select('*').order('name')
      ])

      if (systemsRes.error) throw systemsRes.error
      if (sectorsRes.error) throw sectorsRes.error

      setSystems(systemsRes.data || [])
      setSectors(sectorsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingSystem) {
        const { error } = await supabase
          .from('systems')
          .update(formData)
          .eq('id', editingSystem.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('systems')
          .insert([formData])
        
        if (error) throw error
      }

      setFormData({
        sector_id: '',
        name: '',
        star_class: '',
        discovery_date: new Date().toISOString().split('T')[0],
        notes: '',
        image_url: ''
      })
      setEditingSystem(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving system:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce système ?')) return

    try {
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting system:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleEdit(system) {
    setEditingSystem(system)
    setFormData({
      sector_id: system.sector_id,
      name: system.name,
      star_class: system.star_class || '',
      conflict_level: system.conflict_level || '',
      economy: system.economy || '',
      planet_count: system.planet_count || 0,
      system_type: system.system_type || '',
      dominant_race: system.dominant_race || '',
      interesting_buy: system.interesting_buy || '',
      interesting_sell: system.interesting_sell || '',
      discovery_date: system.discovery_date,
      notes: system.notes || '',
      image_url: system.image_url || '',
      images: system.images || []
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingSystem(null)
    setFormData({
      sector_id: '',
      name: '',
      star_class: '',
      conflict_level: '',
      economy: '',
      planet_count: 0,
      system_type: '',
      dominant_race: '',
      interesting_buy: '',
      interesting_sell: '',
      discovery_date: new Date().toISOString().split('T')[0],
      notes: '',
      image_url: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des systèmes...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Systèmes</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nouveau Système
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingSystem ? 'Modifier le système' : 'Nouveau système'}</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Secteur *</label>
              <select
                className="form-select"
                value={formData.sector_id}
                onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un secteur</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
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
              <label className="form-label">Classe d'étoile</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: M8pf, G2V, K5"
                value={formData.star_class}
                onChange={(e) => setFormData({ ...formData, star_class: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de planètes</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.planet_count}
                onChange={(e) => setFormData({ ...formData, planet_count: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Typologie du système</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Système binaire, Système à anneaux"
                value={formData.system_type}
                onChange={(e) => setFormData({ ...formData, system_type: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Niveau de conflit</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Introuvable, Paisible, Moyen, Élevé..."
                value={formData.conflict_level}
                onChange={(e) => setFormData({ ...formData, conflict_level: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Économie</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Avancée, Exploitation, Commerce"
                value={formData.economy}
                onChange={(e) => setFormData({ ...formData, economy: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Race dominante</label>
              <select
                className="form-select"
                value={formData.dominant_race}
                onChange={(e) => setFormData({ ...formData, dominant_race: e.target.value })}
              >
                <option value="">Sélectionner</option>
                <option value="Gek">Gek</option>
                <option value="Korvax">Korvax</option>
                <option value="Vy'keen">Vy'keen</option>
                <option value="Inconnu">Inconnu</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Achat intéressant</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Chromatic Metal, Fusion Ignitor"
                value={formData.interesting_buy}
                onChange={(e) => setFormData({ ...formData, interesting_buy: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vente intéressante</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Circuit boards, Living Glass"
                value={formData.interesting_sell}
                onChange={(e) => setFormData({ ...formData, interesting_sell: e.target.value })}
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
              label="Images du système"
            />

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Thématique, caractéristiques..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingSystem ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {systems.length === 0 ? (
        <div className="empty-state">
          <Database size={64} />
          <p>Aucun système enregistré</p>
          <p>Commence par créer ton premier système !</p>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {systems.map((system) => {
            const images = system.images || []
            const mainImage = images[0] || system.image_url
            
            return (
            <div key={system.id} className="card">
              {mainImage && (
                <img 
                  src={mainImage} 
                  alt={system.name}
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
                <Link to={`/systems/${system.id}`} className="card-title">
                  {system.name}
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(system)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(system.id)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                {system.sectors && (
                  <p><strong>Secteur :</strong> {system.sectors.name}</p>
                )}
                {system.star_class && (
                  <p><strong>Classe d'étoile :</strong> {system.star_class}</p>
                )}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {system.planet_count > 0 && (
                    <span style={{ whiteSpace: 'nowrap' }}><strong>Planètes :</strong> {system.planet_count}</span>
                  )}
                  {system.system_type && (
                    <span style={{ whiteSpace: 'nowrap' }}><strong>Type :</strong> {system.system_type}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {system.economy && (
                    <span style={{ whiteSpace: 'nowrap' }}><strong>Économie :</strong> {system.economy}</span>
                  )}
                  {system.conflict_level && (
                    <span style={{ whiteSpace: 'nowrap' }}><strong>Conflit :</strong> {system.conflict_level}</span>
                  )}
                  {system.dominant_race && (
                    <span style={{ whiteSpace: 'nowrap' }}><strong>Race :</strong> {system.dominant_race}</span>
                  )}
                </div>
                {(system.interesting_buy || system.interesting_sell) && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    {system.interesting_buy && (
                      <p style={{ whiteSpace: 'nowrap', overflow: 'visible' }}><strong>📥 Achat :</strong> {system.interesting_buy}</p>
                    )}
                    {system.interesting_sell && (
                      <p style={{ whiteSpace: 'nowrap', overflow: 'visible' }}><strong>📤 Vente :</strong> {system.interesting_sell}</p>
                    )}
                  </div>
                )}
                {system.discovery_date && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <strong>Découvert le :</strong> {new Date(system.discovery_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {system.notes && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{system.notes}</p>
                )}
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}

export default Systems
