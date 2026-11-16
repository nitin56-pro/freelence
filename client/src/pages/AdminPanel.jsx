import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaUsers, FaBriefcase, FaPaperPlane, FaTrash, FaShieldAlt } from 'react-icons/fa';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ users: 0, jobs: 0, proposals: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook must be called unconditionally before any early returns
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, jobsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/jobs')
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error('Admin data fetch error', error);
        toast.error('Could not load all admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  // Protect admin route after hooks
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all associated records?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success('User and associated records deleted');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to remove this job posting?')) {
      try {
        await api.delete(`/admin/jobs/${jobId}`);
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        toast.success('Job removed');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
            <FaShieldAlt />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Control Center</h1>
            <p className="text-gray-500 text-sm">System oversight, user management, and platform analytics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100">
              <FaUsers />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Users</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.users || stats.totalUsers || users.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-100">
              <FaBriefcase />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Projects</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.jobs || stats.totalJobs || jobs.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl border border-purple-100">
              <FaPaperPlane />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Proposals</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.proposals || stats.totalProposals || 0}</h3>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 mb-10 overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Registered Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'client'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      ★ {u.rating || 0} ({u.totalReviews || 0})
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u._id !== user._id ? (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">All Project Postings ({jobs.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Budget</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{j.title}</td>
                    <td className="px-6 py-4 text-gray-600">{j.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          j.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : j.status === 'in-progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${j.budgetMin} - ${j.budgetMax}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Delete Job"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
