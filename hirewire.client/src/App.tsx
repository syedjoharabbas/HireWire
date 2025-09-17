import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomeIcon, BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">HireWire</h1>
                        </div>
                        <div className="flex space-x-4">
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
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/add-job" element={<AddJob />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
