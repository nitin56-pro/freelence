import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaTags } from 'react-icons/fa';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    skills: '',
    budgetMin: '',
    budgetMax: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minB = Number(formData.budgetMin);
    const maxB = Number(formData.budgetMax);
    if (maxB < minB) {
      toast.error('Maximum budget must be greater than or equal to minimum budget.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post('/jobs', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skillsRequired: skillsArray,
        budgetMin: minB,
        budgetMax: maxB,
        deadline: formData.deadline
      });

      toast.success('Project published successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish project');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'client') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Restricted</h2>
          <p className="text-gray-600 text-sm">
            Only registered Client accounts can post new projects. You are currently logged in as a <span className="font-bold capitalize">{user?.role}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 sm:p-10">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Client Portal
            </span>
            <h1 className="text-3xl font-black text-gray-900 mt-3 flex items-center gap-3">
              <FaBriefcase className="text-blue-600 text-2xl" />
              <span>Post a New Project</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Provide clear specifications and budget range to attract top freelance talent.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="e.g. Build a Full-Stack SaaS Analytics Dashboard with MERN"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Category & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>Target Deadline</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Detailed Requirements
              </label>
              <textarea
                name="description"
                required
                rows="6"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="Describe project scope, key deliverables, expected API integrations, and milestone expectations..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                <FaTags className="text-gray-400" />
                <span>Required Skills (Comma separated)</span>
              </label>
              <input
                type="text"
                name="skills"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                placeholder="e.g. React, Node.js, MongoDB, TailwindCSS"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1">
                  <FaDollarSign className="text-emerald-600" />
                  <span>Minimum Budget ($)</span>
                </label>
                <input
                  type="number"
                  name="budgetMin"
                  required
                  min="5"
                  placeholder="e.g. 300"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  value={formData.budgetMin}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1">
                  <FaDollarSign className="text-emerald-600" />
                  <span>Maximum Budget ($)</span>
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  required
                  min="5"
                  placeholder="e.g. 800"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  value={formData.budgetMax}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition disabled:bg-blue-300 text-base"
              >
                {loading ? 'Publishing Project...' : 'Publish Project Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
