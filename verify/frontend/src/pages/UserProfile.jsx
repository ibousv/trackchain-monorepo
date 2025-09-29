import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function UserProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est obligatoire';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est obligatoire';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
            newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Préparer les données pour l'API
            const updateData = {
                name: formData.name,
                email: formData.email
            };

            // Ajouter le mot de passe seulement si fourni
            if (formData.currentPassword && formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            // Appel API pour mettre à jour le profil
            const res = await api.put('/auth/profile', updateData);

            // Mettre à jour les données locales
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage('Profil mis à jour avec succès!');

            // Réinitialiser les champs mot de passe
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

        } catch (err) {
            console.error('Erreur mise à jour profil:', err);
            setMessage(err.response?.data?.msg || 'Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const roles = {
            'AGRICULTEUR': { label: 'Agriculteur', class: 'bg-success', icon: 'fa-seedling' },
            'MEDECIN': { label: 'Médecin', class: 'bg-info', icon: 'fa-user-doctor' },
            'FONCIER': { label: 'Foncier', class: 'bg-warning', icon: 'fa-landmark' },
            'ANAD': { label: 'ANAD', class: 'bg-primary', icon: 'fa-file-medical' }
        };
        const roleInfo = roles[role] || { label: role, class: 'bg-secondary', icon: 'fa-user' };
        return (
            <span className={`badge ${roleInfo.class} fs-6`}>
                <i className={`fas ${roleInfo.icon} me-1`}></i>
                {roleInfo.label}
            </span>
        );
    };

    if (!user) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center py-5">
                                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                <h3 className="text-muted">Utilisateur non connecté</h3>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/login')}
                                >
                                    Se connecter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card border-0 shadow">
                        <div className="card-header bg-white py-3">
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-outline-secondary btn-sm me-3"
                                    onClick={() => navigate('/')}
                                >
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-user-circle me-2 text-primary"></i>
                                    Mon Profil
                                </h5>
                            </div>
                        </div>

                        <div className="card-body">
                            {/* Informations utilisateur */}
                            <div className="text-center mb-4">
                                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '80px', height: '80px' }}>
                                    <i className="fas fa-user text-white fs-3"></i>
                                </div>
                                <h4 className="fw-bold text-dark">{user.name}</h4>
                                <div className="mb-3">
                                    {getRoleBadge(user.role)}
                                </div>
                                <p className="text-muted">{user.email}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {message && (
                                    <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'} mb-4`}>
                                        {message}
                                    </div>
                                )}

                                <div className="row g-3">

                                    {/* Informations personnelles */}
                                    <div className="col-12">
                                        <h6 className="border-bottom pb-2 mb-3">
                                            <i className="fas fa-user me-2"></i>
                                            Informations personnelles
                                        </h6>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label fw-medium">
                                            Nom complet *
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">{errors.name}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label fw-medium">
                                            Adresse email *
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">{errors.email}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-medium">Rôle</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.role}
                                            disabled
                                        />
                                        <div className="form-text">
                                            Le rôle ne peut pas être modifié
                                        </div>
                                    </div>

                                    {/* Changement de mot de passe */}
                                    <div className="col-12">
                                        <h6 className="border-bottom pb-2 mb-3 mt-4">
                                            <i className="fas fa-lock me-2"></i>
                                            Changer le mot de passe
                                        </h6>
                                        <small className="text-muted d-block mb-3">
                                            Remplissez ces champs seulement si vous souhaitez changer votre mot de passe.
                                        </small>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="currentPassword" className="form-label fw-medium">
                                            Mot de passe actuel
                                        </label>
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            className="form-control"
                                            placeholder="Entrez votre mot de passe actuel"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="newPassword" className="form-label fw-medium">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                            placeholder="Minimum 6 caractères"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                        {errors.newPassword && (
                                            <div className="invalid-feedback">{errors.newPassword}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="confirmPassword" className="form-label fw-medium">
                                            Confirmer le mot de passe
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            placeholder="Confirmez le nouveau mot de passe"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                                        )}
                                    </div>

                                    {/* Boutons */}
                                    <div className="col-12">
                                        <div className="d-flex gap-2 justify-content-end pt-3">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => navigate('/')}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Mise à jour...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save me-2"></i>
                                                        Enregistrer les modifications
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}