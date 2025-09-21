import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">HireWire</h1>
                        </div>
                        <div className="flex space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to="/" 
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/' 
                                                ? 'bg-primary-100 text-primary-700' 
                                                : 'text-gray-600 hover:bg-gray-100'
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
                                                : 'text-gray-600 hover:bg-gray-100'
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
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Job
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-secondary"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/login'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                            location.pathname === '/signup'
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100'
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
                    <Route path="/add-job" element={<PrivateRoute><AddJob /></PrivateRoute>} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
