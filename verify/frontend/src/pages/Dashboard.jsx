import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function Dashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    agriculture: 0,
    sante: 0,
    foncier: 0,
    anad: 0
  })

  useEffect(() => {
    loadUserData()
    loadProducts()
  }, [])

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    setUser(userData)
  }

  const loadProducts = async () => {
    try {
      const res = await api.get('/products')
      const productsData = Array.isArray(res.data) ? res.data : []
      setProducts(productsData)
      calculateStats(productsData)
    } catch(err) { 
      console.error('Erreur chargement produits:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (productsData) => {
    if (!Array.isArray(productsData)) {
      setStats({ total: 0, agriculture: 0, sante: 0, foncier: 0, anad: 0 })
      return
    }

    const agricultureCount = productsData.filter(p => p.category === 'AGRICULTURE').length
    const santeCount = productsData.filter(p => p.category === 'SANTE').length
    const foncierCount = productsData.filter(p => p.category === 'FONCIER').length
    const anadCount = productsData.filter(p => p.category === 'ANAD').length

    setStats({
      total: productsData.length,
      agriculture: agricultureCount,
      sante: santeCount,
      foncier: foncierCount,
      anad: anadCount
    })
  }

  // Filtrer les produits selon les permissions du rôle
  const filteredProducts = products.filter(product => {
    if (!product || typeof product !== 'object') return false
    
    const matchesSearch = 
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.ownerRole?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === 'all' || product.category === activeTab

    return matchesSearch && matchesTab
  })

  // Grouper les produits par catégorie selon les permissions
  const getVisibleCategories = () => {
    const userRole = user?.role
    const allCategories = {
      agriculture: products.filter(p => p && p.category === 'AGRICULTURE'),
      sante: products.filter(p => p && p.category === 'SANTE'),
      foncier: products.filter(p => p && p.category === 'FONCIER'),
      anad: products.filter(p => p && p.category === 'ANAD')
    }

    // Filtrage selon le rôle
    switch(userRole) {
      case 'AGRICULTEUR':
        return { agriculture: allCategories.agriculture }
      case 'MEDECIN':
        return { sante: allCategories.sante }
      case 'FONCIER':
        return { foncier: allCategories.foncier }
      case 'ANAD':
        return allCategories // ANAD voit tout
      default:
        return allCategories
    }
  }

  const productsByCategory = getVisibleCategories()

  const getCategoryBadge = (category) => {
    const categories = {
      'AGRICULTURE': { label: '🌱 Agriculture', class: 'bg-success', icon: 'fa-seedling' },
      'SANTE': { label: '💊 Santé', class: 'bg-info', icon: 'fa-heart-pulse' },
      'FONCIER': { label: '🏠 Foncier', class: 'bg-warning', icon: 'fa-landmark' },
      'ANAD': { label: '📋 ANAD', class: 'bg-primary', icon: 'fa-file-medical' }
    }
    const categoryInfo = categories[category] || { label: category, class: 'bg-secondary', icon: 'fa-cube' }
    return (
      <span className={`badge ${categoryInfo.class}`}>
        <i className={`fas ${categoryInfo.icon} me-1`}></i>
        {categoryInfo.label}
      </span>
    )
  }

  const getRoleBadge = (role) => {
    const roles = {
      'AGRICULTEUR': { label: 'Agriculteur', class: 'bg-success', icon: 'fa-seedling' },
      'MEDECIN': { label: 'Médecin', class: 'bg-info', icon: 'fa-user-doctor' },
      'FONCIER': { label: 'Foncier', class: 'bg-warning', icon: 'fa-landmark' },
      'ANAD': { label: 'ANAD', class: 'bg-primary', icon: 'fa-file-medical' }
    }
    const roleInfo = roles[role] || { label: role, class: 'bg-secondary', icon: 'fa-user' }
    return (
      <span className={`badge ${roleInfo.class}`}>
        <i className={`fas ${roleInfo.icon} me-1`}></i>
        {roleInfo.label}
      </span>
    )
  }

  const getDashboardTitle = () => {
    const roleTitles = {
      'AGRICULTEUR': 'Tableau de Bord Agriculteur',
      'MEDECIN': 'Tableau de Bord Médical', 
      'FONCIER': 'Tableau de Bord Foncier',
      'ANAD': 'Tableau de Bord Administrateur'
    }
    return roleTitles[user?.role] || 'Tableau de Bord TrackChain'
  }

  const getDashboardDescription = () => {
    const roleDescriptions = {
      'AGRICULTEUR': 'Gestion et traçabilité de vos produits agricoles',
      'MEDECIN': 'Suivi des produits de santé et médicaments',
      'FONCIER': 'Gestion des titres fonciers et documents immobiliers',
      'ANAD': 'Supervision de tous les produits et traçabilité'
    }
    return roleDescriptions[user?.role] || 'Surveillance organisée par domaines et catégories'
  }

  const refreshData = async () => {
    setLoading(true)
    await loadProducts()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête du Dashboard avec infos utilisateur */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">{getDashboardTitle()}</h1>
              <p className="text-muted mb-0">{getDashboardDescription()}</p>
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
                <button className="btn btn-outline-primary" onClick={refreshData} disabled={loading}>
                  <i className="fas fa-sync-alt me-2"></i>
                  {loading ? 'Chargement...' : 'Actualiser'}
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Nouveau Produit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      placeholder="Rechercher un produit, SKU ou propriétaire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                    <span className="text-muted small align-self-center me-2">Filtrer par :</span>
                    <select 
                      className="form-select form-select-sm w-auto"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      <option value="all">Tous les domaines</option>
                      {user?.role === 'AGRICULTEUR' || user?.role === 'ANAD' ? (
                        <option value="AGRICULTURE">🌱 Agriculture</option>
                      ) : null}
                      {user?.role === 'MEDECIN' || user?.role === 'ANAD' ? (
                        <option value="SANTE">💊 Santé</option>
                      ) : null}
                      {user?.role === 'FONCIER' || user?.role === 'ANAD' ? (
                        <option value="FONCIER">🏠 Foncier</option>
                      ) : null}
                      {user?.role === 'ANAD' ? (
                        <option value="ANAD">📋 ANAD</option>
                      ) : null}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="text-muted">Chargement des produits...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {!loading && (
        <>
          {/* Cartes de Statistiques adaptées au rôle */}
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="fw-bold mb-3">
                <i className="fas fa-chart-bar me-2"></i>
                Statistiques {user?.role !== 'ANAD' ? 'de mon domaine' : 'globales'}
              </h4>
            </div>
            
            {getStatisticsCards().map(stat => (
              <div key={stat.key} className="col-xl-3 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100 text-center" 
                  onClick={() => setActiveTab(stat.key)}
                  style={{ cursor: 'pointer', borderLeft: `4px solid ${stat.color}` }}
                >
                  <div className="card-body py-3">
                    <div className="small mb-1" style={{ color: stat.color }}>
                      <i className={`fas ${stat.icon} me-1`}></i>
                      {stat.label}
                    </div>
                    <div className="h4 fw-bold text-dark mb-0">{stat.value}</div>
                    <small className="text-muted">{stat.subtitle}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateur de filtre actif */}
          {activeTab !== 'all' && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="alert alert-light border d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Filtre actif :</strong> 
                    <span className="ms-2">
                      {activeTab === 'AGRICULTURE' && '🌱 Domaine Agriculture'}
                      {activeTab === 'SANTE' && '💊 Domaine Santé'}
                      {activeTab === 'FONCIER' && '🏠 Domaine Foncier'}
                      {activeTab === 'ANAD' && '📋 Domaine ANAD'}
                    </span>
                    <span className="badge bg-primary ms-2">{filteredProducts.length} produit(s)</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setActiveTab('all')}
                  >
                    <i className="fas fa-times me-1"></i>
                    Effacer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vue des produits */}
          <ProductListView 
            activeTab={activeTab}
            filteredProducts={filteredProducts}
            productsByCategory={productsByCategory}
            userRole={user?.role}
          />
        </>
      )}

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

  function getStatisticsCards() {
    const userRole = user?.role
    const baseCards = [
      { 
        key: 'all', 
        label: 'Total', 
        value: stats.total, 
        color: '#6c757d', 
        icon: 'fa-boxes',
        subtitle: 'Produits visibles'
      }
    ]

    switch(userRole) {
      case 'AGRICULTEUR':
        return [
          ...baseCards,
          { 
            key: 'AGRICULTURE', 
            label: 'Mes Produits', 
            value: stats.agriculture, 
            color: '#198754', 
            icon: 'fa-seedling',
            subtitle: 'Produits agricoles'
          }
        ]
      case 'MEDECIN':
        return [
          ...baseCards,
          { 
            key: 'SANTE', 
            label: 'Produits Santé', 
            value: stats.sante, 
            color: '#0dcaf0', 
            icon: 'fa-heart-pulse',
            subtitle: 'Médicaments & santé'
          }
        ]
      case 'FONCIER':
        return [
          ...baseCards,
          { 
            key: 'FONCIER', 
            label: 'Biens Fonciers', 
            value: stats.foncier, 
            color: '#ffc107', 
            icon: 'fa-landmark',
            subtitle: 'Titres fonciers'
          }
        ]
      case 'ANAD':
        return [
          ...baseCards,
          { 
            key: 'AGRICULTURE', 
            label: 'Agriculture', 
            value: stats.agriculture, 
            color: '#198754', 
            icon: 'fa-seedling',
            subtitle: 'Produits agricoles'
          },
          { 
            key: 'SANTE', 
            label: 'Santé', 
            value: stats.sante, 
            color: '#0dcaf0', 
            icon: 'fa-heart-pulse',
            subtitle: 'Produits de santé'
          },
          { 
            key: 'FONCIER', 
            label: 'Foncier', 
            value: stats.foncier, 
            color: '#ffc107', 
            icon: 'fa-landmark',
            subtitle: 'Biens immobiliers'
          }
        ]
      default:
        return baseCards
    }
  }
}

// Composant pour l'affichage des produits
const ProductListView = ({ activeTab, filteredProducts, productsByCategory, userRole }) => {
  if (activeTab === 'all') {
    const visibleCategories = Object.keys(productsByCategory).filter(
      category => productsByCategory[category]?.length > 0
    )

    if (visibleCategories.length === 0) {
      return (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow">
              <div className="card-body text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucun produit disponible</h5>
                <p className="text-muted">
                  {userRole === 'ANAD' 
                    ? "Aucun produit n'a été créé dans le système"
                    : "Vous n'avez pas encore de produits dans votre domaine"
                  }
                </p>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Créer votre premier produit
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        {visibleCategories.map(category => (
          <div key={category} className="col-12 mb-5">
            <div className="d-flex align-items-center mb-3">
              <h4 className={`fw-bold mb-0 ${
                category === 'agriculture' ? 'text-success' :
                category === 'sante' ? 'text-info' :
                category === 'foncier' ? 'text-warning' : 'text-primary'
              }`}>
                <i className={`fas ${
                  category === 'agriculture' ? 'fa-seedling' :
                  category === 'sante' ? 'fa-heart-pulse' :
                  category === 'foncier' ? 'fa-landmark' : 'fa-file-medical'
                } me-2`}></i>
                Domaine {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <span className={`badge ${
                category === 'agriculture' ? 'bg-success' :
                category === 'sante' ? 'bg-info' :
                category === 'foncier' ? 'bg-warning' : 'bg-primary'
              } ms-2`}>
                {productsByCategory[category].length} produits
              </span>
            </div>
            <div className="row g-3">
              {productsByCategory[category].map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow">
          <div className="card-header bg-white py-3">
            <h5 className="card-title mb-0">
              <i className="fas fa-filter me-2"></i>
              Produits Filtrés ({filteredProducts.length})
            </h5>
          </div>
          <div className="card-body">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucun produit trouvé</h5>
                <p className="text-muted">Aucun produit ne correspond à vos critères de recherche</p>
              </div>
            ) : (
              <div className="row g-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant Carte Produit
const ProductCard = ({ product }) => {
  if (!product || typeof product !== 'object') {
    return null
  }

  const getCategoryBadge = (category) => {
    const categories = {
      'AGRICULTURE': { label: '🌱 Agriculture', class: 'bg-success', icon: 'fa-seedling' },
      'SANTE': { label: '💊 Santé', class: 'bg-info', icon: 'fa-heart-pulse' },
      'FONCIER': { label: '🏠 Foncier', class: 'bg-warning', icon: 'fa-landmark' },
      'ANAD': { label: '📋 ANAD', class: 'bg-primary', icon: 'fa-file-medical' }
    }
    const categoryInfo = categories[category] || { label: category, class: 'bg-secondary', icon: 'fa-cube' }
    return (
      <span className={`badge ${categoryInfo.class}`}>
        <i className={`fas ${categoryInfo.icon} me-1`}></i>
        {categoryInfo.label}
      </span>
    )
  }

  return (
    <div className="col-xl-4 col-md-6">
      <div className="card product-card h-100 border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h6 className="card-title fw-bold text-dark mb-0">{product.name || 'Nom non disponible'}</h6>
            {getCategoryBadge(product.category)}
          </div>
          
          <div className="product-meta mb-3">
            <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
              <span>
                <i className="fas fa-barcode me-1"></i>
                SKU: {product.sku || 'N/A'}
              </span>
              <span className={`badge ${
                product.ownerRole === 'AGRICULTEUR' ? 'bg-success' :
                product.ownerRole === 'MEDECIN' ? 'bg-info' :
                product.ownerRole === 'FONCIER' ? 'bg-warning' : 'bg-primary'
              }`}>
                {product.ownerRole}
              </span>
            </div>
            
            {product.owner && (
              <div className="small text-muted mb-2">
                <i className="fas fa-user me-1"></i>
                Propriétaire: {product.owner.name} 
                {product.owner.email && ` (${product.owner.email})`}
              </div>
            )}
            
            {product.createdAt && (
              <div className="small text-muted">
                <i className="fas fa-calendar me-1"></i>
                Créé le {new Date(product.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <Link 
              to={`/product/${product._id}`} 
              className="btn btn-outline-primary btn-sm"
            >
              <i className="fas fa-eye me-1"></i>
              Voir Détails
            </Link>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-edit me-1"></i>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de profil utilisateur
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
      // Ici vous appelleriez votre API pour mettre à jour le profil
      // Pour l'instant on simule une mise à jour
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