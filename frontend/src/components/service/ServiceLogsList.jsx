import React, { useState } from 'react';
import './ServiceLogsList.css';

const ServiceLogsList = ({ logs, onDelete }) => {
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

    // Handle both API format (category) and mock format (type)
    const getLogType = (log) => log.category || log.type || 'other';
    const getLogCost = (log) => log.cost || log.totalCost || 0;
    const getLogMileage = (log) => log.mileage || 0;

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => getLogType(log) === filter);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'maintenance': return '🔧';
            case 'repair': return '🛠️';
            case 'recall': return '⚠️';
            case 'inspection': return '🔍';
            default: return '📋';
        }
    };

    const getTypeClass = (type) => {
        switch (type) {
            case 'maintenance': return 'type-maintenance';
            case 'repair': return 'type-repair';
            case 'recall': return 'type-recall';
            case 'inspection': return 'type-inspection';
            default: return '';
        }
    };

    const totalCost = logs.reduce((sum, log) => sum + getLogCost(log), 0);

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

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

                {totalCost > 0 && (
                    <div className="service-summary">
                        <span className="summary-label">Total Service Cost:</span>
                        <span className="summary-value">${totalCost.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="service-logs-timeline">
                {filteredLogs.map((log, index) => {
                    const logType = getLogType(log);
                    const logCost = getLogCost(log);
                    const logMileage = getLogMileage(log);
                    const isExpanded = expandedLog === log.id;

                    return (
                        <div
                            key={log.id || index}
                            className={`service-log-item glass-card ${getTypeClass(logType)} ${isExpanded ? 'expanded' : ''}`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div
                                className="log-main"
                                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                            >
                                <div className="log-icon">{getTypeIcon(logType)}</div>

                                <div className="log-content">
                                    <div className="log-header">
                                        <h4 className="log-title">
                                            {logType.charAt(0).toUpperCase() + logType.slice(1)}
                                        </h4>
                                        <span className="log-date">
                                            {formatDate(log.date)}
                                        </span>
                                    </div>

                                    <p className="log-description">{log.description}</p>

                                    <div className="log-meta">
                                        {logMileage > 0 && (
                                            <span className="log-mileage">
                                                <strong>{logMileage.toLocaleString()}</strong> mi
                                            </span>
                                        )}
                                        {log.dealer && <span className="log-dealer">{log.dealer}</span>}
                                        {logCost > 0 && (
                                            <span className="log-cost">${logCost.toFixed(2)}</span>
                                        )}
                                        {logCost === 0 && logType === 'recall' && (
                                            <span className="log-cost free">FREE</span>
                                        )}
                                        {log.extractedFrom && (
                                            <span className={`log-source ${log.extractedFrom}`}>
                                                {log.extractedFrom === 'upload' ? '📄' : '✏️'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="log-actions">
                                    {onDelete && (
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(log.id);
                                            }}
                                            title="Delete log"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                    {log.items && (
                                        <span className="log-expand-icon">
                                            {isExpanded ? '▼' : '▶'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Expanded details - only for mock data with items */}
                            {isExpanded && log.items && (
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
                                                {log.laborHours && (
                                                    <tr className="labor-row">
                                                        <td>Labor ({log.laborHours} hrs @ ${log.laborRate}/hr)</td>
                                                        <td>-</td>
                                                        <td>${(log.laborHours * log.laborRate).toFixed(2)}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {log.notes && (
                                        <div className="details-section">
                                            <h5>Technician Notes</h5>
                                            <p className="tech-notes">{log.notes}</p>
                                        </div>
                                    )}

                                    {log.technician && (
                                        <div className="details-footer">
                                            <span>Technician: {log.technician}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceLogsList;
