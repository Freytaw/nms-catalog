import { ChevronLeft, ChevronRight } from 'lucide-react'

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      padding: '1rem',
      background: 'var(--nms-bg-secondary)',
      borderRadius: 'var(--radius-md)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Items count */}
      <div style={{ fontSize: '0.875rem', color: 'var(--nms-gray)' }}>
        Affichage de <strong>{startItem}</strong> à <strong>{endItem}</strong> sur <strong>{totalItems}</strong> résultats
      </div>

      {/* Center controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Items per page selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem' }}>Par page:</label>
          <select
            className="form-input"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            style={{ width: 'auto', minWidth: '80px' }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        {/* Page navigation */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ padding: '0.5rem' }}
            >
              <ChevronLeft size={18} />
            </button>

            <span style={{ fontSize: '0.875rem', padding: '0 0.5rem' }}>
              Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-secondary"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ padding: '0.5rem' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pagination
