import { Filter, X } from 'lucide-react'

/**
 * FilterBar component - Displays dynamic filters
 * 
 * @param {Array} filters - Array of filter configurations
 *   Each filter object should have:
 *   - type: 'text' | 'select'
 *   - name: string (unique identifier)
 *   - label: string (display label)
 *   - value: current value
 *   - onChange: function to handle value change
 *   - options: array (for select type only) - can be array of strings or objects with {value, label}
 *   - placeholder: string (optional, for text inputs)
 * 
 * @param {Function} onReset - Function to reset all filters
 * @param {Number} resultCount - Number of results after filtering
 */
function FilterBar({ filters, onReset, resultCount }) {
  const hasActiveFilters = filters.some(f => f.value && f.value !== 'all')

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} />
          <span style={{ fontWeight: 'bold' }}>Filtres</span>
          {resultCount !== undefined && (
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--nms-gray)',
              marginLeft: '0.5rem'
            }}>
              ({resultCount} résultat{resultCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button 
            className="btn btn-secondary"
            onClick={onReset}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <X size={16} />
            Réinitialiser
          </button>
        )}
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {filters.map((filter) => (
          <div key={filter.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {filter.label}
            </label>
            
            {filter.type === 'text' ? (
              <input
                type="text"
                className="form-input"
                placeholder={filter.placeholder || `Filtrer par ${filter.label.toLowerCase()}...`}
                value={filter.value || ''}
                onChange={(e) => filter.onChange(e.target.value)}
              />
            ) : filter.type === 'select' ? (
              <select
                className="form-input"
                value={filter.value || 'all'}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                <option value="all">Tous</option>
                {filter.options?.map((option) => {
                  const value = typeof option === 'string' ? option : option.value
                  const label = typeof option === 'string' ? option : option.label
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                })}
              </select>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
