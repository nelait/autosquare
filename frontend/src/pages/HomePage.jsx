import React from 'react';
import { Link } from 'react-router-dom';
import VinInput from '../components/vin/VinInput';
import './HomePage.css';

const HomePage = () => {
    const features = [
        {
            icon: '🔍',
            title: 'VIN Lookup',
            description: 'Instantly identify any vehicle by VIN, voice, or camera scan'
        },
        {
            icon: '⚠️',
            title: 'Recall Alerts',
            description: 'Check for open safety recalls and get notified of new ones'
        },
        {
            icon: '📋',
            title: 'Service History',
            description: 'View complete maintenance and repair records'
        },
        {
            icon: '🤖',
            title: 'AI Diagnostics',
            description: 'Describe symptoms and get intelligent problem analysis'
        }
    ];

    const sampleVehicles = [
        { vin: '1HGBH41JXMN109186', name: '2021 Honda Accord Sport', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80' },
        { vin: '5YJSA1E26MF123456', name: '2022 Tesla Model S', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80' },
        { vin: '1G1YY22G965109876', name: '2023 Chevrolet Corvette', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80' },
    ];

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>🚗</span>
                        <span>AI-Powered Auto Intelligence</span>
                    </div>
                    <h1 className="hero-title">
                        Your Complete
                        <span className="gradient-text"> Vehicle Intelligence </span>
                        Platform
                    </h1>
                    <p className="hero-description">
                        Scan any VIN to instantly access vehicle details, safety recalls, service history,
                        and AI-powered diagnostics. The smartest way to understand your vehicle.
                    </p>

                    <div className="hero-vin-input">
                        <VinInput />
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-glow"></div>
                    <div className="hero-car-image">
                        <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                            alt="Sports car"
                        />
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">Comprehensive tools for vehicle intelligence</p>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card glass-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="demo-section">
                <div className="container">
                    <h2 className="section-title">Try With Sample Vehicles</h2>
                    <p className="section-subtitle">Click on any vehicle to explore the platform</p>

                    <div className="sample-vehicles-grid">
                        {sampleVehicles.map((vehicle, index) => (
                            <Link
                                key={index}
                                to={`/vehicle/${vehicle.vin}`}
                                className="sample-vehicle-card glass-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="sample-vehicle-image">
                                    <img src={vehicle.image} alt={vehicle.name} />
                                </div>
                                <div className="sample-vehicle-info">
                                    <h4>{vehicle.name}</h4>
                                    <code className="sample-vin">{vehicle.vin}</code>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <div className="cta-content">
                            <h2>Ready to Diagnose Your Vehicle?</h2>
                            <p>Use our AI-powered diagnostics to identify issues before they become problems.</p>
                        </div>
                        <Link to="/diagnosis" className="btn btn-accent btn-lg">
                            <span>🩺</span>
                            Start Diagnosis
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
