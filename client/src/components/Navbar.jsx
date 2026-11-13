import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes, FaBriefcase, FaPlusCircle, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-gray-900 tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <FaBriefcase className="text-lg" />
            </span>
            <span>Freelance<span className="text-blue-600">Hub</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/jobs') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>

                {user.role === 'client' && (
                  <Link
                    to="/post-job"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition"
                  >
                    <FaPlusCircle className="text-xs" />
                    <span>Post Job</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-xs transition"
                  >
                    <FaShieldAlt className="text-xs" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      user.role === 'admin' ? 'text-amber-600' :
                      user.role === 'client' ? 'text-blue-600' : 'text-emerald-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-5 space-y-2">
          <Link
            to="/"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Jobs
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              {user.role === 'client' && (
                <Link
                  to="/post-job"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  + Post a New Job
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-amber-600 hover:bg-amber-50 font-semibold"
                >
                  Admin Control Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={toggleMenu}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Profile ({user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-center py-2 px-4 rounded-lg text-gray-700 font-semibold border border-gray-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block text-center py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
