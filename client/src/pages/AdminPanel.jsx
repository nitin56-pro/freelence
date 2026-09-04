import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ users: 0, jobs: 0, proposals: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect admin route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be real admin API endpoints
        const statsRes = await api.get('/admin/stats');
        const usersRes = await api.get('/admin/users');
        const jobsRes = await api.get('/admin/jobs');
        
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
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        toast.success('User deleted');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="text-center p-10 text-xl">Loading Admin Panel...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-blue-100 text-lg font-semibold mb-1">Total Users</h3>
          <p className="text-4xl font-bold">{stats.users || users.length}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-green-100 text-lg font-semibold mb-1">Total Jobs</h3>
          <p className="text-4xl font-bold">{stats.jobs || jobs.length}</p>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-purple-100 text-lg font-semibold mb-1">Total Proposals</h3>
          <p className="text-4xl font-bold">{stats.proposals || 0}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="mb-12 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm disabled:opacity-50"
                      disabled={u._id === user._id} // Prevent deleting self
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">All Jobs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-gray-500 text-sm font-semibold">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map(j => (
                <tr key={j._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{j.title}</td>
                  <td className="px-6 py-4 text-gray-600">{j.category}</td>
                  <td className="px-6 py-4 capitalize text-sm">{j.status}</td>
                  <td className="px-6 py-4 text-gray-600">${j.budgetMin} - ${j.budgetMax}</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
