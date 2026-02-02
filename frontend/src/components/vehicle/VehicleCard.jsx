import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, showActions = true }) => {
    if (!vehicle) return null;

    return (
        <div className="vehicle-card glass-card animate-fade-in">
            <div className="vehicle-image-container">
                <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="vehicle-image"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';
                    }}
                />
                <div className="vehicle-image-overlay">
                    <span className="vehicle-year-badge">{vehicle.year}</span>
                </div>
            </div>

            <div className="vehicle-content">
                <div className="vehicle-header">
                    <h2 className="vehicle-title">
                        {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="vehicle-trim">{vehicle.trim}</p>
                </div>

                <div className="vehicle-vin">
                    <span className="vin-label">VIN:</span>
                    <code className="vin-value">{vehicle.vin}</code>
                </div>

                <div className="vehicle-specs-grid">
                    <div className="spec-item">
                        <span className="spec-icon">⚙️</span>
                        <div className="spec-content">
                            <span className="spec-label">Engine</span>
                            <span className="spec-value">{vehicle.engine.type}</span>
                        </div>
                    </div>

                    <div className="spec-item">
                        <span className="spec-icon">⚡</span>
                        <div className="spec-content">
                            <span className="spec-label">Power</span>
                            <span className="spec-value">{vehicle.engine.horsepower} HP</span>
                        </div>
                    </div>

                    <div className="spec-item">
                        <span className="spec-icon">🔄</span>
                        <div className="spec-content">
                            <span className="spec-label">Transmission</span>
                            <span className="spec-value">{vehicle.transmission}</span>
                        </div>
                    </div>

                    <div className="spec-item">
                        <span className="spec-icon">🛞</span>
                        <div className="spec-content">
                            <span className="spec-label">Drivetrain</span>
                            <span className="spec-value">{vehicle.drivetrain}</span>
                        </div>
                    </div>

                    <div className="spec-item">
                        <span className="spec-icon">🎨</span>
                        <div className="spec-content">
                            <span className="spec-label">Exterior</span>
                            <span className="spec-value">{vehicle.exteriorColor}</span>
                        </div>
                    </div>

                    <div className="spec-item">
                        <span className="spec-icon">📍</span>
                        <div className="spec-content">
                            <span className="spec-label">Mileage</span>
                            <span className="spec-value">{vehicle.mileage.toLocaleString()} mi</span>
                        </div>
                    </div>
                </div>

                <div className="vehicle-features">
                    <h4>Key Features</h4>
                    <div className="features-list">
                        {vehicle.features.slice(0, 6).map((feature, index) => (
                            <span key={index} className="feature-tag">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {showActions && (
                    <div className="vehicle-actions">
                        <Link to={`/vehicle/${vehicle.vin}/recalls`} className="btn btn-secondary">
                            <span>⚠️</span>
                            Recalls
                        </Link>
                        <Link to={`/vehicle/${vehicle.vin}/service`} className="btn btn-secondary">
                            <span>🔧</span>
                            Service Logs
                        </Link>
                        <Link to={`/vehicle/${vehicle.vin}/diagnosis`} className="btn btn-primary">
                            <span>🩺</span>
                            Diagnose Issues
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleCard;
