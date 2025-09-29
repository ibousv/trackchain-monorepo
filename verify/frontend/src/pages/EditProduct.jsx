import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        category: ''
    });
    const [errors, setErrors] = useState({});

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.product);
            setFormData({
                name: res.data.product.name || '',
                sku: res.data.product.sku || '',
                description: res.data.product.description || '',
                category: res.data.product.category || ''
            });
        } catch (err) {
            console.error('Erreur chargement produit:', err);
            alert('Erreur lors du chargement du produit');
            navigate('/');
        } finally {
            setLoading(false);
        }
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            await api.put(`/products/${id}`, formData);
            alert('Produit modifié avec succès!');
            navigate(`/product/${id}`);
        } catch (err) {
            console.error('Erreur modification produit:', err);
            alert(err.response?.data?.msg || 'Erreur lors de la modification du produit');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);
            alert('Produit supprimé avec succès!');
            navigate('/');
        } catch (err) {
            console.error('Erreur suppression produit:', err);
            alert(err.response?.data?.msg || 'Erreur lors de la suppression du produit');
        }
    };

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
                                <p className="text-muted">Chargement du produit...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center py-5">
                                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                <h3 className="text-muted">Produit non trouvé</h3>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/')}
                                >
                                    Retour au dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vérifier les permissions
    const canEdit = user?.role === 'ANAD' || user?.role === 'SUPER_ADMIN' || 
        (user?.role === product.ownerRole && product.owner === user?.userId);

    if (!canEdit) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center py-5">
                                <i className="fas fa-ban fa-3x text-danger mb-3"></i>
                                <h3 className="text-muted">Accès refusé</h3>
                                <p className="text-muted">Vous n'avez pas la permission de modifier ce produit.</p>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/')}
                                >
                                    Retour au dashboard
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
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-outline-secondary btn-sm me-3"
                                        onClick={() => navigate(`/product/${id}`)}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </button>
                                    <h5 className="card-title mb-0">
                                        <i className="fas fa-edit me-2 text-warning"></i>
                                        Modifier le produit
                                    </h5>
                                </div>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleDelete}
                                >
                                    <i className="fas fa-trash me-1"></i>
                                    Supprimer
                                </button>
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
                                            value={formData.sku}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.sku && (
                                            <div className="invalid-feedback">{errors.sku}</div>
                                        )}
                                    </div>

                                    {/* Catégorie */}
                                    <div className="col-12">
                                        <label htmlFor="category" className="form-label fw-medium">
                                            Catégorie
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.category}
                                            disabled
                                        />
                                        <div className="form-text">
                                            La catégorie ne peut pas être modifiée
                                        </div>
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
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Informations produit */}
                                    <div className="col-12">
                                        <div className="card bg-light border-0">
                                            <div className="card-body">
                                                <h6 className="card-title">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    Informations du produit
                                                </h6>
                                                <div className="row small text-muted">
                                                    <div className="col-6">
                                                        <strong>Propriétaire:</strong> {product.owner?.name}
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Rôle:</strong> {product.ownerRole}
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Créé le:</strong> {new Date(product.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Modifié le:</strong> {new Date(product.updatedAt).toLocaleDateString()}
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
                                                onClick={() => navigate(`/product/${id}`)}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-warning"
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Modification...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save me-2"></i>
                                                        Enregistrer
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