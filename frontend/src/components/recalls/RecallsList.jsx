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

    return (
        <div className="recalls-list">
            {recalls.map((recall, index) => (
                <div
                    key={recall.id}
                    className="recall-item glass-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="recall-header">
                        <div className="recall-badges">
                            <span className={`badge ${getStatusClass(recall.status)}`}>
                                {recall.status === 'completed' ? '✓ Completed' : '⚠ Open'}
                            </span>
                            <span className={`badge ${getSeverityClass(recall.severity)}`}>
                                {recall.severity.charAt(0).toUpperCase() + recall.severity.slice(1)}
                            </span>
                        </div>
                        <span className="recall-campaign">
                            Campaign: {recall.campaignNumber}
                        </span>
                    </div>

                    <div className="recall-content">
                        <h3 className="recall-title">
                            <span className="recall-component">{recall.component}</span>
                            {recall.summary}
                        </h3>

                        <p className="recall-description">{recall.description}</p>

                        <div className="recall-remedy">
                            <h4>
                                <span>🔧</span>
                                Remedy
                            </h4>
                            <p>{recall.remedy}</p>
                        </div>
                    </div>

                    <div className="recall-footer">
                        <div className="recall-meta">
                            <span>
                                <strong>Recall Date:</strong> {new Date(recall.recallDate).toLocaleDateString()}
                            </span>
                            <span>
                                <strong>Affected Units:</strong> {recall.affectedUnits.toLocaleString()}
                            </span>
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
