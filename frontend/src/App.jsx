import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import VinLookupPage from './pages/VinLookupPage';
import VehiclePage from './pages/VehiclePage';
import RecallsPage from './pages/RecallsPage';
import ServiceLogsPage from './pages/ServiceLogsPage';
import DiagnosisPage from './pages/DiagnosisPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyVehiclesPage from './pages/MyVehiclesPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public routes - no authentication required */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes - authentication required */}
              <Route path="/" element={
                <ProtectedRoute><HomePage /></ProtectedRoute>
              } />
              <Route path="/lookup" element={
                <ProtectedRoute><VinLookupPage /></ProtectedRoute>
              } />
              <Route path="/my-vehicles" element={
                <ProtectedRoute><MyVehiclesPage /></ProtectedRoute>
              } />
              <Route path="/vehicle/:vin" element={
                <ProtectedRoute><VehiclePage /></ProtectedRoute>
              } />
              <Route path="/vehicle/:vin/recalls" element={
                <ProtectedRoute><RecallsPage /></ProtectedRoute>
              } />
              <Route path="/vehicle/:vin/service" element={
                <ProtectedRoute><ServiceLogsPage /></ProtectedRoute>
              } />
              <Route path="/vehicle/:vin/diagnosis" element={
                <ProtectedRoute><DiagnosisPage /></ProtectedRoute>
              } />
              <Route path="/diagnosis" element={
                <ProtectedRoute><DiagnosisPage /></ProtectedRoute>
              } />
              <Route path="/service-details/:problemId" element={
                <ProtectedRoute><ServiceDetailsPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
