import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RecallsList from '../components/recalls/RecallsList';
import { getVehicleByVin } from '../data/vehicles';
import { getRecallsByVin } from '../data/recalls';
import { lookupVehicle, getRecalls } from '../services/mcpClient';
import './RecallsPage.css';

const RecallsPage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [recalls, setRecalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isRealData, setIsRealData] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setIsRealData(false);

            // First try mock data
            const mockVehicle = getVehicleByVin(vin);
            const mockRecalls = getRecallsByVin(vin);

            if (mockVehicle && mockRecalls.length > 0) {
                // Use mock data if available
                setVehicle(mockVehicle);
                setRecalls(mockRecalls);
                setLoading(false);
                return;
            }

            // Try real API for vehicle and recalls
            try {
                let vehicleData = mockVehicle;

                // Get vehicle info if not in mock data
                if (!vehicleData) {
                    const vehicleResult = await lookupVehicle(vin);
                    if (vehicleResult?.vehicle) {
                        const v = vehicleResult.vehicle;
                        vehicleData = {
                            vin: vin,
                            make: v.make,
                            model: v.model,
                            year: v.year,
                            image: getDefaultImage(v.make)
                        };
                    }
                }

                setVehicle(vehicleData);

                // Get real recalls from NHTSA
                if (vehicleData) {
                    const recallsResult = await getRecalls({
                        make: vehicleData.make,
                        model: vehicleData.model,
                        year: vehicleData.year
                    });

                    if (recallsResult?.recalls && recallsResult.recalls.length > 0) {
                        setRecalls(recallsResult.recalls);
                        setIsRealData(true);
                    } else {
                        // No real recalls found
                        setRecalls([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching recalls:', error);
                // Fall back to any mock data we have
                setRecalls(mockRecalls);
            }

            setLoading(false);
        };

        loadData();
    }, [vin]);

    const getDefaultImage = (make) => {
        const makeImages = {
            'Tesla': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
            'TESLA': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
            'Honda': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
            'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
            'Ford': 'https://images.unsplash.com/photo-1590739225287-bd31519780c3?w=800&q=80',
        };
        return makeImages[make] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
    };

    const filteredRecalls = filter === 'all'
        ? recalls
        : recalls.filter(r => r.status === filter);

    const openCount = recalls.filter(r => r.status === 'open').length;
    const completedCount = recalls.filter(r => r.status === 'completed').length;

    if (loading) {
        return (
            <div className="recalls-page loading-state">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p>Loading recalls from NHTSA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recalls-page">
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
                        <span>Recalls</span>
                    </div>
                </div>

                {vehicle && (
                    <div className="vehicle-summary glass-card">
                        <img
                            src={vehicle.image}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="summary-image"
                        />
                        <div className="summary-info">
                            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                            <code>{vehicle.vin || vin}</code>
                        </div>
                    </div>
                )}

                {isRealData && (
                    <div className="data-source-badge glass-card">
                        <span>✓</span> Real-time data from NHTSA
                    </div>
                )}

                <div className="recalls-header">
                    <h1>
                        <span>⚠️</span>
                        Safety Recalls
                    </h1>

                    <div className="recalls-stats">
                        <div className={`stat-item ${openCount > 0 ? 'has-open' : ''}`}>
                            <span className="stat-value">{openCount}</span>
                            <span className="stat-label">Open</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{completedCount}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                <div className="recalls-filter">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({recalls.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                        onClick={() => setFilter('open')}
                    >
                        Open ({openCount})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({completedCount})
                    </button>
                </div>

                {recalls.length === 0 ? (
                    <div className="no-recalls glass-card">
                        <span className="check-icon">✓</span>
                        <h3>No Recalls Found</h3>
                        <p>Great news! No safety recalls have been reported for this vehicle.</p>
                    </div>
                ) : (
                    <RecallsList recalls={filteredRecalls} />
                )}
            </div>
        </div>
    );
};

export default RecallsPage;
