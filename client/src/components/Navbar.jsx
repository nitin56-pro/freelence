import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle logout and redirect to home
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          FreelanceHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/jobs" className="hover:text-blue-200">Jobs</Link>

          {user ? (
            <>
              {/* Show links for logged in users */}
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/profile" className="hover:text-blue-200">Profile</Link>
              
              {/* Show admin panel link if user is admin */}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-200 text-yellow-300 font-bold">
                  Admin Panel
                </Link>
              )}
              
              {/* Show role badge */}
              <span className="bg-blue-800 px-2 py-1 rounded text-sm capitalize">
                {user.role}
              </span>
              
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show links for guests */}
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded font-medium">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
          <Link to="/" className="block py-2" onClick={toggleMenu}>Home</Link>
          <Link to="/jobs" className="block py-2" onClick={toggleMenu}>Jobs</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2" onClick={toggleMenu}>Dashboard</Link>
              <Link to="/profile" className="block py-2" onClick={toggleMenu}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-yellow-300" onClick={toggleMenu}>Admin Panel</Link>
              )}
              <div className="py-2 text-sm text-gray-300 capitalize">Role: {user.role}</div>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="block py-2" onClick={toggleMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
