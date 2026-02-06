import React, { useState, useEffect, useRef } from 'react';
import { hasApiKey, setApiKey, getApiKey, analyzeVehicleSymptoms } from '../../services/openaiService';
import { analyzeSymptoms as analyzeSymptomsMock } from '../../data/diagnosisData';
import './DiagnosisInput.css';

const DiagnosisInput = ({ onAnalyze, vehicleInfo, vehicleVin }) => {
    const [symptoms, setSymptoms] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [apiKey, setApiKeyState] = useState('');
    const [useAI, setUseAI] = useState(true);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setVoiceSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let transcript = '';
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setSymptoms(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }

        setApiKeyState(getApiKey());

        return () => {
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, []);

    const toggleVoiceInput = () => {
        if (!voiceSupported) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setError('');
        setIsAnalyzing(true);

        try {
            let results;
            let recallDataUsed = false;
            let serviceLogsUsed = false;

            if (useAI) {
                // Use MCP backend - includes NHTSA/recall context when VIN provided
                const { diagnoseVehicle } = await import('../../services/mcpClient');
                const response = await diagnoseVehicle(symptoms, vehicleInfo, vehicleVin);

                if (response?.problems) {
                    results = response.problems.map((p, i) => ({
                        ...p,
                        id: p.id || `ai-${Date.now()}-${i}`,
                        source: 'openai',
                        matchedKeywords: [symptoms.split(' ')[0]],
                        adjustedConfidence: p.confidence
                    }));
                    recallDataUsed = response.recallDataUsed || false;
                    serviceLogsUsed = response.serviceLogsUsed || false;
                } else {
                    throw new Error('No diagnosis results received');
                }
            } else {
                // Use mock data fallback
                await new Promise(resolve => setTimeout(resolve, 1000));
                results = analyzeSymptomsMock(symptoms);
                results = results.map(p => ({ ...p, source: 'mock' }));
            }

            if (onAnalyze) {
                onAnalyze(results, symptoms, recallDataUsed, serviceLogsUsed);
            }
        } catch (err) {
            setError(err.message || 'Failed to analyze symptoms. Backend may be unavailable.');
            console.error('Diagnosis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveApiKey = () => {
        setApiKey(apiKey);
        setShowApiKeyModal(false);
    };

    const exampleSymptoms = [
        "Check engine light is on and rough idle",
        "Car won't start in the morning",
        "Brakes are squeaking loudly",
        "AC blowing warm air",
        "Overheating in traffic"
    ];

    return (
        <div className="diagnosis-input-container">
            <div className="diagnosis-header">
                <div className="ai-badge">
                    <span className="ai-icon">🤖</span>
                    <span>AI-Powered Diagnosis</span>
                    {hasApiKey() && <span className="api-connected">● Connected</span>}
                </div>
                <p className="diagnosis-description">
                    Describe your vehicle's symptoms and our AI will analyze potential problems.
                </p>
            </div>

            <div className="ai-toggle-section">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    <span>Use AI-powered diagnosis (Cloud Backend)</span>
                </label>
            </div>

            <form onSubmit={handleSubmit} className="diagnosis-form">
                <div className="symptoms-input-wrapper">
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe what's wrong with your vehicle... (e.g., 'Check engine light is on and the car shakes when idling')"
                        className="symptoms-textarea"
                        rows={4}
                    />

                    {isListening && (
                        <div className="listening-indicator">
                            <div className="voice-animation">
                                <span className="voice-bar"></span>
                                <span className="voice-bar"></span>
                                <span className="voice-bar"></span>
                                <span className="voice-bar"></span>
                                <span className="voice-bar"></span>
                            </div>
                            <span>Listening...</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="diagnosis-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <div className="diagnosis-actions">
                    <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`btn btn-secondary voice-btn ${isListening ? 'listening' : ''}`}
                        disabled={!voiceSupported}
                    >
                        {isListening ? <><span>⏹️</span><span>Stop</span></> : <><span>🎤</span><span>Voice Input</span></>}
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg analyze-btn"
                        disabled={!symptoms.trim() || isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <><span className="animate-spin">⟳</span><span>Analyzing...</span></>
                        ) : (
                            <><span>🔍</span><span>Analyze Symptoms</span></>
                        )}
                    </button>
                </div>
            </form>

            <div className="examples-section">
                <h4>Try these examples:</h4>
                <div className="example-chips">
                    {exampleSymptoms.map((example, index) => (
                        <button key={index} type="button" className="example-chip" onClick={() => setSymptoms(example)}>
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {/* API Key Modal */}
            {showApiKeyModal && (
                <div className="modal-overlay" onClick={() => setShowApiKeyModal(false)}>
                    <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
                        <h3>🔑 OpenAI API Configuration</h3>
                        <p>Enter your OpenAI API key to enable real AI-powered diagnostics.</p>

                        <div className="api-key-input-group">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKeyState(e.target.value)}
                                placeholder="sk-..."
                                className="input"
                            />
                        </div>

                        <p className="api-key-note">
                            Your API key is stored locally in your browser and never sent to our servers.
                            Get your key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com</a>
                        </p>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowApiKeyModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveApiKey}>Save Key</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosisInput;
