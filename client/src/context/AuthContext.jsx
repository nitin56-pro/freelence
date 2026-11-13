import { createContext, useState, useMemo } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  // Login function
  const login = async (email, password) => {
    try {
      // Call backend to login
      const res = await api.post('/auth/login', { email, password });
      
      // Save user to local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      toast.success(`Welcome back, ${res.data.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    try {
      // Call backend to register
      const res = await api.post('/auth/register', { name, email, password, role });
      
      // Save user to local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      return false;
    }
  };

  // Update user state after profile edit
  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  // Memoize context value
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    updateUserData,
    logout
  }), [user, loading]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
