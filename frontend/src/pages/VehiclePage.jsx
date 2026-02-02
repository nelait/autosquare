import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { getVehicleByVin } from '../data/vehicles';
import { getOpenRecalls } from '../data/recalls';
import './VehiclePage.css';

const VehiclePage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRecalls, setOpenRecalls] = useState([]);

    useEffect(() => {
        const loadVehicle = async () => {
            setLoading(true);
            setError(null);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const vehicleData = getVehicleByVin(vin);

            if (vehicleData) {
                setVehicle(vehicleData);
                setOpenRecalls(getOpenRecalls(vin));
            } else {
                setError('Vehicle not found. Please check the VIN and try again.');
            }

            setLoading(false);
        };

        loadVehicle();
    }, [vin]);

    if (loading) {
        return (
            <div className="vehicle-page loading-state">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p>Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vehicle-page error-state">
                <div className="error-container glass-card">
                    <span className="error-icon">🚫</span>
                    <h2>Vehicle Not Found</h2>
                    <p>{error}</p>
                    <p className="error-vin">VIN: <code>{vin}</code></p>
                    <div className="error-actions">
                        <button onClick={() => navigate(-1)} className="btn btn-secondary">
                            Go Back
                        </button>
                        <Link to="/" className="btn btn-primary">
                            Try Another VIN
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-page">
            <div className="container">
                <div className="page-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Back
                    </button>
                    <div className="page-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Vehicle Details</span>
                    </div>
                </div>

                {openRecalls.length > 0 && (
                    <div className="recall-alert glass-card animate-fade-in">
                        <div className="recall-alert-content">
                            <span className="alert-icon">⚠️</span>
                            <div>
                                <strong>{openRecalls.length} Open Recall{openRecalls.length > 1 ? 's' : ''}</strong>
                                <p>This vehicle has active safety recalls that require attention.</p>
                            </div>
                        </div>
                        <Link to={`/vehicle/${vin}/recalls`} className="btn btn-danger btn-sm">
                            View Recalls
                        </Link>
                    </div>
                )}

                <VehicleCard vehicle={vehicle} />

                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <Link to={`/vehicle/${vin}/recalls`} className="action-card glass-card">
                            <span className="action-icon">⚠️</span>
                            <div className="action-content">
                                <h4>Check Recalls</h4>
                                <p>View safety recalls and service campaigns</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>

                        <Link to={`/vehicle/${vin}/service`} className="action-card glass-card">
                            <span className="action-icon">📋</span>
                            <div className="action-content">
                                <h4>Service History</h4>
                                <p>View maintenance and repair records</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>

                        <Link to={`/vehicle/${vin}/diagnosis`} className="action-card glass-card">
                            <span className="action-icon">🩺</span>
                            <div className="action-content">
                                <h4>AI Diagnosis</h4>
                                <p>Describe issues and get smart analysis</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclePage;
