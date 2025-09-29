import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

export default function TraceEvents() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [traces, setTraces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTrace, setNewTrace] = useState({
        type: 'production',
        data: { note: '' }
    });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        loadTraces();
    }, [id]);

    const loadTraces = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setTraces(res.data.traces || []);
        } catch (err) {
            console.error('Erreur chargement traces:', err);
            alert('Erreur lors du chargement des traces');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrace = async (e) => {
        e.preventDefault();

        if (!newTrace.data.note.trim()) {
            alert('Veuillez saisir une note pour la trace');
            return;
        }

        try {
            const res = await api.post('/traces', {
                product: id,
                type: newTrace.type,
                data: { note: newTrace.data.note }
            });

            setTraces(prev => [res.data.trace, ...prev]);
            setNewTrace({ type: 'production', data: { note: '' } });
            setShowAddForm(false);
            alert('Trace ajoutée avec succès!');
        } catch (err) {
            console.error('Erreur ajout trace:', err);
            alert(err.response?.data?.msg || 'Erreur lors de l\'ajout de la trace');
        }
    };

    const handleDeleteTrace = async (traceId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette trace ?')) {
            return;
        }

        try {
            await api.delete(`/traces/${traceId}`);
            setTraces(prev => prev.filter(trace => trace._id !== traceId));
            alert('Trace supprimée avec succès!');
        } catch (err) {
            console.error('Erreur suppression trace:', err);
            alert(err.response?.data?.msg || 'Erreur lors de la suppression de la trace');
        }
    };

    const getTraceTypeLabel = (type) => {
        const labels = {
            production: '🚜 Production',
            transport: '🚚 Transport',
            storage: '📦 Stockage',
            health_check: '🏥 Contrôle Santé',
            sale: '💰 Vente',
            inspection: '🔍 Inspection',
            creation: '➕ Création',
            update: '✏️ Modification'
        };
        return labels[type] || type;
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
                                <p className="text-muted">Chargement des traces...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <button
                                className="btn btn-outline-secondary me-3"
                                onClick={() => navigate(`/product/${id}`)}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <h1 className="h2 fw-bold text-dark mb-0">Gestion des Traces</h1>
                            <p className="text-muted mb-0">Historique complet des événements de traçabilité</p>
                        </div>
                        <button
                            className="btn btn-success"
                            onClick={() => setShowAddForm(true)}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Nouvelle Trace
                        </button>
                    </div>

                    {/* Formulaire d'ajout */}
                    {showAddForm && (
                        <div className="card border-0 shadow mb-4">
                            <div className="card-header bg-white py-3">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-plus-circle me-2 text-success"></i>
                                    Ajouter une nouvelle trace
                                </h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleAddTrace}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Type d'événement</label>
                                            <select
                                                className="form-select"
                                                value={newTrace.type}
                                                onChange={(e) => setNewTrace(prev => ({
                                                    ...prev,
                                                    type: e.target.value
                                                }))}
                                            >
                                                <option value="production">🚜 Production</option>
                                                <option value="transport">🚚 Transport</option>
                                                <option value="storage">📦 Stockage</option>
                                                <option value="health_check">🏥 Contrôle Santé</option>
                                                <option value="sale">💰 Vente</option>
                                                <option value="inspection">🔍 Inspection</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Détails</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Décrivez l'événement..."
                                                value={newTrace.data.note}
                                                onChange={(e) => setNewTrace(prev => ({
                                                    ...prev,
                                                    data: { note: e.target.value }
                                                }))}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowAddForm(false)}
                                                >
                                                    Annuler
                                                </button>
                                                <button type="submit" className="btn btn-success">
                                                    <i className="fas fa-plus me-2"></i>
                                                    Ajouter la trace
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Liste des traces */}
                    <div className="card border-0 shadow">
                        <div className="card-header bg-white py-3">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-history me-2"></i>
                                Historique des traces ({traces.length})
                            </h5>
                        </div>
                        <div className="card-body">
                            {traces.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted">Aucune trace enregistrée</h5>
                                    <p className="text-muted">Commencez par ajouter la première trace</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Acteur</th>
                                                <th>Date</th>
                                                <th>Détails</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {traces.map(trace => (
                                                <tr key={trace._id}>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {getTraceTypeLabel(trace.type)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {trace.actor?.name || 'Système'}
                                                        {trace.actor?.role && (
                                                            <div className="small text-muted">{trace.actor.role}</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {new Date(trace.timestamp).toLocaleString('fr-FR')}
                                                    </td>
                                                    <td>
                                                        {trace.data?.note && (
                                                            <div className="small text-muted">
                                                                {trace.data.note}
                                                            </div>
                                                        )}
                                                        {trace.hederaTxId && (
                                                            <div className="small">
                                                                <i className="fas fa-link me-1"></i>
                                                                {trace.hederaTxId.substring(0, 20)}...
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDeleteTrace(trace._id)}
                                                            title="Supprimer la trace"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}