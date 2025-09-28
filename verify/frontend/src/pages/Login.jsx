import React, { useState } from 'react';
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

                <div className="mb-4">
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

                {/* Bouton de connexion */}
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-semibold py-3"
                  disabled={loading}
                  style={{ 
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              {/* Message d'erreur */}
              {err && (
                <div className="alert alert-danger mt-3" role="alert" style={{ borderRadius: '10px' }}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {err}
                </div>
              )}

              {/* Rôles d'accès */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="text-center text-secondary mb-3">Accès par rôle :</h6>
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill p-2 w-100">
                      Agriculteurs
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill p-2 w-100">
                      Médecins
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill p-2 w-100">
                      Fonciers
                    </span>
                  </div>
                  <div className="col-6">
                    <span className="badge bg-info bg-opacity-10 text-info rounded-pill p-2 w-100">
                      ANAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Sécurisé par Hedera Hashgraph
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
    </div>
  );
}