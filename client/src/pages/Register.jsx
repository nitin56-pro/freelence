import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer' // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Call register from AuthContext
    const success = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    
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
          <p className="text-sm font-bold text-blue-600 mb-3">Start something good</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-2">It only takes a minute to get started.</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Full name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              required
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">I’m here to:</label>
            <select
              name="role"
              className="mt-2 block w-full px-3 py-3 border border-gray-200 rounded-xl bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="freelancer">Work as a Freelancer</option>
              <option value="client">Hire Talent (Client)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
