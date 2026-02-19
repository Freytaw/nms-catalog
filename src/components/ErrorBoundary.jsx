import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logger } from '../utils/logger'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error with logger (will save to Supabase)
    logger.error('React Error Boundary caught error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorName: error.name,
      errorMessage: error.message
    })
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--nms-bg)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '600px',
            background: 'var(--nms-bg-secondary)',
            border: '2px solid var(--nms-danger)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <AlertTriangle 
              size={64} 
              style={{ 
                color: 'var(--nms-danger)', 
                marginBottom: '1rem' 
              }} 
            />
            
            <h1 style={{ 
              color: 'var(--nms-danger)', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Une erreur est survenue
            </h1>
            
            <p style={{ 
              color: 'var(--nms-text)', 
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              L'application a rencontré une erreur inattendue. 
              L'erreur a été enregistrée automatiquement.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid var(--nms-danger)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: 'var(--nms-danger)'
                }}>
                  Détails de l'erreur (dev)
                </summary>
                <pre style={{ 
                  overflow: 'auto',
                  color: 'var(--nms-text)',
                  fontSize: '0.75rem',
                  margin: 0
                }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button 
              className="btn btn-primary"
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={18} />
              Recharger l'application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
