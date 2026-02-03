import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading } = useAuth();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/my-vehicles', label: 'My Vehicles', icon: '🚗' },
        { path: '/lookup', label: 'VIN Lookup', icon: '🔍' },
        { path: '/diagnosis', label: 'Diagnosis', icon: '🔧' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Get user initials for avatar
    const getInitials = () => {
        if (!user) return '?';
        if (user.displayName) {
            return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return user.email?.charAt(0).toUpperCase() || '?';
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">🚗</span>
                    <span className="logo-text">AutoSquare</span>
                    <span className="logo-badge">AI</span>
                </Link>

                <nav className="nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    {loading ? (
                        <span className="loading-indicator">⟳</span>
                    ) : isAuthenticated ? (
                        <div className="user-menu">
                            <div className="user-avatar">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                                ) : (
                                    getInitials()
                                )}
                            </div>
                            <span className="user-name">{user?.displayName || user?.email?.split('@')[0]}</span>
                            <button className="btn-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
