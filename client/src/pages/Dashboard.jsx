import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import { FaPlusCircle, FaBriefcase, FaPaperPlane, FaStar, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user.role === 'client') {
          const res = await api.get('/jobs/my-jobs');
          setItems(res.data);
        } else if (user.role === 'freelancer') {
          const res = await api.get('/proposals/my-proposals');
          setItems(res.data);
        } else if (user.role === 'admin') {
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

    if (user?.role) {
      fetchData();
    }
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xs p-6 sm:p-8 mb-8 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              user?.role === 'admin' ? 'bg-amber-100 text-amber-800' :
              user?.role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {user?.role} Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage your active proposals, contracts, and platform interactions.
            </p>
          </div>

          {user?.role === 'client' && (
            <Link
              to="/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0"
            >
              <FaPlusCircle />
              <span>Post New Project</span>
            </Link>
          )}

          {user?.role === 'freelancer' && (
            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0"
            >
              <FaBriefcase />
              <span>Browse Projects</span>
            </Link>
          )}
        </div>

        {/* CLIENT DASHBOARD */}
        {user?.role === 'client' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Posted Projects ({items.length})</h2>
                <p className="text-xs text-gray-500">Track incoming proposals and project statuses</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading your posted projects...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  <FaBriefcase />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Projects Posted Yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Post your first project requirement and start receiving bids from top freelancers.
                </p>
                <Link
                  to="/post-job"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm inline-flex items-center gap-2"
                >
                  <FaPlusCircle />
                  <span>Post Your First Project</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* FREELANCER DASHBOARD */}
        {user?.role === 'freelancer' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Submitted Proposals ({items.length})</h2>
                <p className="text-xs text-gray-500">Track bid statuses and client decisions</p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading your proposals...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  <FaPaperPlane />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Proposals Submitted Yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Browse open project listings and submit your technical bids to win clients.
                </p>
                <Link
                  to="/jobs"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm inline-block"
                >
                  Browse Available Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((proposal) => {
                  const job = proposal.job || {};
                  return (
                    <div
                      key={proposal._id}
                      className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 hover:border-blue-200 transition"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                            {job.category || 'General'}
                          </span>
                          <h3 className="font-bold text-lg text-gray-900 mt-1 hover:text-blue-600 transition">
                            <Link to={`/jobs/${job._id || proposal.job}`}>
                              {job.title || 'Project Information'}
                            </Link>
                          </h3>
                          {job.client?.name && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Client: <strong className="text-gray-700">{job.client.name}</strong>
                              {job.client.company && ` (${job.client.company})`}
                            </p>
                          )}
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            proposal.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : proposal.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                        <span>Your Bid: <strong className="text-emerald-700">${proposal.proposedBudget}</strong></span>
                        <span>Delivery: <strong className="text-gray-900">{proposal.deliveryDays} Days</strong></span>
                        {job.status && (
                          <span>Project Status: <strong className="text-gray-900 capitalize">{job.status}</strong></span>
                        )}
                        <Link
                          to={`/jobs/${job._id || proposal.job}`}
                          className="ml-auto text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          View Project & Cover Letter →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {user?.role === 'admin' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Operational Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl">
                  <FaUsers />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Users</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{items.users || items.totalUsers || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl">
                  <FaBriefcase />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Projects</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{items.jobs || items.totalJobs || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-xl">
                  <FaPaperPlane />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Proposals</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{items.proposals || items.totalProposals || 0}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl">
                  <FaStar />
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Reviews</h3>
                <p className="text-3xl font-black text-gray-900 mt-1">{items.reviews || items.totalReviews || 0}</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/admin"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition"
              >
                Open Admin Management Console
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
