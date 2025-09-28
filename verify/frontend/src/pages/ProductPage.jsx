import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

export default function ProductPage(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProductData()
  }, [id])

  const loadProductData = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      setData(res.data)
    } catch(err) { 
      console.error('Erreur chargement produit:', err) 
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await loadProductData()
  }

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="text-muted">Chargement des données du produit...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body text-center py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h3 className="text-muted">Produit non trouvé</h3>
                <p className="text-muted">Le produit demandé n'existe pas ou n'est pas accessible.</p>
                <button className="btn btn-primary" onClick={() => window.history.back()}>
                  <i className="fas fa-arrow-left me-2"></i>
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête du produit */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none">
                      <i className="fas fa-home me-1"></i>
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {data.product.name}
                  </li>
                </ol>
              </nav>
              <h1 className="h2 fw-bold text-dark mb-2">{data.product.name}</h1>
              <p className="text-muted mb-0">{data.product.description || 'Aucune description disponible'}</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" onClick={refreshData}>
                <i className="fas fa-sync-alt me-2"></i>
                Actualiser
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-print me-2"></i>
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Informations du produit */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow h-100">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Informations du Produit
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">SKU</label>
                <div className="fw-semibold">{data.product.sku || 'N/A'}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Catégorie</label>
                <div>
                  <span className={`badge ${
                    data.product.category === 'AGRICULTURE' ? 'bg-success' :
                    data.product.category === 'SANTE' ? 'bg-info' :
                    data.product.category === 'FONCIER' ? 'bg-warning' : 'bg-primary'
                  }`}>
                    {data.product.category}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Propriétaire</label>
                <div className="fw-semibold">{data.product.owner || 'Non spécifié'}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Rôle</label>
                <div>
                  <span className={`badge ${
                    data.product.ownerRole === 'AGRICULTEUR' ? 'bg-success' :
                    data.product.ownerRole === 'MEDECIN' ? 'bg-info' :
                    data.product.ownerRole === 'FONCIER' ? 'bg-warning' : 'bg-primary'
                  }`}>
                    {data.product.ownerRole}
                  </span>
                </div>
              </div>
              
              {data.product.createdAt && (
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">Date de création</label>
                  <div className="fw-semibold">
                    {new Date(data.product.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline des traces */}
        <div className="col-lg-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fas fa-history me-2 text-primary"></i>
                Historique de Traçabilité
              </h5>
              <span className="badge bg-primary">{data.traces.length} événement(s)</span>
            </div>
            <div className="card-body">
              {data.traces.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun événement enregistré</h5>
                  <p className="text-muted">Commencez par ajouter le premier événement de traçabilité</p>
                </div>
              ) : (
                <div className="timeline">
                  {data.traces.map((trace, index) => (
                    <TraceItem key={trace._id} trace={trace} isLast={index === data.traces.length - 1} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulaire d'ajout */}
          <div className="card border-0 shadow mt-4">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0">
                <i className="fas fa-plus-circle me-2 text-success"></i>
                Ajouter un Événement
              </h5>
            </div>
            <div className="card-body">
              <AddTraceForm productId={id} onAdded={trace => setData(prev => ({...prev, traces: [trace, ...prev.traces]}))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant Item de Timeline
const TraceItem = ({ trace, isLast }) => {
  const getTraceIcon = (type) => {
    const icons = {
      production: 'fa-industry',
      transport: 'fa-truck',
      storage: 'fa-warehouse',
      health_check: 'fa-heart-pulse',
      sale: 'fa-shopping-cart',
      inspection: 'fa-clipboard-check',
      default: 'fa-circle'
    }
    return icons[type] || icons.default
  }

  const getTraceColor = (type) => {
    const colors = {
      production: 'text-primary',
      transport: 'text-warning',
      storage: 'text-info',
      health_check: 'text-success',
      sale: 'text-danger',
      inspection: 'text-purple',
      default: 'text-secondary'
    }
    return colors[type] || colors.default
  }

  const getTraceLabel = (type) => {
    const labels = {
      production: 'Production',
      transport: 'Transport',
      storage: 'Stockage',
      health_check: 'Contrôle Santé',
      sale: 'Vente',
      inspection: 'Inspection',
      default: type
    }
    return labels[type] || labels.default
  }

  return (
    <div className="timeline-item d-flex">
      <div className="timeline-marker flex-shrink-0">
        <div className={`timeline-icon ${getTraceColor(trace.type)}`}>
          <i className={`fas ${getTraceIcon(trace.type)}`}></i>
        </div>
        {!isLast && <div className="timeline-line"></div>}
      </div>
      <div className="timeline-content flex-grow-1 ms-4 mb-4">
        <div className="card border-0 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0">{getTraceLabel(trace.type)}</h6>
              <small className="text-muted">
                {new Date(trace.timestamp).toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
            
            <div className="mb-2">
              <small className="text-muted">
                <i className="fas fa-user me-1"></i>
                Par {trace.product || 'Système'}
              </small>
            </div>

            {trace.data && Object.keys(trace.data).length > 0 && (
              <div className="mt-2">
                <div className="bg-white rounded border p-3">
                  <small className="text-muted d-block mb-1">Données supplémentaires:</small>
                  <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {JSON.stringify(trace.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {trace.hederaTxId && (
              <div className="mt-2">
                <small className="text-muted">
                  <i className="fas fa-link me-1"></i>
                  Transaction Hedera: 
                </small>
                <code className="ms-1 small bg-transparent border-0 p-0">
                  {trace.hederaTxId}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Formulaire d'ajout d'événement
function AddTraceForm({ productId, onAdded }){
  const [type, setType] = useState('production')
  const [payload, setPayload] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    if (!payload.trim()) {
      alert('Veuillez saisir un détail pour l\'événement')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/traces', { 
        product: productId, 
        type, 
        data: { note: payload } 
      })
      onAdded(res.data.trace)
      setPayload('')
    } catch(err) { 
      alert('Erreur lors de l\'ajout de l\'événement') 
    } finally {
      setLoading(false)
    }
  }

  const getTypeOptions = () => [
    { value: 'production', label: '🚜 Production', icon: 'fa-industry' },
    { value: 'transport', label: '🚚 Transport', icon: 'fa-truck' },
    { value: 'storage', label: '📦 Stockage', icon: 'fa-warehouse' },
    { value: 'health_check', label: '🏥 Contrôle Santé', icon: 'fa-heart-pulse' },
    { value: 'sale', label: '💰 Vente', icon: 'fa-shopping-cart' },
    { value: 'inspection', label: '🔍 Inspection', icon: 'fa-clipboard-check' }
  ]

  return (
    <form onSubmit={submit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="traceType" className="form-label fw-medium">
            Type d'événement
          </label>
          <select 
            id="traceType"
            className="form-select"
            value={type} 
            onChange={e => setType(e.target.value)}
          >
            {getTypeOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-md-6">
          <label htmlFor="tracePayload" className="form-label fw-medium">
            Détails de l'événement
          </label>
          <input 
            id="tracePayload"
            type="text" 
            className="form-control"
            placeholder="Décrivez l'événement..."
            value={payload} 
            onChange={e => setPayload(e.target.value)}
          />
        </div>
        
        <div className="col-12">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading || !payload.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Ajout en cours...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Ajouter l'événement
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

// Styles CSS pour la timeline
const timelineStyles = `
.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
}

.timeline-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-line {
  width: 2px;
  background: #e9ecef;
  flex-grow: 1;
  margin-top: 8px;
  min-height: 20px;
}

.timeline-content {
  min-height: 80px;
}

.text-purple {
  color: #6f42c1 !important;
}

.card {
  border-radius: 0.75rem;
}

.breadcrumb {
  background: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: #6c757d;
}

.breadcrumb-item.active {
  color: #495057;
}
`

// Ajout des styles dans le document
const styleSheet = document.createElement("style")
styleSheet.innerText = timelineStyles
document.head.appendChild(styleSheet)