import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

function Creatures() {
  const [creatures, setCreatures] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCreature, setEditingCreature] = useState(null)
  const [formData, setFormData] = useState({
    planet_id: '',
    name: '',
    original_name: '',
    genus: '',
    height: '',
    weight: '',
    behavior: '',
    diet: '',
    special_abilities: '',
    notes: '',
    images: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [creaturesRes, planetsRes] = await Promise.all([
        supabase.from('creatures').select(`
          *,
          planets (name, systems(name))
        `).order('name'),
        supabase.from('planets').select('*').order('name')
      ])

      if (creaturesRes.error) throw creaturesRes.error
      if (planetsRes.error) throw planetsRes.error

      setCreatures(creaturesRes.data || [])
      setPlanets(planetsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingCreature) {
        const { error } = await supabase
          .from('creatures')
          .update(formData)
          .eq('id', editingCreature.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('creatures')
          .insert([formData])
        
        if (error) throw error
      }

      setFormData({
        planet_id: '',
        name: '',
        original_name: '',
        genus: '',
        height: '',
        weight: '',
        behavior: '',
        diet: '',
        special_abilities: '',
        notes: '',
        images: []
      })
      setEditingCreature(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error saving creature:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette créature ?')) return

    try {
      const { error } = await supabase
        .from('creatures')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting creature:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  function handleEdit(creature) {
    setEditingCreature(creature)
    setFormData({
      planet_id: creature.planet_id,
      name: creature.name,
      original_name: creature.original_name || '',
      genus: creature.genus || '',
      height: creature.height || '',
      weight: creature.weight || '',
      behavior: creature.behavior || '',
      diet: creature.diet || '',
      special_abilities: creature.special_abilities || '',
      notes: creature.notes || '',
      images: creature.images || []
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingCreature(null)
    setFormData({
      planet_id: '',
      name: '',
      original_name: '',
      genus: '',
      height: '',
      weight: '',
      behavior: '',
      diet: '',
      special_abilities: '',
      notes: '',
      images: []
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des créatures...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Créatures</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Nouvelle Créature
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3>{editingCreature ? 'Modifier la créature' : 'Nouvelle créature'}</h3>
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
                placeholder="Ex: Mochi, Yukitaka, Chromacrabe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nom d'origine (jeu)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: B. Scoopieusllea"
                value={formData.original_name}
                onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Symétrique, Asymptotique, Alpha"
                value={formData.genus}
                onChange={(e) => setFormData({ ...formData, genus: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Taille</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: 2.4m, 0.8m"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Poids</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: 130.5kg"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Comportement</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Paisible, Nerveux, Agressif"
                value={formData.behavior}
                onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Régime alimentaire</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Herbivore, Charognard"
                value={formData.diet}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capacités spéciales</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Change de couleur, Écholocalisation"
                value={formData.special_abilities}
                onChange={(e) => setFormData({ ...formData, special_abilities: e.target.value })}
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
              label="Images de la créature"
            />

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observations, particularités..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingCreature ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {creatures.length === 0 ? (
        <div className="empty-state">
          <Users size={64} />
          <p>Aucune créature enregistrée</p>
          <p>Commence par créer ta première créature !</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {creatures.map((creature) => (
            <div key={creature.id} className="card">
              <div className="card-header">
                <Link to={`/creatures/${creature.id}`} className="card-title">
                  {creature.name}
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(creature)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(creature.id)}
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-content">
                {creature.original_name && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--nms-gray)' }}>
                    ({creature.original_name})
                  </p>
                )}
                {creature.planets && (
                  <p><strong>Planète :</strong> {creature.planets.name}</p>
                )}
                {creature.genus && (
                  <p><strong>Genre :</strong> {creature.genus}</p>
                )}
                {creature.height && creature.weight && (
                  <p><strong>Taille/Poids :</strong> {creature.height} / {creature.weight}</p>
                )}
                {creature.special_abilities && (
                  <p><strong>Capacités :</strong> {creature.special_abilities}</p>
                )}
                {creature.notes && (
                  <p style={{ marginTop: '0.5rem', color: 'var(--nms-gray)' }}>{creature.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Creatures
