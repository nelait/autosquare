// Authentication Context for React
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, logout, getIdToken } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const getToken = async () => {
        if (!user) return null;
        return getIdToken();
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        logout: handleLogout,
        getToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
