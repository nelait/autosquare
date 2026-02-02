import React from 'react';
import { Link } from 'react-router-dom';
import './ProblemsList.css';

const ProblemsList = ({ problems, vehicleVin, vehicleInfo }) => {
    if (!problems || problems.length === 0) {
        return (
            <div className="problems-empty glass-card">
                <span className="empty-icon">🔍</span>
                <h3>No Problems Identified</h3>
                <p>Based on the symptoms provided, we couldn't identify specific problems. Try describing your issues in more detail.</p>
            </div>
        );
    }

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'critical': return 'severity-critical';
            case 'high': return 'severity-high';
            case 'moderate': return 'severity-moderate';
            case 'low': return 'severity-low';
            default: return 'severity-moderate';
        }
    };

    const getConfidenceClass = (confidence) => {
        if (confidence >= 80) return 'confidence-high';
        if (confidence >= 60) return 'confidence-medium';
        return 'confidence-low';
    };

    // Serialize problem data for the service details page
    const serializeProblem = (problem) => {
        return encodeURIComponent(JSON.stringify({
            id: problem.id,
            name: problem.name,
            description: problem.description,
            severity: problem.severity,
            confidence: problem.confidence || problem.adjustedConfidence,
            symptoms: problem.symptoms,
            diagnosticSteps: problem.diagnosticSteps,
            estimatedCost: problem.estimatedCost,
            estimatedTime: problem.estimatedTime,
            source: problem.source
        }));
    };

    return (
        <div className="problems-container">
            <div className="problems-header">
                <h3>
                    <span>🔧</span>
                    Potential Problems Identified
                </h3>
                <p className="problems-subtitle">
                    {problems[0]?.source === 'openai' ? (
                        <span className="ai-source">🤖 Analyzed by OpenAI</span>
                    ) : (
                        <span className="mock-source">📊 Based on pattern matching</span>
                    )}
                    {' '} — Found {problems.length} possible issue{problems.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="problems-list">
                {problems.map((problem, index) => (
                    <div
                        key={problem.id || index}
                        className={`problem-item glass-card ${getSeverityClass(problem.severity)}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="problem-header">
                            <div className="problem-rank">#{index + 1}</div>
                            <div className="problem-badges">
                                <span className={`confidence-badge ${getConfidenceClass(problem.confidence || problem.adjustedConfidence)}`}>
                                    {problem.confidence || problem.adjustedConfidence}% Match
                                </span>
                                <span className={`severity-badge ${getSeverityClass(problem.severity)}`}>
                                    {(problem.severity || 'moderate').charAt(0).toUpperCase() + (problem.severity || 'moderate').slice(1)} Severity
                                </span>
                            </div>
                        </div>

                        <div className="problem-content">
                            <h4 className="problem-name">{problem.name}</h4>
                            <p className="problem-description">{problem.description}</p>

                            {problem.symptoms && problem.symptoms.length > 0 && (
                                <div className="problem-symptoms">
                                    <span className="symptoms-label">Common symptoms:</span>
                                    <ul className="symptoms-list">
                                        {problem.symptoms.slice(0, 4).map((symptom, i) => (
                                            <li key={i}>{symptom}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {problem.diagnosticSteps && problem.diagnosticSteps.length > 0 && (
                                <div className="diagnostic-steps-preview">
                                    <span className="steps-label">🔍 Diagnostic steps available</span>
                                </div>
                            )}

                            <div className="problem-estimate">
                                <div className="estimate-item">
                                    <span className="estimate-label">Estimated Cost</span>
                                    <span className="estimate-value">
                                        ${problem.estimatedCost?.min || 100} - ${problem.estimatedCost?.max || 500}
                                    </span>
                                </div>
                                <div className="estimate-item">
                                    <span className="estimate-label">Repair Time</span>
                                    <span className="estimate-value">{problem.estimatedTime || '1-2 hours'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="problem-actions">
                            <Link
                                to={`/service-details/${problem.id || `ai-${index}`}?vin=${vehicleVin || ''}&data=${serializeProblem(problem)}`}
                                className="btn btn-accent fix-me-btn"
                            >
                                <span>🔧</span>
                                <span>Fix Me</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemsList;
