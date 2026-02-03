// My Vehicles Page - Manage saved vehicles
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyVehicles, addMyVehicle, removeMyVehicle, updateVehicleNickname, lookupVehicle } from '../services/mcpClient';
import './MyVehiclesPage.css';

const MyVehiclesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Add vehicle form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVin, setNewVin] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    // Edit nickname
    const [editingVin, setEditingVin] = useState(null);
    const [editNickname, setEditNickname] = useState('');

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const result = await getMyVehicles();
            setVehicles(result.vehicles || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        if (newVin.length !== 17) {
            setAddError('VIN must be 17 characters');
            return;
        }

        setAddLoading(true);
        setAddError('');

        try {
            // First lookup vehicle to get make/model/year
            let vehicleInfo = {};
            try {
                const lookupResult = await lookupVehicle(newVin);
                if (lookupResult.vehicle) {
                    vehicleInfo = {
                        make: lookupResult.vehicle.make,
                        model: lookupResult.vehicle.model,
                        year: lookupResult.vehicle.year,
                    };
                }
            } catch (lookupErr) {
                console.log('Could not lookup vehicle info:', lookupErr);
            }

            const result = await addMyVehicle({
                vin: newVin.toUpperCase(),
                nickname: newNickname || undefined,
                ...vehicleInfo,
            });

            if (result.success) {
                setNewVin('');
                setNewNickname('');
                setShowAddForm(false);
                await loadVehicles();
            } else {
                setAddError(result.error || 'Failed to add vehicle');
            }
        } catch (err) {
            setAddError(err.message);
        } finally {
            setAddLoading(false);
        }
    };

    const handleRemoveVehicle = async (vin) => {
        if (!window.confirm('Remove this vehicle from your collection?')) return;

        try {
            await removeMyVehicle(vin);
            await loadVehicles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateNickname = async (vin) => {
        try {
            await updateVehicleNickname(vin, editNickname);
            setEditingVin(null);
            await loadVehicles();
        } catch (err) {
            setError(err.message);
        }
    };

    const startEditing = (vehicle) => {
        setEditingVin(vehicle.vin);
        setEditNickname(vehicle.nickname || '');
    };

    if (loading) {
        return (
            <div className="my-vehicles-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-vehicles-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>🚗 My Vehicles</h1>
                    <p>Manage your saved vehicles for quick access</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? '✕ Cancel' : '+ Add Vehicle'}
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* Add Vehicle Form */}
            {showAddForm && (
                <div className="add-vehicle-form glass-card">
                    <h3>Add a Vehicle</h3>
                    <form onSubmit={handleAddVehicle}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>VIN (Vehicle Identification Number)</label>
                                <input
                                    type="text"
                                    value={newVin}
                                    onChange={(e) => setNewVin(e.target.value.toUpperCase())}
                                    placeholder="Enter 17-character VIN"
                                    maxLength={17}
                                    required
                                />
                                <span className="char-count">{newVin.length}/17</span>
                            </div>
                            <div className="form-group">
                                <label>Nickname (optional)</label>
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    placeholder="e.g., My Tesla, Family Car"
                                />
                            </div>
                        </div>
                        {addError && <div className="form-error">{addError}</div>}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={addLoading || newVin.length !== 17}
                        >
                            {addLoading ? '⟳ Adding...' : '+ Add Vehicle'}
                        </button>
                    </form>
                </div>
            )}

            {/* Vehicles List */}
            {vehicles.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-icon">🚙</div>
                    <h2>No Vehicles Yet</h2>
                    <p>Add your first vehicle to get started with diagnostics and recall tracking.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Add Your First Vehicle
                    </button>
                </div>
            ) : (
                <div className="vehicles-grid">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.vin} className="vehicle-card glass-card">
                            <div className="vehicle-header">
                                {editingVin === vehicle.vin ? (
                                    <div className="nickname-edit">
                                        <input
                                            type="text"
                                            value={editNickname}
                                            onChange={(e) => setEditNickname(e.target.value)}
                                            placeholder="Enter nickname"
                                            autoFocus
                                        />
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleUpdateNickname(vehicle.vin)}
                                        >
                                            ✓
                                        </button>
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => setEditingVin(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <h3>
                                        {vehicle.nickname || `${vehicle.year || ''} ${vehicle.make || 'Vehicle'} ${vehicle.model || ''}`}
                                        <button
                                            className="btn-icon"
                                            onClick={() => startEditing(vehicle)}
                                            title="Edit nickname"
                                        >
                                            ✏️
                                        </button>
                                    </h3>
                                )}
                            </div>

                            <div className="vehicle-details">
                                {vehicle.year && vehicle.make && (
                                    <p className="vehicle-info">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </p>
                                )}
                                <p className="vehicle-vin">
                                    <span className="label">VIN:</span>
                                    <code>{vehicle.vin}</code>
                                </p>
                                {vehicle.addedAt && (
                                    <p className="vehicle-date">
                                        Added {new Date(vehicle.addedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            <div className="vehicle-actions">
                                <Link
                                    to={`/vehicle/${vehicle.vin}`}
                                    className="btn btn-sm btn-primary"
                                >
                                    View Details
                                </Link>
                                <Link
                                    to={`/vehicle/${vehicle.vin}/diagnosis`}
                                    className="btn btn-sm btn-secondary"
                                >
                                    Diagnose
                                </Link>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveVehicle(vehicle.vin)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick actions */}
            <div className="quick-actions">
                <Link to="/lookup" className="quick-action glass-card">
                    <span className="icon">🔍</span>
                    <span>Look up any VIN</span>
                </Link>
                <Link to="/diagnosis" className="quick-action glass-card">
                    <span className="icon">🔧</span>
                    <span>AI Diagnosis</span>
                </Link>
            </div>
        </div>
    );
};

export default MyVehiclesPage;
