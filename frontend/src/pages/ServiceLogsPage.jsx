import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ServiceLogsList from '../components/service/ServiceLogsList';
import { getVehicleByVin } from '../data/vehicles';
import { getServiceLogsByVin, getTotalServiceCost } from '../data/serviceLogs';
import './ServiceLogsPage.css';

const ServiceLogsPage = () => {
    const { vin } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));

            const vehicleData = getVehicleByVin(vin);
            const logsData = getServiceLogsByVin(vin);

            setVehicle(vehicleData);
            setLogs(logsData);
            setLoading(false);
        };

        loadData();
    }, [vin]);

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
                        <img
                            src={vehicle.image}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="summary-image"
                        />
                        <div className="summary-info">
                            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                            <code>{vehicle.vin}</code>
                        </div>
                        <div className="summary-mileage">
                            <span className="mileage-value">{vehicle.mileage.toLocaleString()}</span>
                            <span className="mileage-label">Current Miles</span>
                        </div>
                    </div>
                )}

                <div className="service-header">
                    <h1>
                        <span>📋</span>
                        Service History
                    </h1>
                    <p className="service-subtitle">
                        Complete maintenance and repair records for this vehicle
                    </p>
                </div>

                <ServiceLogsList logs={logs} />
            </div>
        </div>
    );
};

export default ServiceLogsPage;
