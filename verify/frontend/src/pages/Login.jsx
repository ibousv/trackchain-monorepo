import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) { 
      setErr(err.response?.data?.msg || 'Erreur de connexion'); 
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    // Fonctionnalité à implémenter
    alert('Fonctionnalité "Mot de passe oublié" à venir');
  }

  return (
    <div className="container-fluid vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          
          {/* Carte de connexion */}
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4 p-md-5">
              
              {/* En-tête */}
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <span className="text-white fw-bold fs-5">TC</span>
                </div>
                <h2 className="card-title fw-bold text-dark mb-2">TrackChain</h2>
                <p className="text-muted mb-3">Plateforme de Traçabilité Blockchain</p>
                <h6 className="fw-normal text-secondary">Connexion à votre espace</h6>
              </div>

              {/* Formulaire */}
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-secondary fw-medium">
                    Adresse Email
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    className="form-control form-control-lg"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="votre@email.com"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-secondary fw-medium">
                    Mot de passe
                  </label>
                  <input 
                    id="password"
                    type="password" 
                    className="form-control form-control-lg"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Votre mot de passe"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </div>

                {/* Lien mot de passe oublié */}
                <div className="mb-4 text-end">
                  <button 
                    type="button"
                    className="btn btn-link text-decoration-none p-0 text-muted"
                    onClick={handleForgotPassword}
                  >
                    <i className="fas fa-key me-1"></i>
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton de connexion */}
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-semibold py-3 mb-3"
                  disabled={loading}
                  style={{ 
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Se connecter
                    </>
                  )}
                </button>

                {/* Bouton d'inscription */}
                <Link 
                  to="/register" 
                  className="btn btn-outline-primary btn-lg w-100 fw-semibold py-3"
                  style={{ 
                    borderRadius: '10px',
                    border: '2px solid #667eea',
                    color: '#667eea',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#667eea';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#667eea';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Créer un compte
                </Link>
              </form>

              {/* Message d'erreur */}
              {err && (
                <div className="alert alert-danger mt-3" role="alert" style={{ borderRadius: '10px' }}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {err}
                </div>
              )}

              {/* Séparateur */}
              <div className="position-relative my-4">
                <hr />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                  OU
                </span>
              </div>

              {/* Rôles d'accès */}
              <div className="mt-3">
                <h6 className="text-center text-secondary mb-3">Accès par rôle :</h6>
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill p-2 w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-seedling me-1 small"></i>
                      <small>Agriculteurs</small>
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-info bg-opacity-10 text-info rounded-pill p-2 w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-user-doctor me-1 small"></i>
                      <small>Médecins</small>
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill p-2 w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-landmark me-1 small"></i>
                      <small>Fonciers</small>
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill p-2 w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-file-medical me-1 small"></i>
                      <small>ANAD</small>
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Sécurisé par Hedera Hashgraph • 
                  <i className="fas fa-lock me-1 ms-2"></i>
                  Données cryptées
                </small>
              </div>
            </div>
          </div>

          {/* Copyright */}
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
        
        .form-control {
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }
        
        .btn-link:hover {
          color: #667eea !important;
        }
        
        .badge {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}