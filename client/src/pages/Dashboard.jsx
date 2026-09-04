import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on user role
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user.role === 'client') {
          // Fetch jobs posted by client
          const res = await api.get('/jobs/my-jobs');
          setItems(res.data);
        } else if (user.role === 'freelancer') {
          // Fetch proposals submitted by freelancer
          const res = await api.get('/proposals/my-proposals');
          setItems(res.data);
        } else if (user.role === 'admin') {
          // Admin can see summary stats (simplified)
          const res = await api.get('/admin/stats');
          setItems(res.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mt-2">
          You are logged in as a <span className="font-semibold capitalize text-blue-600">{user.role}</span>.
        </p>
      </div>

      {/* CLIENT DASHBOARD */}
      {user.role === 'client' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Posted Jobs</h2>
            <Link 
              to="/post-job" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
            >
              Post New Job
            </Link>
          </div>
          
          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : items.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-gray-200">
              <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
              <Link to="/post-job" className="text-blue-600 font-medium hover:underline">Post your first job</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map(job => (
                <div key={job._id} className="bg-white p-4 rounded shadow border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500">Status: {job.status}</p>
                  </div>
                  <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline">View Details</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FREELANCER DASHBOARD */}
      {user.role === 'freelancer' && (
        <div>
          <h2 className="text-xl font-bold mb-6">My Proposals</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading proposals...</p>
          ) : items.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-gray-200">
              <p className="text-gray-600 mb-4">You haven't submitted any proposals yet.</p>
              <Link to="/jobs" className="text-blue-600 font-medium hover:underline">Browse available jobs</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map(proposal => (
                <div key={proposal._id} className="bg-white p-4 rounded shadow border border-gray-100">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">Proposal for Job #{proposal.jobId}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Bid: ${proposal.budget}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user.role === 'admin' && (
        <div>
          <h2 className="text-xl font-bold mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded shadow-sm border border-blue-100 text-center">
              <h3 className="text-gray-600 font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-700">{items.totalUsers || 0}</p>
            </div>
            <div className="bg-green-50 p-6 rounded shadow-sm border border-green-100 text-center">
              <h3 className="text-gray-600 font-semibold mb-2">Total Jobs</h3>
              <p className="text-3xl font-bold text-green-700">{items.totalJobs || 0}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded shadow-sm border border-purple-100 text-center">
              <h3 className="text-gray-600 font-semibold mb-2">Total Proposals</h3>
              <p className="text-3xl font-bold text-purple-700">{items.totalProposals || 0}</p>
            </div>
          </div>
          <Link to="/admin" className="block text-center bg-gray-800 hover:bg-gray-900 text-white py-3 rounded font-medium">
            Go to Admin Panel
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
