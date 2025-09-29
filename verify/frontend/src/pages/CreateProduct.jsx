import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function CreateProduct() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        category: '',
        metadata: {}
    });
    const [errors, setErrors] = useState({});

    const user = JSON.parse(localStorage.getItem('user'));

    // Déterminer la catégorie par défaut selon le rôle
    const getDefaultCategory = () => {
        const roleCategoryMap = {
            'AGRICULTEUR': 'AGRICULTURE',
            'MEDECIN': 'SANTE',
            'FONCIER': 'FONCIER',
            'ANAD': 'AGRICULTURE' // ANAD peut choisir
        };
        return roleCategoryMap[user?.role] || 'AGRICULTURE';
    };

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
            newErrors.name = 'Le nom du produit est obligatoire';
        }

        if (!formData.sku.trim()) {
            newErrors.sku = 'Le SKU est obligatoire';
        }

        if (!formData.category) {
            newErrors.category = 'La catégorie est obligatoire';
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

        try {
            const finalFormData = {
                ...formData,
                category: formData.category || getDefaultCategory()
            };

            const res = await api.post('/products', finalFormData);

            if (res.data) {
                alert('Produit créé avec succès!');
                navigate('/');
            }
        } catch (err) {
            console.error('Erreur création produit:', err);
            alert(err.response?.data?.msg || 'Erreur lors de la création du produit');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryOptions = () => {
        const userRole = user?.role;

        if (userRole === 'ANAD') {
            return [
                { value: 'AGRICULTURE', label: '🌱 Agriculture' },
                { value: 'SANTE', label: '💊 Santé' },
                { value: 'FONCIER', label: '🏠 Foncier' },
                { value: 'ANAD', label: '📋 ANAD' }
            ];
        }

        // Pour les autres rôles, seule leur catégorie est disponible
        const roleCategories = {
            'AGRICULTEUR': [{ value: 'AGRICULTURE', label: '🌱 Agriculture' }],
            'MEDECIN': [{ value: 'SANTE', label: '💊 Santé' }],
            'FONCIER': [{ value: 'FONCIER', label: '🏠 Foncier' }]
        };

        return roleCategories[userRole] || [];
    };

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
                                    <i className="fas fa-plus-circle me-2 text-success"></i>
                                    Créer un nouveau produit
                                </h5>
                            </div>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">

                                    {/* Nom du produit */}
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label fw-medium">
                                            Nom du produit *
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Ex: Maïs Bio, Vaccin BCG, Titre Foncier..."
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">{errors.name}</div>
                                        )}
                                    </div>

                                    {/* SKU */}
                                    <div className="col-12">
                                        <label htmlFor="sku" className="form-label fw-medium">
                                            SKU (Référence) *
                                        </label>
                                        <input
                                            id="sku"
                                            name="sku"
                                            type="text"
                                            className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                                            placeholder="Ex: SKU-MAIS-001, SKU-BCG-001..."
                                            value={formData.sku}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.sku && (
                                            <div className="invalid-feedback">{errors.sku}</div>
                                        )}
                                        <div className="form-text">
                                            Identifiant unique pour le produit
                                        </div>
                                    </div>

                                    {/* Catégorie */}
                                    <div className="col-12">
                                        <label htmlFor="category" className="form-label fw-medium">
                                            Catégorie *
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                            value={formData.category || getDefaultCategory()}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Sélectionnez une catégorie</option>
                                            {getCategoryOptions().map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <div className="invalid-feedback">{errors.category}</div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label fw-medium">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Description détaillée du produit..."
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Informations supplémentaires */}
                                    <div className="col-12">
                                        <label className="form-label fw-medium">
                                            Métadonnées supplémentaires
                                        </label>
                                        <div className="border rounded p-3 bg-light">
                                            <small className="text-muted">
                                                Les métadonnées spécifiques au produit seront ajoutées automatiquement selon le type de produit.
                                            </small>
                                        </div>
                                    </div>

                                    {/* Informations utilisateur */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0">
                                            <div className="card-body">
                                                <h6 className="card-title">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    Informations de création
                                                </h6>
                                                <div className="row small text-muted">
                                                    <div className="col-6">
                                                        <strong>Créateur:</strong> {user?.name}
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Rôle:</strong> {user?.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                className="btn btn-success"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Création...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-plus me-2"></i>
                                                        Créer le produit
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