import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, getProfile } from './lib/supabase';
import Landing from './pages/Landing';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './pages/Dashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await getProfile(session.user.id);
        setUserRole(profile?.role || session.user.user_metadata?.role || null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await getProfile(session.user.id);
        setUserRole(profile?.role || session.user.user_metadata?.role || null);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    window.location.href = '/';
  };

  const isAuthenticated = !!user;

  const DashboardRouter = () => {
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (userRole === 'landlord') return <Navigate to="/landlord-dashboard" replace />;
    if (userRole === 'tenant') return <Navigate to="/tenant-dashboard" replace />;
    return <Navigate to="/signin" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={isAuthenticated ? <DashboardRouter /> : <SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={isAuthenticated ? <DashboardRouter /> : <SignUp onLogin={handleLogin} />} />
        <Route
          path="/tenant-dashboard"
          element={
            <Dashboard
              onLogout={handleLogout}
              onLogin={handleLogin}
              user={user}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/landlord-dashboard"
          element={
            isAuthenticated && userRole === 'landlord' ?
            <LandlordDashboard onLogout={handleLogout} user={user} /> :
            <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && userRole === 'admin' ?
            <AdminDashboard onLogout={handleLogout} /> :
            <Navigate to="/signin" replace />
          }
        />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;