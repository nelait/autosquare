import React from 'react';
import './RecallsList.css';

const RecallsList = ({ recalls, showVin = false }) => {
    if (!recalls || recalls.length === 0) {
        return (
            <div className="recalls-empty glass-card">
                <span className="empty-icon">✅</span>
                <h3>No Recalls Found</h3>
                <p>This vehicle has no open or completed recalls on record.</p>
            </div>
        );
    }

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'critical': return 'badge-danger';
            case 'high': return 'badge-warning';
            case 'moderate': return 'badge-info';
            default: return 'badge-info';
        }
    };

    const getStatusClass = (status) => {
        return status === 'completed' ? 'badge-success' : 'badge-warning';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        // Handle both formats: "30/01/2024" (NHTSA) and ISO dates
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                return `${parts[1]}/${parts[0]}/${parts[2]}`; // Convert DD/MM/YYYY to MM/DD/YYYY
            }
        }
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="recalls-list">
            {recalls.map((recall, index) => (
                <div
                    key={recall.id || `recall-${index}`}
                    className="recall-item glass-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="recall-header">
                        <div className="recall-badges">
                            <span className={`badge ${getStatusClass(recall.status)}`}>
                                {recall.status === 'completed' ? '✓ Completed' : '⚠ Open'}
                            </span>
                            {recall.severity && (
                                <span className={`badge ${getSeverityClass(recall.severity)}`}>
                                    {recall.severity.charAt(0).toUpperCase() + recall.severity.slice(1)}
                                </span>
                            )}
                        </div>
                        <span className="recall-campaign">
                            Campaign: {recall.campaignNumber || 'N/A'}
                        </span>
                    </div>

                    <div className="recall-content">
                        <h3 className="recall-title">
                            <span className="recall-component">{recall.component || 'Unknown Component'}</span>
                        </h3>

                        {/* Use summary for NHTSA or description for mock data */}
                        <p className="recall-description">
                            {recall.summary || recall.description || 'No description available.'}
                        </p>

                        {/* Show consequence if available (NHTSA data) */}
                        {recall.consequence && (
                            <div className="recall-consequence">
                                <h4>
                                    <span>⚠️</span>
                                    Risk
                                </h4>
                                <p>{recall.consequence}</p>
                            </div>
                        )}

                        {recall.remedy && (
                            <div className="recall-remedy">
                                <h4>
                                    <span>🔧</span>
                                    Remedy
                                </h4>
                                <p>{recall.remedy}</p>
                            </div>
                        )}
                    </div>

                    <div className="recall-footer">
                        <div className="recall-meta">
                            <span>
                                <strong>Report Date:</strong> {formatDate(recall.reportDate || recall.recallDate)}
                            </span>
                            {(recall.affectedVehicles || recall.affectedUnits) > 0 && (
                                <span>
                                    <strong>Affected Units:</strong> {(recall.affectedVehicles || recall.affectedUnits || 0).toLocaleString()}
                                </span>
                            )}
                            {recall.manufacturer && (
                                <span>
                                    <strong>Manufacturer:</strong> {recall.manufacturer}
                                </span>
                            )}
                        </div>

                        {recall.status === 'open' && (
                            <button className="btn btn-accent btn-sm">
                                Schedule Service
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecallsList;
