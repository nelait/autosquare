import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RecallsList from '../components/recalls/RecallsList';
import { getVehicleByVin } from '../data/vehicles';
import { getRecallsByVin } from '../data/recalls';
import './RecallsPage.css';

const RecallsPage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [recalls, setRecalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));

            const vehicleData = getVehicleByVin(vin);
            const recallsData = getRecallsByVin(vin);

            setVehicle(vehicleData);
            setRecalls(recallsData);
            setLoading(false);
        };

        loadData();
    }, [vin]);

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
                    <p>Loading recalls...</p>
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
                            <code>{vehicle.vin}</code>
                        </div>
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

                <RecallsList recalls={filteredRecalls} />
            </div>
        </div>
    );
};

export default RecallsPage;
