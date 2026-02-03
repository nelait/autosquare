// Protected Route Component - Redirects unauthenticated users to login
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="auth-loading">
                <div className="auth-loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        // Save the attempted URL for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated, render the protected content
    return children;
};

export default ProtectedRoute;
