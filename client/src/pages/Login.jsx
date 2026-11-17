import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLock, FaEnvelope, FaUserCheck, FaBriefcase } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  // Quick fill helper for college viva examination
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 text-xl shadow-md">
            <FaBriefcase />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Sign In to Account</h2>
          <p className="text-gray-500 text-sm mt-1">Access your projects, proposals, and contracts</p>
        </div>

        {/* Demo Accounts Quick-Fill Box (College Project Showcase) */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2 flex items-center gap-1.5">
            <FaUserCheck className="text-blue-600" />
            <span>Evaluation / Demo Accounts:</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('nitinsinghc74@gmail.com');
              }}
              className="py-1.5 px-2 bg-white hover:bg-blue-100 text-[11px] font-bold text-amber-800 rounded-lg border border-blue-200 shadow-2xs transition"
            >
              Admin (Nitin)
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('client@techcorp.com', 'client123')}
              className="py-1.5 px-2 bg-white hover:bg-blue-100 text-[11px] font-bold text-blue-800 rounded-lg border border-blue-200 shadow-2xs transition"
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('rahul@dev.io', 'freelancer123')}
              className="py-1.5 px-2 bg-white hover:bg-blue-100 text-[11px] font-bold text-emerald-800 rounded-lg border border-blue-200 shadow-2xs transition"
            >
              Freelancer
            </button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:bg-blue-300 text-sm"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600 pt-4 border-t border-gray-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
