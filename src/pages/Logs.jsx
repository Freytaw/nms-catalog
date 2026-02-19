import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { AlertTriangle, AlertCircle, RefreshCw, Calendar, Filter } from 'lucide-react'

function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState('all') // 'all', 'warning', 'error'
  const [filterContext, setFilterContext] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      let query = supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      const { data, error } = await query

      if (error) throw error

      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false
    if (filterContext !== 'all' && log.context !== filterContext) return false
    return true
  })

  const uniqueContexts = [...new Set(logs.map(log => log.context))]

  function getLevelIcon(level) {
    return level === 'error' ? 
      <AlertCircle size={18} style={{ color: 'var(--nms-danger)' }} /> : 
      <AlertTriangle size={18} style={{ color: 'var(--nms-warning)' }} />
  }

  function getLevelColor(level) {
    return level === 'error' ? 'var(--nms-danger)' : 'var(--nms-warning)'
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>📊 Logs d'application</h1>
          <p className="subtitle">Historique des warnings et erreurs</p>
        </div>
        <button className="btn btn-primary" onClick={fetchLogs}>
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} />
            <span style={{ fontWeight: 'bold' }}>Filtres:</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.875rem' }}>Niveau:</label>
            <select 
              className="form-input" 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <option value="all">Tous</option>
              <option value="warning">⚠️ Warning</option>
              <option value="error">🔥 Error</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.875rem' }}>Contexte:</label>
            <select 
              className="form-input" 
              value={filterContext}
              onChange={(e) => setFilterContext(e.target.value)}
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <option value="all">Tous</option>
              {uniqueContexts.map(ctx => (
                <option key={ctx} value={ctx}>{ctx}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--nms-gray)' }}>
            {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <RefreshCw size={48} className="spin" />
          <p>Chargement des logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={64} />
          <p>Aucun log trouvé</p>
          <p>Les warnings et errors apparaîtront ici automatiquement</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="card"
              style={{ 
                borderLeft: `4px solid ${getLevelColor(log.level)}`,
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getLevelIcon(log.level)}
                  <span style={{ 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: getLevelColor(log.level)
                  }}>
                    {log.level}
                  </span>
                  <span style={{ 
                    background: 'var(--nms-bg)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {log.context}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--nms-gray)'
                }}>
                  <Calendar size={14} />
                  {new Date(log.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>

              <div style={{ 
                fontSize: '0.875rem',
                marginBottom: log.data || log.url ? '0.75rem' : 0
              }}>
                {log.message}
              </div>

              {log.url && (
                <div style={{ 
                  fontSize: '0.75rem',
                  color: 'var(--nms-gray)',
                  marginBottom: log.data ? '0.5rem' : 0
                }}>
                  📍 {log.url}
                </div>
              )}

              {log.data && (
                <details style={{
                  background: 'var(--nms-bg)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem'
                }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    Détails techniques
                  </summary>
                  <pre style={{ 
                    margin: 0,
                    overflow: 'auto',
                    color: 'var(--nms-gray)'
                  }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Logs
