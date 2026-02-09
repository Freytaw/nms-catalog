import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ArrowLeft, Database, Globe } from 'lucide-react'

export function SectorDetail() {
  const { id } = useParams()
  const [sector, setSector] = useState(null)
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSectorAndSystems()
  }, [id])

  async function fetchSectorAndSystems() {
    try {
      const [sectorRes, systemsRes] = await Promise.all([
        supabase.from('sectors').select('*').eq('id', id).single(),
        supabase.from('systems').select('*').eq('sector_id', id).order('name')
      ])

      if (sectorRes.error) throw sectorRes.error
      if (systemsRes.error) throw systemsRes.error

      setSector(sectorRes.data)
      setSystems(systemsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement...</div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="container">
        <p>Secteur non trouvé</p>
        <Link to="/sectors" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Retour aux secteurs
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to="/sectors" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Retour aux secteurs
      </Link>

      <div className="card" style={{ marginBottom: '2rem' }}>
        {sector.image_url && (
          <img 
            src={sector.image_url} 
            alt={sector.name}
            style={{ 
              width: '100%', 
              height: '300px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem'
            }}
          />
        )}
        <h1>{sector.name}</h1>
        <div className="card-content">
          {sector.galaxy && (
            <p><strong>Galaxie :</strong> {sector.galaxy}</p>
          )}
          {sector.discovery_date && (
            <p><strong>Découvert le :</strong> {new Date(sector.discovery_date).toLocaleDateString('fr-FR')}</p>
          )}
          {sector.notes && (
            <p style={{ marginTop: '1rem' }}>{sector.notes}</p>
          )}
        </div>
      </div>

      <h2>Systèmes de ce secteur ({systems.length})</h2>
      {systems.length === 0 ? (
        <div className="empty-state">
          <Database size={64} />
          <p>Aucun système dans ce secteur</p>
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
                      height: '150px', 
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
                </div>
                <div className="card-content">
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
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SystemDetail() {
  const { id } = useParams()
  const [system, setSystem] = useState(null)
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemAndPlanets()
  }, [id])

  async function fetchSystemAndPlanets() {
    try {
      const [systemRes, planetsRes] = await Promise.all([
        supabase.from('systems').select(`
          *,
          sectors (name)
        `).eq('id', id).single(),
        supabase.from('planets').select('*').eq('system_id', id).order('name')
      ])

      if (systemRes.error) throw systemRes.error
      if (planetsRes.error) throw planetsRes.error

      setSystem(systemRes.data)
      setPlanets(planetsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement...</div>
      </div>
    )
  }

  if (!system) {
    return (
      <div className="container">
        <p>Système non trouvé</p>
        <Link to="/systems" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Retour aux systèmes
        </Link>
      </div>
    )
  }

  // Parse images from JSONB if available
  const images = system.images || []
  const mainImage = images[0] || system.image_url

  return (
    <div className="container">
      <Link to="/systems" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Retour aux systèmes
      </Link>

      <div className="card" style={{ marginBottom: '2rem' }}>
        {mainImage && (
          <img 
            src={mainImage} 
            alt={system.name}
            style={{ 
              width: '100%', 
              height: '300px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem'
            }}
          />
        )}
        
        {images.length > 1 && (
          <div className="image-grid" style={{ marginBottom: '1rem' }}>
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt={`${system.name} ${idx + 2}`} />
              </div>
            ))}
          </div>
        )}

        <h1>{system.name}</h1>
        <div className="card-content">
          {system.sectors && (
            <p><strong>Secteur :</strong> {system.sectors.name}</p>
          )}
          {system.star_class && (
            <p><strong>Classe d'étoile :</strong> {system.star_class}</p>
          )}
          {system.coordinates && (
            <p style={{ whiteSpace: 'nowrap', overflow: 'visible' }}>
              <strong>Coordonnées :</strong> {system.coordinates}
            </p>
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
            <div style={{ marginTop: '0.5rem' }}>
              {system.interesting_buy && (
                <p><strong>📥 Achat :</strong> {system.interesting_buy}</p>
              )}
              {system.interesting_sell && (
                <p><strong>📤 Vente :</strong> {system.interesting_sell}</p>
              )}
            </div>
          )}
          {system.discovery_date && (
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Découvert le :</strong> {new Date(system.discovery_date).toLocaleDateString('fr-FR')}
            </p>
          )}
          {system.notes && (
            <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{system.notes}</p>
          )}
        </div>
      </div>

      <h2>Planètes de ce système ({planets.length})</h2>
      {planets.length === 0 ? (
        <div className="empty-state">
          <Globe size={64} />
          <p>Aucune planète dans ce système</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {planets.map((planet) => (
            <div key={planet.id} className="card">
              <div className="card-header">
                <Link to={`/planets/${planet.id}`} className="card-title">
                  {planet.name}
                </Link>
              </div>
              <div className="card-content">
                {planet.type && (
                  <p><strong>Type :</strong> {planet.type}</p>
                )}
                {planet.climate && (
                  <p><strong>Climat :</strong> {planet.climate}</p>
                )}
                <p><strong>Faune :</strong> {planet.fauna_count} espèce(s)</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function PlanetDetail() {
  const { id } = useParams()
  const [planet, setPlanet] = useState(null)
  const [creatures, setCreatures] = useState([])
  const [bases, setBases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlanetData()
  }, [id])

  async function fetchPlanetData() {
    try {
      const [planetRes, creaturesRes, basesRes] = await Promise.all([
        supabase.from('planets').select(`
          *,
          systems (name, sectors(name))
        `).eq('id', id).single(),
        supabase.from('creatures').select('*').eq('planet_id', id).order('name'),
        supabase.from('bases').select('*').eq('planet_id', id).order('name')
      ])

      if (planetRes.error) throw planetRes.error
      if (creaturesRes.error) throw creaturesRes.error
      if (basesRes.error) throw basesRes.error

      setPlanet(planetRes.data)
      setCreatures(creaturesRes.data || [])
      setBases(basesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement...</div>
      </div>
    )
  }

  if (!planet) {
    return (
      <div className="container">
        <p>Planète non trouvée</p>
        <Link to="/planets" className="btn btn-secondary">
          <ArrowLeft size={20} />
          Retour aux planètes
        </Link>
      </div>
    )
  }

  const images = planet.images || []
  const mainImage = images[0]

  return (
    <div className="container">
      <Link to="/planets" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Retour aux planètes
      </Link>

      <div className="card" style={{ marginBottom: '2rem' }}>
        {mainImage && (
          <img 
            src={mainImage} 
            alt={planet.name}
            style={{ 
              width: '100%', 
              height: '300px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem'
            }}
          />
        )}
        
        {images.length > 1 && (
          <div className="image-grid" style={{ marginBottom: '1rem' }}>
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt={`${planet.name} ${idx + 2}`} />
              </div>
            ))}
          </div>
        )}

        <h1>{planet.name}</h1>
        <div className="card-content">
          {planet.systems && (
            <p><strong>Système :</strong> {planet.systems.name} 
              {planet.systems.sectors && ` (${planet.systems.sectors.name})`}
            </p>
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
          {planet.resources && (
            <p><strong>Ressources :</strong> {planet.resources}</p>
          )}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <span><strong>Faune :</strong> {planet.fauna_count} espèce(s)</span>
            <span><strong>Flore :</strong> {planet.flora_count} espèce(s)</span>
          </div>
          {planet.notes && (
            <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{planet.notes}</p>
          )}
        </div>
      </div>

      <h2>Créatures ({creatures.length})</h2>
      {creatures.length === 0 ? (
        <div className="empty-state" style={{ marginBottom: '2rem' }}>
          <p>Aucune créature découverte</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          {creatures.map((creature) => (
            <div key={creature.id} className="card">
              <div className="card-header">
                <Link to={`/creatures/${creature.id}`} className="card-title">
                  {creature.name}
                </Link>
              </div>
              <div className="card-content">
                {creature.original_name && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--nms-gray)' }}>
                    ({creature.original_name})
                  </p>
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
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Bases ({bases.length})</h2>
      {bases.length === 0 ? (
        <div className="empty-state">
          <p>Aucune base construite</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {bases.map((base) => (
            <div key={base.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{base.name}</h3>
              </div>
              <div className="card-content">
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
          ))}
        </div>
      )}
    </div>
  )
}

export function CreatureDetail() {
  const { id } = useParams()
  return (
    <div className="container">
      <Link to="/creatures" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} />
        Retour aux créatures
      </Link>
      <h1>Détails de la Créature #{id}</h1>
      <p>Page en construction - Affichera galerie photos et informations complètes</p>
    </div>
  )
}
