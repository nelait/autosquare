import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DiagnosisInput from '../components/diagnosis/DiagnosisInput';
import ProblemsList from '../components/diagnosis/ProblemsList';
import { getVehicleByVin } from '../data/vehicles';
import './DiagnosisPage.css';

const DiagnosisPage = () => {
    const { vin } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [problems, setProblems] = useState([]);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [analyzedSymptoms, setAnalyzedSymptoms] = useState('');

    useEffect(() => {
        if (vin) {
            const vehicleData = getVehicleByVin(vin);
            setVehicle(vehicleData);
        }
    }, [vin]);

    const handleAnalysis = (results, symptoms) => {
        setProblems(results);
        setHasAnalyzed(true);
        setAnalyzedSymptoms(symptoms);
    };

    return (
        <div className="diagnosis-page">
            <div className="container">
                <div className="page-header">
                    {vin && vehicle && (
                        <Link to={`/vehicle/${vin}`} className="back-btn">
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

                {vehicle && (
                    <div className="vehicle-context glass-card">
                        <span className="context-label">Analyzing for:</span>
                        <span className="context-vehicle">
                            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                        </span>
                        <span className="context-vin">VIN: {vin}</span>
                    </div>
                )}

                {!vin && (
                    <div className="no-vehicle-notice glass-card">
                        <span className="notice-icon">💡</span>
                        <div className="notice-content">
                            <p>For more accurate diagnosis results, consider looking up your vehicle first.</p>
                            <Link to="/lookup" className="btn btn-sm btn-secondary">
                                Enter VIN
                            </Link>
                        </div>
                    </div>
                )}

                <div className="diagnosis-container glass-card">
                    <DiagnosisInput
                        onAnalyze={handleAnalysis}
                        vehicleInfo={vehicle}
                        vehicleVin={vin}
                    />
                </div>

                {hasAnalyzed && (
                    <div className="results-section">
                        {analyzedSymptoms && (
                            <div className="analyzed-symptoms">
                                <span className="symptoms-label">Analyzed symptoms:</span>
                                <span className="symptoms-text">"{analyzedSymptoms}"</span>
                            </div>
                        )}
                        <ProblemsList
                            problems={problems}
                            vehicleVin={vin}
                            vehicleInfo={vehicle}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiagnosisPage;
