import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './pages/Dashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Import the new admin dashboard

function App() {
  // Authentication state - check localStorage on mount
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // User role state - check localStorage on mount
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  // Save authentication state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  // Save user role to localStorage whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  // Function to handle login
  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role); // role should be 'tenant', 'landlord', or 'admin'
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Force navigation to landing page
    window.location.href = '/';
  };

  // Component to route to correct dashboard based on role
  const DashboardRouter = () => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }

    if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (userRole === 'landlord') {
      return <Navigate to="/landlord-dashboard" replace />;
    }

    if (userRole === 'tenant') {
      return <Navigate to="/tenant-dashboard" replace />;
    }

    // If no role is set, redirect to signin
    return <Navigate to="/signin" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes - redirect to appropriate dashboard if already authenticated */}
        <Route 
          path="/signin" 
          element={
            isAuthenticated ? 
            <DashboardRouter /> : 
            <SignIn onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
            <DashboardRouter /> : 
            <SignUp onLogin={handleLogin} />
          } 
        />
        
        {/* Protected Routes - Tenant Dashboard */}
        <Route 
          path="/tenant-dashboard" 
          element={
            isAuthenticated && userRole === 'tenant' ? 
            <Dashboard onLogout={handleLogout} /> : 
            <Navigate to="/signin" replace />
          } 
        />

        {/* Protected Routes - Landlord Dashboard */}
        <Route 
          path="/landlord-dashboard" 
          element={
            isAuthenticated && userRole === 'landlord' ? 
            <LandlordDashboard onLogout={handleLogout} /> : 
            <Navigate to="/signin" replace />
          } 
        />

        {/* Protected Routes - Admin Dashboard */}
        <Route 
          path="/admin-dashboard" 
          element={
            isAuthenticated && userRole === 'admin' ? 
            <AdminDashboard onLogout={handleLogout} /> : 
            <Navigate to="/signin" replace />
          } 
        />

        {/* Generic dashboard route - redirects based on role */}
        <Route 
          path="/dashboard" 
          element={<DashboardRouter />}
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;