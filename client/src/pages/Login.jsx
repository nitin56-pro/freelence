import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoading(true);
    
    // Call login from AuthContext
    const success = await login(email, password);
    
    if (success) {
      // Redirect to dashboard on success
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200">
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-blue-600 mb-3">Welcome back</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Sign in to FreelanceHub</h2>
          <p className="text-sm text-gray-500 mt-2">Pick up where you left off.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email address</label>
            <input
              type="email"
              required
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Link to Register */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
