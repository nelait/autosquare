import React, { useState } from 'react';
import './ServiceLogsList.css';

const ServiceLogsList = ({ logs }) => {
    const [filter, setFilter] = useState('all');
    const [expandedLog, setExpandedLog] = useState(null);

    if (!logs || logs.length === 0) {
        return (
            <div className="service-logs-empty glass-card">
                <span className="empty-icon">📋</span>
                <h3>No Service Records</h3>
                <p>No service history found for this vehicle.</p>
            </div>
        );
    }

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.type === filter);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'maintenance': return '🔧';
            case 'repair': return '🛠️';
            case 'recall': return '⚠️';
            default: return '📋';
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'maintenance': return 'type-maintenance';
            case 'repair': return 'type-repair';
            case 'recall': return 'type-recall';
            default: return '';
        }
    };

    const totalCost = logs.reduce((sum, log) => sum + log.totalCost, 0);

    return (
        <div className="service-logs-container">
            <div className="service-logs-header">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({logs.length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'maintenance' ? 'active' : ''}`}
                        onClick={() => setFilter('maintenance')}
                    >
                        🔧 Maintenance
                    </button>
                    <button
                        className={`filter-tab ${filter === 'repair' ? 'active' : ''}`}
                        onClick={() => setFilter('repair')}
                    >
                        🛠️ Repairs
                    </button>
                    <button
                        className={`filter-tab ${filter === 'recall' ? 'active' : ''}`}
                        onClick={() => setFilter('recall')}
                    >
                        ⚠️ Recalls
                    </button>
                </div>

                <div className="service-summary">
                    <span className="summary-label">Total Service Cost:</span>
                    <span className="summary-value">${totalCost.toLocaleString()}</span>
                </div>
            </div>

            <div className="service-logs-timeline">
                {filteredLogs.map((log, index) => (
                    <div
                        key={log.id}
                        className={`service-log-item glass-card ${getTypeClass(log.type)} ${expandedLog === log.id ? 'expanded' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div
                            className="log-main"
                            onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        >
                            <div className="log-icon">{getTypeIcon(log.type)}</div>

                            <div className="log-content">
                                <div className="log-header">
                                    <h4 className="log-title">{log.category}</h4>
                                    <span className="log-date">
                                        {new Date(log.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <p className="log-description">{log.description}</p>

                                <div className="log-meta">
                                    <span className="log-mileage">
                                        <strong>{log.mileage.toLocaleString()}</strong> mi
                                    </span>
                                    <span className="log-dealer">{log.dealer}</span>
                                    {log.totalCost > 0 && (
                                        <span className="log-cost">${log.totalCost.toFixed(2)}</span>
                                    )}
                                    {log.totalCost === 0 && log.type === 'recall' && (
                                        <span className="log-cost free">FREE</span>
                                    )}
                                </div>
                            </div>

                            <div className="log-expand-icon">
                                {expandedLog === log.id ? '▼' : '▶'}
                            </div>
                        </div>

                        {expandedLog === log.id && (
                            <div className="log-details animate-fade-in">
                                <div className="details-section">
                                    <h5>Parts & Services</h5>
                                    <table className="parts-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Part Number</th>
                                                <th>Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {log.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.name}</td>
                                                    <td><code>{item.partNumber}</code></td>
                                                    <td>${item.cost.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="labor-row">
                                                <td>Labor ({log.laborHours} hrs @ ${log.laborRate}/hr)</td>
                                                <td>-</td>
                                                <td>${(log.laborHours * log.laborRate).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {log.notes && (
                                    <div className="details-section">
                                        <h5>Technician Notes</h5>
                                        <p className="tech-notes">{log.notes}</p>
                                    </div>
                                )}

                                <div className="details-footer">
                                    <span>Technician: {log.technician}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceLogsList;
