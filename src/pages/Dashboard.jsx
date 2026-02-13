import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Map, Database, Globe, Users, Building, MapPin } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    sectors: 0,
    systems: 0,
    planets: 0,
    creatures: 0,
    bases: 0,
    pointsOfInterest: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [
        { count: sectorsCount },
        { count: systemsCount },
        { count: planetsCount },
        { count: creaturesCount },
        { count: basesCount },
        { count: poisCount }
      ] = await Promise.all([
        supabase.from('sectors').select('*', { count: 'exact', head: true }),
        supabase.from('systems').select('*', { count: 'exact', head: true }),
        supabase.from('planets').select('*', { count: 'exact', head: true }),
        supabase.from('creatures').select('*', { count: 'exact', head: true }),
        supabase.from('bases').select('*', { count: 'exact', head: true }),
        supabase.from('points_of_interest').select('*', { count: 'exact', head: true })
      ])

      setStats({
        sectors: sectorsCount || 0,
        systems: systemsCount || 0,
        planets: planetsCount || 0,
        creatures: creaturesCount || 0,
        bases: basesCount || 0,
        pointsOfInterest: poisCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement des statistiques...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Catalogue des Découvertes</h1>
      
      <div className="stats-grid">
        <Link to="/sectors" className="stat-card">
          <Map size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.sectors}</div>
          <div className="stat-label">Secteurs</div>
        </Link>

        <Link to="/systems" className="stat-card">
          <Database size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.systems}</div>
          <div className="stat-label">Systèmes</div>
        </Link>

        <Link to="/planets" className="stat-card">
          <Globe size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.planets}</div>
          <div className="stat-label">Planètes</div>
        </Link>

        <Link to="/creatures" className="stat-card">
          <Users size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.creatures}</div>
          <div className="stat-label">Créatures</div>
        </Link>

        <Link to="/bases" className="stat-card">
          <Building size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.bases}</div>
          <div className="stat-label">Bases</div>
        </Link>

        <Link to="/points-of-interest" className="stat-card">
          <MapPin size={32} style={{ margin: '0 auto 1rem', color: 'var(--nms-primary)' }} />
          <div className="stat-value">{stats.pointsOfInterest}</div>
          <div className="stat-label">Points d'Intérêt</div>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Bienvenue dans ton catalogue No Man's Sky</h2>
        <div className="card-content">
          <p style={{ marginBottom: '1rem' }}>
            Cette application te permet de cataloguer toutes tes découvertes dans No Man's Sky :
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Secteurs</strong> : Régions de l'espace regroupant plusieurs systèmes</li>
            <li><strong>Systèmes</strong> : Systèmes stellaires avec leurs étoiles et caractéristiques</li>
            <li><strong>Planètes</strong> : Mondes avec leur climat, ressources et faune</li>
            <li><strong>Créatures</strong> : Faune découverte avec leurs particularités</li>
            <li><strong>Bases</strong> : Tes avant-postes et refuges construits</li>
            <li><strong>Points d'Intérêt</strong> : Ruines, monuments et sites remarquables</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            Commence par créer un secteur, puis ajoute-y des systèmes !
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
