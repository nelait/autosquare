import React from 'react';
import VinInput from '../components/vin/VinInput';
import './VinLookupPage.css';

const VinLookupPage = () => {
    return (
        <div className="vin-lookup-page">
            <div className="container">
                <div className="lookup-header">
                    <h1>
                        <span>🔍</span>
                        Vehicle Lookup
                    </h1>
                    <p>Enter a VIN to access complete vehicle information, recalls, and service history</p>
                </div>

                <div className="lookup-card glass-card">
                    <VinInput />
                </div>

                <div className="vin-info-section">
                    <h2>What is a VIN?</h2>
                    <p>
                        A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every vehicle.
                        It contains information about the manufacturer, vehicle specifications, and production details.
                    </p>

                    <div className="vin-locations glass-card">
                        <h3>Where to Find Your VIN</h3>
                        <ul>
                            <li><span>📄</span> Vehicle registration or title</li>
                            <li><span>📋</span> Insurance card or policy</li>
                            <li><span>🚗</span> Driver's side dashboard (visible through windshield)</li>
                            <li><span>🚪</span> Driver's side door jamb sticker</li>
                            <li><span>🔧</span> Engine block</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VinLookupPage;
