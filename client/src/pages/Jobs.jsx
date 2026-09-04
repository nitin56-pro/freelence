import { useState, useEffect } from 'react';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Build query string
      let query = '';
      if (searchTerm || category) {
        query = `?keyword=${searchTerm}&category=${category}`;
      }
      
      const res = await api.get(`/jobs${query}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      // For demo purposes if backend isn't ready:
      // setJobs([{_id: '1', title: 'Test Job', budgetMin: 100, budgetMax: 500, status: 'open', skills: 'react, node'}]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []); // Run once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(); // Refetch with current search term and category
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Find Work</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by keywords..." 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
