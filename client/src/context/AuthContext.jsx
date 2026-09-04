import { createContext, useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Call backend to login
      const res = await api.post('/users/login', { email, password });
      
      // Save user to local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    try {
      // Call backend to register
      const res = await api.post('/users/register', { name, email, password, role });
      
      // Save user to local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      toast.success('Registered successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  // Memoize context value
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout
  }), [user, loading]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
