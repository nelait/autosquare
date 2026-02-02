import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getRepairProcedure as getOpenAIRepairProcedure, hasApiKey } from '../services/openaiService';
import { getProblemById, getRepairProcedure as getMockRepairProcedure } from '../data/diagnosisData';
import { getVehicleByVin } from '../data/vehicles';
import './ServiceDetailsPage.css';

const ServiceDetailsPage = () => {
    const { problemId } = useParams();
    const [searchParams] = useSearchParams();
    const vin = searchParams.get('vin');
    const problemData = searchParams.get('data');
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [procedure, setProcedure] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProcedure, setLoadingProcedure] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                // Try to get problem from URL data first (AI-generated)
                if (problemData) {
                    const parsed = JSON.parse(decodeURIComponent(problemData));
                    setProblem(parsed);

                    // Get vehicle if VIN provided
                    if (vin) {
                        const vehicleData = getVehicleByVin(vin);
                        setVehicle(vehicleData);
                    }

                    // If from OpenAI, fetch AI-generated procedure
                    if (parsed.source === 'openai' && hasApiKey()) {
                        setLoadingProcedure(true);
                        try {
                            const proc = await getOpenAIRepairProcedure(
                                parsed.name,
                                parsed.description,
                                vehicle
                            );
                            setProcedure(proc);
                        } catch (err) {
                            console.error('Failed to get AI procedure:', err);
                            // Fall back to showing diagnosticSteps from problem
                            setProcedure({
                                title: `Repair: ${parsed.name}`,
                                difficulty: 'Intermediate',
                                estimatedTime: parsed.estimatedTime || '1-2 hours',
                                tools: ['OBD-II Scanner', 'Basic Hand Tools', 'Multimeter'],
                                parts: [],
                                steps: parsed.diagnosticSteps || ['Consult a professional mechanic'],
                                safetyWarnings: ['Always wear safety glasses', 'Work in a well-ventilated area'],
                                tips: ['Document all findings for reference']
                            });
                        } finally {
                            setLoadingProcedure(false);
                        }
                    } else {
                        // Try to get mock procedure
                        const mockProc = getMockRepairProcedure(parsed.id);
                        if (mockProc) {
                            setProcedure(mockProc);
                        }
                    }
                } else {
                    // Fall back to mock data lookup
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const problemDataFromMock = getProblemById(problemId);
                    const procedureData = getMockRepairProcedure(problemId);

                    if (vin) {
                        const vehicleData = getVehicleByVin(vin);
                        setVehicle(vehicleData);
                    }

                    setProblem(problemDataFromMock);
                    setProcedure(procedureData);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load problem details');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [problemId, vin, problemData]);

    // Function to fetch AI procedure on demand
    const fetchAIProcedure = async () => {
        if (!problem || !hasApiKey()) return;

        setLoadingProcedure(true);
        setError('');

        try {
            const proc = await getOpenAIRepairProcedure(
                problem.name,
                problem.description,
                vehicle
            );
            setProcedure(proc);
        } catch (err) {
            setError('Failed to generate repair procedure: ' + err.message);
        } finally {
            setLoadingProcedure(false);
        }
    };

    if (loading) {
        return (
            <div className="service-details-page loading-state">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <p>Loading repair details...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="service-details-page error-state">
                <div className="error-container glass-card">
                    <span className="error-icon">🔍</span>
                    <h2>Problem Not Found</h2>
                    <p>We couldn't find details for this problem.</p>
                    <button onClick={() => navigate(-1)} className="btn btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="service-details-page">
            <div className="container">
                <div className="page-header">
                    <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
                    <div className="page-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        {vin && <><Link to={`/vehicle/${vin}/diagnosis`}>Diagnosis</Link><span>/</span></>}
                        <span>Service Details</span>
                    </div>
                </div>

                <div className="problem-overview glass-card">
                    <div className="overview-header">
                        <span className="problem-icon">🔧</span>
                        <div>
                            <div className="problem-title-row">
                                <h1>{problem.name}</h1>
                                {problem.source === 'openai' && (
                                    <span className="ai-badge-small">🤖 AI Generated</span>
                                )}
                            </div>
                            <p>{problem.description}</p>
                        </div>
                    </div>

                    <div className="overview-stats">
                        <div className="stat">
                            <span className="stat-label">Severity</span>
                            <span className={`stat-value severity-${problem.severity || 'moderate'}`}>
                                {(problem.severity || 'moderate').charAt(0).toUpperCase() + (problem.severity || 'moderate').slice(1)}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Est. Cost</span>
                            <span className="stat-value">
                                ${problem.estimatedCost?.min || 100} - ${problem.estimatedCost?.max || 500}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Est. Time</span>
                            <span className="stat-value">{problem.estimatedTime || '1-2 hours'}</span>
                        </div>
                        {problem.confidence && (
                            <div className="stat">
                                <span className="stat-label">Confidence</span>
                                <span className="stat-value">{problem.confidence}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {problem.diagnosticSteps && problem.diagnosticSteps.length > 0 && (
                    <div className="diagnostic-section glass-card">
                        <h2><span>🔍</span> Diagnostic Steps</h2>
                        <ol className="steps-list">
                            {problem.diagnosticSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                )}

                {error && (
                    <div className="error-banner glass-card">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {loadingProcedure ? (
                    <div className="procedure-loading glass-card">
                        <div className="loader-inline">
                            <span className="animate-spin">⟳</span>
                            <span>AI is generating repair procedure...</span>
                        </div>
                    </div>
                ) : procedure ? (
                    <>
                        <div className="repair-section glass-card">
                            <h2><span>🛠️</span> {procedure.title}</h2>
                            <div className="repair-meta">
                                <span className="difficulty">Difficulty: {procedure.difficulty}</span>
                                <span className="time">Time: {procedure.estimatedTime}</span>
                            </div>

                            {procedure.tools && procedure.tools.length > 0 && (
                                <div className="tools-section">
                                    <h3>Tools Required</h3>
                                    <ul className="tools-list">
                                        {procedure.tools.map((tool, i) => (
                                            <li key={i}><span>🔧</span> {tool}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="steps-section">
                                <h3>Repair Steps</h3>
                                <ol className="repair-steps">
                                    {procedure.steps.map((step, i) => (
                                        <li key={i}>
                                            <span className="step-number">{i + 1}</span>
                                            <span className="step-text">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {procedure.tips && procedure.tips.length > 0 && (
                                <div className="tips-section">
                                    <h3><span>💡</span> Pro Tips</h3>
                                    <ul className="tips-list">
                                        {procedure.tips.map((tip, i) => (
                                            <li key={i}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {procedure.safetyWarnings && procedure.safetyWarnings.length > 0 && (
                                <div className="warnings-section">
                                    <h3><span>⚠️</span> Safety Warnings</h3>
                                    <ul className="warnings-list">
                                        {procedure.safetyWarnings.map((warning, i) => (
                                            <li key={i}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {procedure.parts && procedure.parts.length > 0 && (
                            <div className="parts-section glass-card">
                                <h2><span>📦</span> Required Parts</h2>
                                <div className="parts-grid">
                                    {procedure.parts.map((part, i) => (
                                        <div key={i} className="part-card">
                                            <div className="part-info">
                                                <h4>{part.name}</h4>
                                                {part.partNumber && <code>{part.partNumber}</code>}
                                            </div>
                                            <div className="part-price">${(part.avgPrice || 0).toFixed(2)}</div>
                                            {part.link && (
                                                <a href={part.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                                                    Find Part
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-procedure glass-card">
                        <span className="no-procedure-icon">📋</span>
                        <h3>Repair Procedure Not Available</h3>
                        <p>Detailed repair steps are not yet available for this problem.</p>
                        {hasApiKey() && (
                            <button onClick={fetchAIProcedure} className="btn btn-primary">
                                <span>🤖</span> Generate with AI
                            </button>
                        )}
                    </div>
                )}

                <div className="cta-section glass-card">
                    <div className="cta-content">
                        <h3>Need Professional Help?</h3>
                        <p>Find a certified technician near you</p>
                    </div>
                    <button className="btn btn-accent btn-lg">
                        <span>📍</span> Find Service Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsPage;
