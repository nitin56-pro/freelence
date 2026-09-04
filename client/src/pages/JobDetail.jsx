import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams(); // Get job ID from URL
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Proposal form state
  const [coverLetter, setCoverLetter] = useState('');
  const [budget, setBudget] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');

  // Fetch job details
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        
        // If current user is the client who posted the job, fetch proposals
        if (user && user._id === res.data.client) {
          const propRes = await api.get(`/proposals/job/${id}`);
          setProposals(propRes.data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, user]);

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a proposal');
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/proposals', {
        jobId: id,
        coverLetter,
        budget: Number(budget),
        deliveryDays: Number(deliveryDays)
      });
      toast.success('Proposal submitted successfully!');
      setCoverLetter('');
      setBudget('');
      setDeliveryDays('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    }
  };

  const updateProposalStatus = async (proposalId, status) => {
    try {
      await api.put(`/proposals/${proposalId}/status`, { status });
      toast.success(`Proposal ${status}`);
      // Update local state to reflect change
      setProposals(proposals.map(p => 
        p._id === proposalId ? { ...p, status } : p
      ));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="container mx-auto p-8 text-center">Loading...</div>;
  if (!job) return <div className="container mx-auto p-8 text-center text-red-500">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Job Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
          <span className={`px-4 py-1 rounded-full text-sm font-bold ${
            job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status?.toUpperCase() || 'OPEN'}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mb-6">
          Category: <span className="font-semibold text-gray-700 mr-4">{job.category}</span>
          Posted on: <span className="font-semibold text-gray-700">{new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
          <div>
            <h3 className="text-sm text-gray-500 font-semibold uppercase">Budget</h3>
            <p className="text-lg font-bold text-gray-800">${job.budgetMin} - ${job.budgetMax}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 font-semibold uppercase">Deadline</h3>
            <p className="text-lg font-bold text-gray-800">{new Date(job.deadline || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 font-semibold uppercase mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills?.split(',').map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FREELANCER: Proposal Form */}
      {user?.role === 'freelancer' && job.status === 'open' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Submit a Proposal</h2>
          <form onSubmit={submitProposal} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Cover Letter</label>
              <textarea 
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Why are you a good fit for this job?"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Your Bid ($)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Time (Days)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
            >
              Submit Proposal
            </button>
          </form>
        </div>
      )}

      {/* CLIENT: View Proposals */}
      {user?.role === 'client' && user._id === job.client && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Proposals Received ({proposals.length})</h2>
          {proposals.length === 0 ? (
            <p className="bg-gray-50 p-4 rounded text-gray-600 border">No proposals yet.</p>
          ) : (
            <div className="space-y-4">
              {proposals.map(prop => (
                <div key={prop._id} className="bg-white p-4 rounded shadow border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg">Freelancer ID: {prop.freelancer}</h3>
                    <span className="font-bold text-green-600">${prop.budget} in {prop.deliveryDays} days</span>
                  </div>
                  <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded text-sm">{prop.coverLetter}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      prop.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      prop.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      STATUS: {prop.status.toUpperCase()}
                    </span>
                    
                    {prop.status === 'pending' && (
                      <div className="space-x-2">
                        <button 
                          onClick={() => updateProposalStatus(prop._id, 'accepted')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateProposalStatus(prop._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;
