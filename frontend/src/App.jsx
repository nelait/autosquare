import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/lookup" element={<VinLookupPage />} />
              <Route path="/vehicle/:vin" element={<VehiclePage />} />
              <Route path="/vehicle/:vin/recalls" element={<RecallsPage />} />
              <Route path="/vehicle/:vin/service" element={<ServiceLogsPage />} />
              <Route path="/vehicle/:vin/diagnosis" element={<DiagnosisPage />} />
              <Route path="/diagnosis" element={<DiagnosisPage />} />
              <Route path="/service-details/:problemId" element={<ServiceDetailsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
