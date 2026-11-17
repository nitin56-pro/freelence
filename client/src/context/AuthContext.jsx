import { createContext, useState, useMemo } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const DEMO_USERS_KEY = 'freelancehub_demo_users';

const demoUsers = [
  {
    _id: 'demo-admin',
    name: 'Nitin Singh',
    email: 'nitinsinghc74@gmail.com',
    role: 'admin'
  },
  {
    _id: 'demo-client',
    name: 'Vikram Malhotra',
    email: 'client@techcorp.com',
    password: 'client123',
    role: 'client'
  },
  {
    _id: 'demo-freelancer',
    name: 'Rahul Sharma',
    email: 'rahul@dev.io',
    password: 'freelancer123',
    role: 'freelancer'
  }
];

const getDemoUsers = () => {
  try {
    const savedUsers = localStorage.getItem(DEMO_USERS_KEY);
    return savedUsers ? JSON.parse(savedUsers) : demoUsers;
  } catch {
    return demoUsers;
  }
};

const saveDemoUser = (user) => {
  const users = [...getDemoUsers().filter((savedUser) => savedUser.email !== user.email), user];
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

const toDemoSession = (user) => {
  const userData = Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== 'password')
  );
  return {
    ...userData,
    token: `demo-token-${user._id}`
  };
};

const isBackendUnavailable = (error) =>
  !error.response || error.response.status === 404 || error.response.status >= 500;

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
      if (isBackendUnavailable(error)) {
        const demoUser = getDemoUsers().find(
          (savedUser) =>
            savedUser.email.toLowerCase() === email.toLowerCase() &&
            savedUser.password === password
        );

        if (demoUser) {
          const session = toDemoSession(demoUser);
          localStorage.setItem('user', JSON.stringify(session));
          setUser(session);
          toast.success(`Welcome back, ${session.name}!`);
          return true;
        }
      }
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    const existingDemoUser = getDemoUsers().some(
      (savedUser) => savedUser.email.toLowerCase() === email.toLowerCase()
    );

    if (existingDemoUser) {
      toast.error('An account with this email already exists.');
      return false;
    }

    try {
      // Call backend to register
      const res = await api.post('/auth/register', { name, email, password, role });
      
      // Save user to local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      if (isBackendUnavailable(error)) {
        const demoUser = {
          _id: `demo-user-${Date.now()}`,
          name,
          email,
          password,
          role: role || 'freelancer'
        };
        saveDemoUser(demoUser);

        const session = toDemoSession(demoUser);
        localStorage.setItem('user', JSON.stringify(session));
        setUser(session);
        toast.success('Demo account created successfully!');
        return true;
      }
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
