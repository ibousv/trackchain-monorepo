import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

export default function ProductPage(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    loadUserData()
    loadProductData()
  }, [id])

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
  }

  const loadProductData = async () => {
    try {
      setError(null)
      const res = await api.get(`/products/${id}`)
      
      if (!res.data) {
        throw new Error('Aucune donnée reçue')
      }
      
      // Vérifier les permissions d'accès
      const hasAccess = checkProductAccess(res.data.product, user)
      if (!hasAccess) {
        throw new Error('Vous n\'avez pas la permission d\'accéder à ce produit')
      }
      
      const validatedData = {
        ...res.data,
        traces: Array.isArray(res.data.traces) ? res.data.traces : []
      }
      
      setData(validatedData)
    } catch(err) { 
      console.error('Erreur chargement produit:', err)
      setError(err.response?.data?.msg || err.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const checkProductAccess = (product, currentUser) => {
    if (!product || !currentUser) return false
    
    const userRole = currentUser.role
    const productCategory = product.category
    
    switch(userRole) {
      case 'AGRICULTEUR':
        return productCategory === 'AGRICULTURE'
      case 'MEDECIN':
        return productCategory === 'SANTE'
      case 'FONCIER':
        return productCategory === 'FONCIER'
      case 'ANAD':
      case 'SUPER_ADMIN':  
        return true // ANAD a accès à tout
      default:
        return false
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await loadProductData()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const getRoleBadge = (role) => {
    const roles = {
      'AGRICULTEUR': { label: 'Agriculteur', class: 'bg-success', icon: 'fa-seedling' },
      'MEDECIN': { label: 'Médecin', class: 'bg-info', icon: 'fa-user-doctor' },
      'FONCIER': { label: 'Foncier', class: 'bg-warning', icon: 'fa-landmark' },
      'ANAD': { label: 'ANAD', class: 'bg-primary', icon: 'fa-file-medical' },
      'SUPER_ADMIN': { label: 'Super Admin', class: 'bg-danger', icon: 'fa-crown' }
    }
    const roleInfo = roles[role] || { label: role, class: 'bg-secondary', icon: 'fa-user' }
    return (
      <span className={`badge ${roleInfo.class}`}>
        <i className={`fas ${roleInfo.icon} me-1`}></i>
        {roleInfo.label}
      </span>
    )
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'AGRICULTURE': { icon: 'fa-seedling', color: 'text-success' },
      'SANTE': { icon: 'fa-heart-pulse', color: 'text-info' },
      'FONCIER': { icon: 'fa-landmark', color: 'text-warning' },
      'ANAD': { icon: 'fa-file-medical', color: 'text-primary' },
      'SUPER_ADMIN': { icon: 'fa-crown', color: 'text-green' }
    }
    return icons[category] || { icon: 'fa-cube', color: 'text-secondary' }
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

  if (error || !data) {
    return (
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body text-center py-5">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h3 className="text-muted">Erreur de chargement</h3>
                <p className="text-muted">{error || 'Le produit demandé n\'existe pas ou n\'est pas accessible.'}</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-primary" onClick={() => window.history.back()}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Retour au Dashboard
                  </button>
                  <button className="btn btn-outline-primary" onClick={refreshData}>
                    <i className="fas fa-sync-alt me-2"></i>
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Validation des données avant rendu
  const product = data.product || {}
  const traces = data.traces || []
  const categoryInfo = getCategoryIcon(product.category)

  return (
    <div className="container-fluid py-4">
      {/* En-tête avec barre utilisateur */}
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
                    {product.name || 'Produit sans nom'}
                  </li>
                </ol>
              </nav>
              <div className="d-flex align-items-center gap-3">
                <h1 className="h2 fw-bold text-dark mb-0">
                  <i className={`fas ${categoryInfo.icon} me-2 ${categoryInfo.color}`}></i>
                  {product.name || 'Produit sans nom'}
                </h1>
                <span className={`badge ${
                  product.category === 'AGRICULTURE' ? 'bg-success' :
                  product.category === 'SANTE' ? 'bg-info' :
                  product.category === 'FONCIER' ? 'bg-warning' : 'bg-primary'
                }`}>
                  {product.category}
                </span>
              </div>
              <p className="text-muted mb-0 mt-2">{product.description || 'Aucune description disponible'}</p>
            </div>
            
            {/* Barre utilisateur */}
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-semibold text-dark">{user?.name || 'Utilisateur'}</div>
                <div className="small text-muted">
                  {getRoleBadge(user?.role)}
                </div>
              </div>
              
              <div className="dropdown">
                <button 
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  Mon compte
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => setShowProfileModal(true)}
                    >
                      <i className="fas fa-user-edit me-2"></i>
                      Modifier mon profil
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Déconnexion
                    </button>
                  </li>
                </ul>
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
                <label className="form-label text-muted small mb-1">
                  <i className="fas fa-barcode me-1"></i>
                  SKU
                </label>
                <div className="fw-semibold">{product.sku || 'N/A'}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  <i className={`fas ${categoryInfo.icon} me-1 ${categoryInfo.color}`}></i>
                  Catégorie
                </label>
                <div>
                  <span className={`badge ${
                    product.category === 'AGRICULTURE' ? 'bg-success' :
                    product.category === 'SANTE' ? 'bg-info' :
                    product.category === 'FONCIER' ? 'bg-warning' : 'bg-primary'
                  }`}>
                    {product.category || 'Non catégorisé'}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  <i className="fas fa-user me-1"></i>
                  Propriétaire
                </label>
                <div className="fw-semibold">
                  {product.owner?.name || 'Non spécifié'}
                  {product.owner?.email && (
                    <div className="small text-muted">{product.owner.email}</div>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  <i className="fas fa-briefcase me-1"></i>
                  Rôle du propriétaire
                </label>
                <div>
                  {getRoleBadge(product.ownerRole)}
                </div>
              </div>
              
              {product.createdAt && (
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    <i className="fas fa-calendar me-1"></i>
                    Date de création
                  </label>
                  <div className="fw-semibold">
                    {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}

              {product.updatedAt && product.updatedAt !== product.createdAt && (
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">
                    <i className="fas fa-edit me-1"></i>
                    Dernière modification
                  </label>
                  <div className="fw-semibold">
                    {new Date(product.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
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
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary">{traces.length} événement(s)</span>
                {user?.role === 'ANAD' && (
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-download me-1"></i>
                    Exporter
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {traces.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun événement enregistré</h5>
                  <p className="text-muted">Commencez par ajouter le premier événement de traçabilité</p>
                </div>
              ) : (
                <div className="timeline">
                  {traces.map((trace, index) => (
                    <TraceItem 
                      key={generateTraceKey(trace, index)} 
                      trace={trace} 
                      isLast={index === traces.length - 1} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulaire d'ajout - seulement si l'utilisateur a les permissions */}
          {(user?.role === 'ANAD' || 
            (user?.role === product.ownerRole) || 
            (user?.role === 'MEDECIN' && product.category === 'SANTE') ||
            (user?.role === 'FONCIER' && product.category === 'FONCIER')) && (
            <div className="card border-0 shadow mt-4">
              <div className="card-header bg-white py-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-plus-circle me-2 text-success"></i>
                  Ajouter un Événement
                </h5>
              </div>
              <div className="card-body">
                <AddTraceForm 
                  productId={id} 
                  onAdded={trace => setData(prev => ({
                    ...prev, 
                    traces: [trace, ...(prev?.traces || [])]
                  }))} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de profil */}
      {showProfileModal && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={(updatedUser) => {
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }}
        />
      )}
    </div>
  )
}

// Fonction pour générer des clés uniques et sécurisées
function generateTraceKey(trace, index) {
  if (trace && trace._id) {
    return `trace-${trace._id}`
  }
  if (trace && trace.timestamp) {
    return `trace-${trace.timestamp}-${index}`
  }
  return `trace-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
}

// Composant Item de Timeline avec validation
const TraceItem = ({ trace, isLast }) => {
  if (!trace || typeof trace !== 'object') {
    return null
  }

  const getTraceIcon = (type) => {
    const icons = {
      production: 'fa-industry',
      transport: 'fa-truck',
      storage: 'fa-warehouse',
      health_check: 'fa-heart-pulse',
      sale: 'fa-shopping-cart',
      inspection: 'fa-clipboard-check',
      creation: 'fa-plus-circle',
      update: 'fa-edit',
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
      creation: 'text-success',
      update: 'text-warning',
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
      creation: 'Création',
      update: 'Modification',
      default: type || 'Événement'
    }
    return labels[type] || labels.default
  }

  const safeTimestamp = trace.timestamp || new Date().toISOString()
  const safeType = trace.type || 'default'
  const safeActor = trace.actor?.name || 'Système'
  const safeData = trace.data || {}
  const safeHederaTxId = trace.hederaTxId

  return (
    <div className="timeline-item d-flex">
      <div className="timeline-marker flex-shrink-0">
        <div className={`timeline-icon ${getTraceColor(safeType)}`}>
          <i className={`fas ${getTraceIcon(safeType)}`}></i>
        </div>
        {!isLast && <div className="timeline-line"></div>}
      </div>
      <div className="timeline-content flex-grow-1 ms-4 mb-4">
        <div className="card border-0 bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold mb-0">{getTraceLabel(safeType)}</h6>
              <small className="text-muted">
                {new Date(safeTimestamp).toLocaleString('fr-FR', {
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
                Par {safeActor}
                {trace.actor?.role && (
                  <span className="ms-1">
                    ({trace.actor.role})
                  </span>
                )}
              </small>
            </div>

            {Object.keys(safeData).length > 0 && (
              <div className="mt-2">
                <div className="bg-white rounded border p-3">
                  <small className="text-muted d-block mb-1">Données supplémentaires:</small>
                  <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {JSON.stringify(safeData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {safeHederaTxId && (
              <div className="mt-2">
                <small className="text-muted">
                  <i className="fas fa-link me-1"></i>
                  Transaction Hedera: 
                </small>
                <code className="ms-1 small bg-transparent border-0 p-0">
                  {safeHederaTxId}
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
      
      if (res.data && res.data.trace) {
        onAdded(res.data.trace)
        setPayload('')
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch(err) { 
      console.error('Erreur ajout trace:', err)
      alert('Erreur lors de l\'ajout de l\'événement: ' + (err.response?.data?.msg || err.message)) 
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

// Modal de profil utilisateur (identique au dashboard)
const ProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Simulation de mise à jour
      setTimeout(() => {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email
        }
        onUpdate(updatedUser)
        setMessage('Profil mis à jour avec succès!')
        setLoading(false)
      }, 1000)
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-user-edit me-2"></i>
              Modifier mon profil
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {message && (
                <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.role || ''}
                  disabled
                />
                <div className="form-text">Le rôle ne peut pas être modifié</div>
              </div>

              <hr />
              
              <h6 className="mb-3">Changer le mot de passe</h6>
              
              <div className="mb-3">
                <label className="form-label">Mot de passe actuel</label>
                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Mise à jour...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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