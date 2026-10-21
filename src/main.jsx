import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import './index.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/DashboardLayout';
import Employees from './pages/hr/Employees';
import Profile from './pages/employee/Profile';



const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-medium">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}/dashboard`} replace />;
  
  return children;
};

const PlaceholderPage = ({ title }) => <div className="card"><h2 className="text-xl font-bold">{title}</h2><p className="text-text-secondary mt-2">Place Holder Component</p></div>;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/hr" element={<ProtectedRoute allowedRole="hr"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Employees />} />
            <Route path="leave" element={<PlaceholderPage title="HR Leave" />} />
          </Route>

          <Route path="/employee" element={<ProtectedRoute allowedRole="employee"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Profile/>} />
            <Route path="leave" element={<PlaceholderPage title="Employee Leave" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);