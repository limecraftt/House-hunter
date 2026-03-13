import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './pages/Dashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const DashboardRouter = () => {
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (userRole === 'landlord') return <Navigate to="/landlord-dashboard" replace />;
    if (userRole === 'tenant') return <Navigate to="/tenant-dashboard" replace />;
    return <Navigate to="/signin" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/signin" element={isAuthenticated ? <DashboardRouter /> : <SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={isAuthenticated ? <DashboardRouter /> : <SignUp onLogin={handleLogin} />} />

        {/* Tenant Dashboard - public, no login needed */}
        <Route
          path="/tenant-dashboard"
          element={<Dashboard onLogout={handleLogout} onLogin={handleLogin} />}
        />

        {/* Landlord Dashboard - protected */}
        <Route
          path="/landlord-dashboard"
          element={
            isAuthenticated && userRole === 'landlord' ?
            <LandlordDashboard onLogout={handleLogout} /> :
            <Navigate to="/signin" replace />
          }
        />

        {/* Admin Dashboard - protected */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && userRole === 'admin' ?
            <AdminDashboard onLogout={handleLogout} /> :
            <Navigate to="/signin" replace />
          }
        />

        {/* Generic dashboard route */}
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;