import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function Register(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'AGRICULTEUR'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      const res = await api.post('/auth/register', formData)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch(err) { 
      const errorMessage = err.response?.data?.msg || 'Erreur lors de l\'inscription'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    const icons = {
      'AGRICULTEUR': 'fa-seedling',
      'MEDECIN': 'fa-user-doctor',
      'FONCIER': 'fa-landmark',
      'ANAD': 'fa-file-medical'
    }
    return icons[role] || 'fa-user'
  }

  const getRoleDescription = (role) => {
    const descriptions = {
      'AGRICULTEUR': 'Gestion des produits agricoles et traçabilité des récoltes',
      'MEDECIN': 'Suivi des médicaments et produits de santé',
      'FONCIER': 'Gestion des titres fonciers et documents immobiliers',
      'ANAD': 'Contrôle sanitaire et rapports de conformité'
    }
    return descriptions[role] || ''
  }

  return (
    <div className="container-fluid vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          
          {/* Carte d'inscription */}
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              
              {/* En-tête */}
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="fas fa-user-plus text-white fs-4"></i>
                </div>
                <h2 className="card-title fw-bold text-dark mb-2">Créer un compte</h2>
                <p className="text-muted">Rejoignez la plateforme TrackChain</p>
              </div>

              {/* Formulaire */}
              <form onSubmit={submit}>
                <div className="row g-3">
                  
                  {/* Nom */}
                  <div className="col-12">
                    <label htmlFor="name" className="form-label fw-medium text-secondary">
                      <i className="fas fa-user me-2"></i>Nom complet
                    </label>
                    <input 
                      id="name"
                      name="name"
                      type="text" 
                      className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Votre nom complet"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-medium text-secondary">
                      <i className="fas fa-envelope me-2"></i>Adresse email
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Mot de passe */}
                  <div className="col-12">
                    <label htmlFor="password" className="form-label fw-medium text-secondary">
                      <i className="fas fa-lock me-2"></i>Mot de passe
                    </label>
                    <input 
                      id="password"
                      name="password"
                      type="password" 
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Créez un mot de passe sécurisé"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.password}
                      </div>
                    )}
                    <div className="form-text">
                      <i className="fas fa-info-circle me-1"></i>
                      Minimum 6 caractères
                    </div>
                  </div>

                  {/* Rôle */}
                  <div className="col-12">
                    <label htmlFor="role" className="form-label fw-medium text-secondary">
                      <i className="fas fa-briefcase me-2"></i>Rôle professionnel
                    </label>
                    <select 
                      id="role"
                      name="role"
                      className="form-select form-select-lg"
                      value={formData.role}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="AGRICULTEUR">
                        <i className="fas fa-seedling me-2"></i>
                        Agriculteur
                      </option>
                      <option value="MEDECIN">
                        <i className="fas fa-user-doctor me-2"></i>
                        Médecin
                      </option>
                      <option value="FONCIER">
                        <i className="fas fa-landmark me-2"></i>
                        Foncier
                      </option>
                      <option value="ANAD">
                        <i className="fas fa-file-medical me-2"></i>
                        ANAD
                      </option>
                    </select>
                    
                    {/* Description du rôle */}
                    <div className="mt-2 p-3 bg-light rounded-2">
                      <div className="d-flex align-items-start">
                        <i className={`fas ${getRoleIcon(formData.role)} text-primary mt-1 me-3`}></i>
                        <div>
                          <small className="text-muted fw-medium d-block">
                            {formData.role === 'AGRICULTEUR' && '🌱 Agriculteur'}
                            {formData.role === 'MEDECIN' && '💊 Médecin'}
                            {formData.role === 'FONCIER' && '🏠 Foncier'}
                            {formData.role === 'ANAD' && '📋 ANAD'}
                          </small>
                          <small className="text-muted">
                            {getRoleDescription(formData.role)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Erreur générale */}
                  {errors.submit && (
                    <div className="col-12">
                      <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <div>{errors.submit}</div>
                      </div>
                    </div>
                  )}

                  {/* Bouton d'inscription */}
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 fw-semibold py-3"
                      disabled={loading}
                      style={{ 
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Création du compte...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Créer mon compte
                        </>
                      )}
                    </button>
                  </div>

                  {/* Lien de connexion */}
                  <div className="col-12 text-center mt-4">
                    <p className="text-muted mb-0">
                      Déjà un compte?{' '}
                      <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                        <i className="fas fa-sign-in-alt me-1"></i>
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </div>
              </form>

              {/* Informations de sécurité */}
              <div className="mt-4 pt-4 border-top">
                <div className="row text-center">
                  <div className="col-12">
                    <small className="text-muted">
                      <i className="fas fa-shield-alt me-1"></i>
                      Sécurisé par Hedera Hashgraph • 
                      <i className="fas fa-lock me-1 ms-2"></i>
                      Données cryptées
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <small className="text-white-50">
              &copy; 2025 TrackChain - Plateforme de traçabilité blockchain
            </small>
          </div>
        </div>
      </div>

      {/* Styles supplémentaires */}
      <style>{`
        .card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .form-control, .form-select {
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  )
}