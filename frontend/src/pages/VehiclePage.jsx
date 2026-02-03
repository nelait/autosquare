import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VehicleCard from '../components/vehicle/VehicleCard';
import { getVehicleByVin } from '../data/vehicles';
import { getOpenRecalls } from '../data/recalls';
import { lookupVehicle, getRecalls } from '../services/mcpClient';
import './VehiclePage.css';

const VehiclePage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRecalls, setOpenRecalls] = useState([]);
    const [isRealData, setIsRealData] = useState(false);

    useEffect(() => {
        const loadVehicle = async () => {
            setLoading(true);
            setError(null);
            setIsRealData(false);

            // First check mock data (fast)
            const mockVehicle = getVehicleByVin(vin);

            if (mockVehicle) {
                setVehicle(mockVehicle);
                setOpenRecalls(getOpenRecalls(vin));
                setLoading(false);
                return;
            }

            // Not in mock data - try real NHTSA API via backend
            try {
                const result = await lookupVehicle(vin);

                if (result && result.vehicle) {
                    const v = result.vehicle;
                    // Map NHTSA data - backend returns nested engine object
                    const vehicleData = {
                        vin: vin,
                        make: v.make || 'Unknown',
                        model: v.model || 'Unknown',
                        year: v.year || 'Unknown',
                        trim: v.trim || '',
                        engine: {
                            type: v.engine?.type || v.electrificationLevel || 'Unknown',
                            horsepower: v.engine?.horsepower || 'N/A',
                            torque: v.engine?.torque || 'N/A',
                            fuelType: v.engine?.fuelType || 'Unknown'
                        },
                        transmission: v.transmission || 'Unknown',
                        drivetrain: v.drivetrain || 'Unknown',
                        bodyType: v.bodyClass || v.vehicleType || 'Unknown',
                        exteriorColor: v.exteriorColor || 'Not Available',
                        interiorColor: v.interiorColor || 'Not Available',
                        mileage: v.mileage || 'Unknown',
                        image: getDefaultImage(v.make),
                        features: v.features || [],
                        electrificationLevel: v.electrificationLevel,
                        plantCountry: v.plantCountry
                    };

                    setVehicle(vehicleData);
                    setIsRealData(true);

                    // Also fetch real recalls
                    try {
                        const recallsResult = await getRecalls({
                            make: vehicleData.make,
                            model: vehicleData.model,
                            year: vehicleData.year
                        });
                        if (recallsResult && recallsResult.recalls) {
                            setOpenRecalls(recallsResult.recalls);
                        }
                    } catch (recallErr) {
                        console.log('Could not fetch recalls:', recallErr);
                    }
                } else {
                    setError('Vehicle not found. Please check the VIN and try again.');
                }
            } catch (err) {
                console.error('VIN lookup error:', err);
                setError('Could not look up vehicle. The backend may be unavailable.');
            }

            setLoading(false);
        };

        loadVehicle();
    }, [vin]);

    // Get a default image based on make
    const getDefaultImage = (make) => {
        const makeImages = {
            'Tesla': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
            'Honda': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
            'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
            'Ford': 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=800&q=80',
            'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
            'Chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        };
        return makeImages[make] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
    };

    if (loading) {
        return (
            <div className="vehicle-page loading-state">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p>Looking up vehicle...</p>
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
                        <Link to="/lookup" className="btn btn-primary">
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

                {isRealData && (
                    <div className="data-source-badge glass-card animate-fade-in">
                        <span>✓</span> Real-time data from NHTSA
                    </div>
                )}

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
