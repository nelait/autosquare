import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ServiceLogsList from '../components/service/ServiceLogsList';
import { getVehicleByVin } from '../data/vehicles';
import { lookupVehicle, getServiceLogs, addServiceLog, parseServiceDocument, deleteServiceLog } from '../services/mcpClient';
import './ServiceLogsPage.css';

const ServiceLogsPage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [addingLog, setAddingLog] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Manual entry form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'maintenance',
        mileage: '',
        cost: ''
    });

    // Document paste text
    const [pasteText, setPasteText] = useState('');

    // Load vehicle and service logs
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            // Try mock data first for vehicle info
            const mockVehicle = getVehicleByVin(vin);
            if (mockVehicle) {
                setVehicle(mockVehicle);
            } else {
                // Try real API
                try {
                    const result = await lookupVehicle(vin);
                    if (result?.vehicle) {
                        setVehicle({
                            vin,
                            year: result.vehicle.year,
                            make: result.vehicle.make,
                            model: result.vehicle.model,
                            engine: result.vehicle.engine?.type || 'Unknown'
                        });
                    }
                } catch (err) {
                    console.error('Could not load vehicle:', err);
                }
            }

            // Load service logs from backend
            try {
                const logsResult = await getServiceLogs(vin);
                setLogs(logsResult.logs || []);
            } catch (err) {
                console.error('Could not load service logs:', err);
                // Fall back to empty for new users
                setLogs([]);
            }

            setLoading(false);
        };

        loadData();
    }, [vin]);

    const handleAddLog = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) return;

        setAddingLog(true);
        setError('');
        setSuccess('');

        try {
            const result = await addServiceLog(
                vin,
                formData.date,
                formData.description,
                formData.category,
                formData.mileage ? parseInt(formData.mileage) : undefined,
                formData.cost ? parseFloat(formData.cost) : undefined
            );

            if (result.success) {
                setSuccess('Service log added successfully!');
                setLogs(prev => [result.log, ...prev]);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    category: 'maintenance',
                    mileage: '',
                    cost: ''
                });
                setShowAddForm(false);
            } else {
                throw new Error(result.error || 'Failed to add log');
            }
        } catch (err) {
            setError(err.message || 'Failed to add service log');
        } finally {
            setAddingLog(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            // Read file as text or extract text
            let text = '';

            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                text = await file.text();
            } else if (file.type === 'application/pdf') {
                // For PDF, we'd need a PDF parsing library
                // For now, show a message
                setError('PDF parsing requires the document text. Please copy and paste the text content.');
                setUploading(false);
                return;
            } else {
                // For images, we'd need OCR
                setError('Image files require OCR. Please copy and paste the text content instead.');
                setUploading(false);
                return;
            }

            if (text.length < 20) {
                throw new Error('Document text is too short');
            }

            const result = await parseServiceDocument(vin, text);

            if (result.success && result.added > 0) {
                setSuccess(`Successfully extracted ${result.added} service records!`);
                setLogs(result.logs);
                setShowUpload(false);
            } else {
                throw new Error(result.error || 'Could not extract any service records');
            }
        } catch (err) {
            setError(err.message || 'Failed to parse document');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (logId) => {
        if (!confirm('Are you sure you want to delete this service log?')) return;

        try {
            await deleteServiceLog(logId);
            setLogs(prev => prev.filter(log => log.id !== logId));
            setSuccess('Service log deleted');
        } catch (err) {
            setError('Failed to delete log');
        }
    };

    if (loading) {
        return (
            <div className="service-page loading-state">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p>Loading service history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="service-page">
            <div className="container">
                <div className="page-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Back
                    </button>
                    <div className="page-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to={`/vehicle/${vin}`}>Vehicle</Link>
                        <span>/</span>
                        <span>Service History</span>
                    </div>
                </div>

                {vehicle && (
                    <div className="vehicle-summary glass-card">
                        {vehicle.image && (
                            <img
                                src={vehicle.image}
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                className="summary-image"
                            />
                        )}
                        <div className="summary-info">
                            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                            <code>{vehicle.vin || vin}</code>
                        </div>
                        {vehicle.mileage && (
                            <div className="summary-mileage">
                                <span className="mileage-value">{vehicle.mileage.toLocaleString()}</span>
                                <span className="mileage-label">Current Miles</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Alerts */}
                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span> {error}
                        <button onClick={() => setError('')} className="alert-close">×</button>
                    </div>
                )}
                {success && (
                    <div className="alert alert-success">
                        <span>✓</span> {success}
                        <button onClick={() => setSuccess('')} className="alert-close">×</button>
                    </div>
                )}

                <div className="service-header">
                    <div className="service-title">
                        <h1>
                            <span>📋</span>
                            Service History
                        </h1>
                        <p className="service-subtitle">
                            {logs.length > 0
                                ? `${logs.length} service records on file`
                                : 'No service records yet. Add your first log below.'}
                        </p>
                    </div>
                    <div className="service-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => setShowUpload(!showUpload)}
                        >
                            📄 Upload Document
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            ✏️ Add Entry
                        </button>
                    </div>
                </div>

                {/* Upload Section */}
                {showUpload && (
                    <div className="upload-section glass-card">
                        <h3>Import Service Records</h3>
                        <p className="upload-hint">
                            Paste text from a service receipt, invoice, or document. We'll use AI to extract the records.
                        </p>

                        <div className="paste-area">
                            <textarea
                                value={pasteText}
                                onChange={e => setPasteText(e.target.value)}
                                placeholder="Paste service document text here...

Example:
Date: 01/15/2024
Service: Oil Change and Filter Replacement  
Mileage: 45,000
Cost: $89.99

Date: 08/22/2023
Service: Brake Pad Replacement (Front)
Mileage: 38,500
Cost: $285.00"
                                rows={8}
                                disabled={uploading}
                            />
                            <button
                                className="btn-primary parse-btn"
                                onClick={async () => {
                                    if (!pasteText.trim() || pasteText.length < 20) {
                                        setError('Please paste more text (at least 20 characters)');
                                        return;
                                    }
                                    setUploading(true);
                                    setError('');
                                    try {
                                        const result = await parseServiceDocument(vin, pasteText);
                                        if (result.success && result.added > 0) {
                                            setSuccess(`Successfully extracted ${result.added} service records!`);
                                            setLogs(result.logs);
                                            setPasteText('');
                                            setShowUpload(false);
                                        } else {
                                            throw new Error(result.error || 'Could not extract any service records');
                                        }
                                    } catch (err) {
                                        setError(err.message || 'Failed to parse document');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                                disabled={uploading || pasteText.length < 20}
                            >
                                {uploading ? 'Analyzing...' : '🔍 Extract Records'}
                            </button>
                        </div>

                        <div className="upload-divider">
                            <span>or upload a text file</span>
                        </div>

                        <div className="upload-area">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".txt"
                                disabled={uploading}
                            />
                            {uploading && <p className="upload-progress">Analyzing document...</p>}
                        </div>
                    </div>
                )}

                {/* Manual Entry Form */}
                {showAddForm && (
                    <form onSubmit={handleAddLog} className="add-log-form glass-card">
                        <h3>Add Service Entry</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="maintenance">Maintenance</option>
                                    <option value="repair">Repair</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="recall">Recall</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mileage</label>
                                <input
                                    type="number"
                                    value={formData.mileage}
                                    onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                                    placeholder="e.g., 45000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Cost ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.cost}
                                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                                    placeholder="e.g., 89.99"
                                />
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the service performed..."
                                rows={3}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={addingLog}>
                                {addingLog ? 'Adding...' : 'Add Entry'}
                            </button>
                        </div>
                    </form>
                )}

                <ServiceLogsList logs={logs} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default ServiceLogsPage;
