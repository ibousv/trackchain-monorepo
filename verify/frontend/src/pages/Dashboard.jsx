import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function Dashboard(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    agriculture: 0,
    sante: 0,
    foncier: 0,
    anad: 0
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await api.get('/products')
      // S'assurer que les données sont bien un tableau
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

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    if (!product || typeof product !== 'object') return false
    
    const matchesSearch = 
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.ownerRole?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === 'all' || product.category === activeTab

    return matchesSearch && matchesTab
  })

  // Grouper les produits par catégorie
  const productsByCategory = {
    agriculture: products.filter(p => p && p.category === 'AGRICULTURE'),
    sante: products.filter(p => p && p.category === 'SANTE'),
    foncier: products.filter(p => p && p.category === 'FONCIER'),
    anad: products.filter(p => p && p.category === 'ANAD')
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

  const getOwnerRoleBadge = (ownerRole) => {
    const roles = {
      'AGRICULTEUR': { label: 'Agriculteur', class: 'bg-success' },
      'MEDECIN': { label: 'Médecin', class: 'bg-info' },
      'FONCIER': { label: 'Foncier', class: 'bg-warning' },
      'ANAD': { label: 'ANAD', class: 'bg-primary' }
    }
    const roleInfo = roles[ownerRole] || { label: ownerRole, class: 'bg-secondary' }
    return <span className={`badge ${roleInfo.class}`}>{roleInfo.label}</span>
  }

  const refreshData = async () => {
    setLoading(true)
    await loadProducts()
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête du Dashboard */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">Tableau de Bord TrackChain</h1>
              <p className="text-muted mb-0">Surveillance organisée par domaines et catégories</p>
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
                      <option value="AGRICULTURE">🌱 Agriculture</option>
                      <option value="SANTE">💊 Santé</option>
                      <option value="FONCIER">🏠 Foncier</option>
                      <option value="ANAD">📋 ANAD</option>
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
          {/* Cartes de Statistiques */}
          <div className="row mb-4">
            <div className="col-12">
              <h4 className="fw-bold mb-3">📊 Aperçu par Domaines</h4>
            </div>
            
            {[
              { key: 'all', label: 'Total Général', value: stats.total, color: '#6c757d', icon: 'fa-boxes' },
              { key: 'AGRICULTURE', label: 'Agriculture', value: stats.agriculture, color: '#198754', icon: 'fa-seedling' },
              { key: 'SANTE', label: 'Santé', value: stats.sante, color: '#0dcaf0', icon: 'fa-heart-pulse' },
              { key: 'FONCIER', label: 'Foncier', value: stats.foncier, color: '#ffc107', icon: 'fa-landmark' },
              { key: 'ANAD', label: 'ANAD', value: stats.anad, color: '#0d6efd', icon: 'fa-file-medical' }
            ].map(stat => (
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
                    <small className="text-muted">Produits</small>
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
          />
        </>
      )}
    </div>
  )
}

// Composant pour l'affichage des produits
const ProductListView = ({ activeTab, filteredProducts, productsByCategory }) => {
  if (activeTab === 'all') {
    return (
      <div className="row">
        {['agriculture', 'sante', 'foncier', 'anad'].map(category => (
          productsByCategory[category]?.length > 0 && (
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
          )
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
  // Protection contre les produits undefined
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

  const getOwnerRoleBadge = (ownerRole) => {
    const roles = {
      'AGRICULTEUR': { label: 'Agriculteur', class: 'bg-success' },
      'MEDECIN': { label: 'Médecin', class: 'bg-info' },
      'FONCIER': { label: 'Foncier', class: 'bg-warning' },
      'ANAD': { label: 'ANAD', class: 'bg-primary' }
    }
    const roleInfo = roles[ownerRole] || { label: ownerRole, class: 'bg-secondary' }
    return <span className={`badge ${roleInfo.class}`}>{roleInfo.label}</span>
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
              {getOwnerRoleBadge(product.ownerRole)}
            </div>
            
            {product.owner && (
              <div className="small text-muted mb-2">
                <i className="fas fa-user me-1"></i>
                Propriétaire: {product.owner.name} ({product.owner.role})
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
          </div>
        </div>
      </div>
    </div>
  )
}