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
            <nav className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">HireWire</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Theme toggle always visible */}
                            <ThemeToggle />

                            {isAuthenticated ? (
                                <>
                                    <div className="flex space-x-4">
                                        <Link 
                                            to="/" 
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                                location.pathname === '/' 
                                                    ? 'bg-primary-100 text-primary-700' 
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <HomeIcon className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>
                                        <Link 
                                            to="/jobs" 
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                                location.pathname === '/jobs' 
                                                    ? 'bg-primary-100 text-primary-700' 
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <BriefcaseIcon className="w-4 h-4 mr-2" />
                                            Jobs
                                        </Link>
                                        <Link 
                                            to="/add-job" 
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                                location.pathname === '/add-job' 
                                                    ? 'bg-primary-100 text-primary-700' 
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Add Job
                                        </Link>
                                        <Link to="/candidates" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/candidates'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}>
                                            Candidates
                                        </Link>
                                        {role === 'Admin' && (
                                            <Link to="/admin" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Admin</Link>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={handleLogout}
                                            className="btn btn-secondary"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/login'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/signup'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

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
