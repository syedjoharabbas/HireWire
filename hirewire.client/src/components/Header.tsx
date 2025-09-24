import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { HomeIcon, BriefcaseIcon, PlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Hide header on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">HireWire</Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <nav className="flex items-center space-x-2">
                  <Link to="/" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    <HomeIcon className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                  <Link to="/jobs" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/jobs' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    <BriefcaseIcon className="w-4 h-4 mr-2" /> Jobs
                  </Link>
                  <Link to="/add-job" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/add-job' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Job
                  </Link>
                  <Link to="/candidates" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/candidates' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                    Candidates
                  </Link>
                  {role === 'Admin' && (
                    <Link to="/admin" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Admin</Link>
                  )}
                </nav>

                <div className="ml-4">
                  <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/login' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>Login</Link>
                <Link to="/signup" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/signup' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} aria-label="Open menu" className="ml-3 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Dashboard</Link>
                <Link to="/jobs" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Jobs</Link>
                <Link to="/add-job" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Add Job</Link>
                <Link to="/candidates" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Candidates</Link>
                {role === 'Admin' && <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Admin</Link>}
                <button onClick={() => { setOpen(false); logout(); navigate('/login'); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
