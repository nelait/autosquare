import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VinInput.css';

const VinInput = ({ onVinSubmit, initialValue = '' }) => {
    const [vin, setVin] = useState(initialValue);
    const [isListening, setIsListening] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [voiceSupported, setVoiceSupported] = useState(false);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setVoiceSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                // Clean up VIN from speech (remove spaces, convert to uppercase)
                const cleanVin = transcript.replace(/\s+/g, '').toUpperCase();
                setVin(cleanVin);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setError('Voice input failed. Please try again or type manually.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const handleVinChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length <= 17) {
            setVin(value);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (vin.length !== 17) {
            setError('VIN must be exactly 17 characters');
            return;
        }
        if (onVinSubmit) {
            onVinSubmit(vin);
        } else {
            navigate(`/vehicle/${vin}`);
        }
    };

    const toggleVoiceInput = () => {
        if (!voiceSupported) {
            setError('Voice input is not supported in this browser');
            return;
        }

        if (isListening) {
            recognitionRef.current.abort();
            setIsListening(false);
        } else {
            setError('');
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleScan = () => {
        setIsScanning(true);
        setError('');

        // Simulate scanning process
        setTimeout(() => {
            // For demo, randomly select a sample VIN
            const sampleVins = [
                '1HGBH41JXMN109186',
                '5YJSA1E26MF123456',
                '1G1YY22G965109876',
                'WVWZZZ3CZWE123789',
                'WBAJA5C58KB123456'
            ];
            const randomVin = sampleVins[Math.floor(Math.random() * sampleVins.length)];
            setVin(randomVin);
            setIsScanning(false);
        }, 2000);
    };

    return (
        <div className="vin-input-container">
            <form onSubmit={handleSubmit} className="vin-form">
                <div className="vin-input-wrapper">
                    <div className="vin-input-field">
                        <input
                            type="text"
                            value={vin}
                            onChange={handleVinChange}
                            placeholder="Enter 17-character VIN"
                            className="input input-lg vin-text-input"
                            maxLength={17}
                        />
                        <span className="vin-counter">{vin.length}/17</span>
                    </div>

                    <div className="vin-input-actions">
                        <button
                            type="button"
                            onClick={toggleVoiceInput}
                            className={`btn btn-icon btn-secondary voice-btn ${isListening ? 'listening' : ''}`}
                            title="Voice input"
                            disabled={!voiceSupported}
                        >
                            {isListening ? (
                                <div className="voice-animation">
                                    <span className="voice-bar"></span>
                                    <span className="voice-bar"></span>
                                    <span className="voice-bar"></span>
                                    <span className="voice-bar"></span>
                                    <span className="voice-bar"></span>
                                </div>
                            ) : (
                                <span>🎤</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleScan}
                            className={`btn btn-icon btn-secondary scan-btn ${isScanning ? 'scanning' : ''}`}
                            title="Scan VIN"
                            disabled={isScanning}
                        >
                            {isScanning ? (
                                <span className="animate-spin">⟳</span>
                            ) : (
                                <span>📷</span>
                            )}
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg submit-btn"
                            disabled={vin.length !== 17}
                        >
                            <span>🔍</span>
                            <span>Look Up</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="vin-error animate-fade-in">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {isListening && (
                    <div className="voice-status animate-fade-in">
                        <span className="voice-pulse"></span>
                        Listening... Speak your VIN clearly
                    </div>
                )}

                {isScanning && (
                    <div className="scan-status animate-fade-in">
                        <span>📷</span>
                        Scanning for VIN... (Demo mode)
                    </div>
                )}
            </form>

            <div className="vin-help">
                <p>💡 The VIN can be found on your registration, insurance card, or on the driver's side dashboard.</p>
            </div>
        </div>
    );
};

export default VinInput;
