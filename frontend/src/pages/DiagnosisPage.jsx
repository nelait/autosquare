import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DiagnosisInput from '../components/diagnosis/DiagnosisInput';
import ProblemsList from '../components/diagnosis/ProblemsList';
import { getVehicleByVin } from '../data/vehicles';
import { lookupVehicle } from '../services/mcpClient';
import './DiagnosisPage.css';

const DiagnosisPage = () => {
    const { vin: urlVin } = useParams();
    const [inputVin, setInputVin] = useState(urlVin || '');
    const [vehicle, setVehicle] = useState(null);
    const [problems, setProblems] = useState([]);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [analyzedSymptoms, setAnalyzedSymptoms] = useState('');
    const [recallDataUsed, setRecallDataUsed] = useState(false);
    const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
    const [vinError, setVinError] = useState('');

    // Load vehicle data when VIN changes
    useEffect(() => {
        const loadVehicle = async () => {
            if (!inputVin || inputVin.length !== 17) {
                setVehicle(null);
                return;
            }

            setIsLoadingVehicle(true);
            setVinError('');

            // Try mock data first
            const mockVehicle = getVehicleByVin(inputVin);
            if (mockVehicle) {
                setVehicle(mockVehicle);
                setIsLoadingVehicle(false);
                return;
            }

            // Try real API
            try {
                const result = await lookupVehicle(inputVin);
                if (result?.vehicle) {
                    setVehicle({
                        vin: inputVin,
                        year: result.vehicle.year,
                        make: result.vehicle.make,
                        model: result.vehicle.model,
                        engine: result.vehicle.engine
                    });
                } else {
                    setVehicle(null);
                    setVinError('Could not find vehicle data for this VIN');
                }
            } catch (err) {
                console.error('Error loading vehicle:', err);
                setVinError('Could not load vehicle data');
            }

            setIsLoadingVehicle(false);
        };

        // Debounce the lookup
        const timeoutId = setTimeout(loadVehicle, 500);
        return () => clearTimeout(timeoutId);
    }, [inputVin]);

    const handleAnalysis = (results, symptoms, usedRecallData) => {
        setProblems(results);
        setHasAnalyzed(true);
        setAnalyzedSymptoms(symptoms);
        setRecallDataUsed(usedRecallData || false);
    };

    const handleVinChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
        if (value.length <= 17) {
            setInputVin(value);
            setHasAnalyzed(false); // Reset analysis when VIN changes
        }
    };

    const isValidVin = inputVin.length === 17;

    return (
        <div className="diagnosis-page">
            <div className="container">
                <div className="page-header">
                    {urlVin && vehicle && (
                        <Link to={`/vehicle/${urlVin}`} className="back-btn">
                            ← Back to Vehicle
                        </Link>
                    )}
                    <div className="header-content">
                        <h1>
                            <span>🩺</span>
                            AI Vehicle Diagnosis
                        </h1>
                        <p>Describe your vehicle's symptoms and let our AI identify potential problems</p>
                    </div>
                </div>

                {/* VIN Input Section */}
                <div className="vin-input-section glass-card">
                    <label htmlFor="diagnosis-vin" className="vin-label">
                        Vehicle VIN
                        <span className="vin-required">(Required for recall-aware diagnosis)</span>
                    </label>
                    <div className="vin-input-wrapper">
                        <input
                            type="text"
                            id="diagnosis-vin"
                            value={inputVin}
                            onChange={handleVinChange}
                            placeholder="Enter 17-character VIN"
                            className={`vin-input ${vinError ? 'has-error' : ''} ${isValidVin && vehicle ? 'is-valid' : ''}`}
                            maxLength={17}
                        />
                        <span className="vin-counter">{inputVin.length}/17</span>
                        {isLoadingVehicle && <span className="vin-loading">🔍</span>}
                    </div>
                    {vinError && <p className="vin-error">{vinError}</p>}

                    {/* Vehicle Preview */}
                    {vehicle && (
                        <div className="vehicle-preview">
                            <span className="preview-icon">✓</span>
                            <span className="preview-text">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                        </div>
                    )}

                    {!isValidVin && inputVin.length > 0 && (
                        <p className="vin-hint">VIN must be exactly 17 characters</p>
                    )}
                </div>

                <div className="diagnosis-container glass-card">
                    <DiagnosisInput
                        onAnalyze={handleAnalysis}
                        vehicleInfo={vehicle}
                        vehicleVin={isValidVin ? inputVin : null}
                        disabled={!isValidVin}
                    />
                </div>

                {hasAnalyzed && (
                    <div className="results-section">
                        {/* Recall Data Badge */}
                        <div className={`recall-data-badge ${recallDataUsed ? 'has-recall-data' : 'no-recall-data'}`}>
                            {recallDataUsed ? (
                                <>
                                    <span className="badge-icon">✓</span>
                                    <span>Recall Data Considered</span>
                                </>
                            ) : (
                                <>
                                    <span className="badge-icon">○</span>
                                    <span>Recall Data N/A</span>
                                </>
                            )}
                        </div>

                        {analyzedSymptoms && (
                            <div className="analyzed-symptoms">
                                <span className="symptoms-label">Analyzed symptoms:</span>
                                <span className="symptoms-text">"{analyzedSymptoms}"</span>
                            </div>
                        )}
                        <ProblemsList
                            problems={problems}
                            vehicleVin={inputVin}
                            vehicleInfo={vehicle}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosisPage;
