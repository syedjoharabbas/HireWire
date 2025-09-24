import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { HomeIcon, BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Candidates from './pages/Candidates';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import Header from './components/Header';

function App() {
    const location = useLocation();
    const { isAuthenticated, logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                    <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
                    <Route path="/add-job" element={<PrivateRoute><AddJob /></PrivateRoute>} />
                    <Route path="/candidates" element={<PrivateRoute><Candidates /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute requiredRole="Admin"><Admin /></PrivateRoute>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
