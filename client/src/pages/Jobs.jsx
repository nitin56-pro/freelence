import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import toast from 'react-hot-toast';
import { FaSearch, FaFilter, FaSyncAlt } from 'react-icons/fa';

const categories = [
  'All Categories',
  'Web Development',
  'Mobile App',
  'Design',
  'Writing',
  'DevOps & Cloud',
  'AI & Data Science',
  'Other'
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialKeyword = searchParams.get('keyword') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJobs = useCallback(async (keywordVal, categoryVal, statusVal) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (keywordVal) params.append('keyword', keywordVal);
      if (categoryVal && categoryVal !== 'All Categories') params.append('category', categoryVal);
      if (statusVal && statusVal !== 'all') params.append('status', statusVal);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get(`/jobs${queryString}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const keywordFromUrl = searchParams.get('keyword') || '';
    const categoryFromUrl = searchParams.get('category') || '';
    setSearchTerm(keywordFromUrl);
    setCategory(categoryFromUrl);
    fetchJobs(keywordFromUrl, categoryFromUrl, statusFilter);
  }, [searchParams, statusFilter, fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchTerm.trim()) newParams.set('keyword', searchTerm.trim());
    if (category && category !== 'All Categories') newParams.set('category', category);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setStatusFilter('all');
    setSearchParams(new URLSearchParams());
  };

  // Client-side sorting
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === 'budgetHigh') {
      return (b.budgetMax || 0) - (a.budgetMax || 0);
    } else if (sortBy === 'budgetLow') {
      return (a.budgetMin || 0) - (b.budgetMin || 0);
    }
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore Available Projects
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Browse, filter, and bid on verified contracts from global clients.
            </p>
          </div>
          <button
            onClick={() => fetchJobs(searchTerm, category, statusFilter)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 bg-white px-3.5 py-2 rounded-lg border border-gray-200 shadow-xs transition"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
            <span>Refresh Jobs</span>
          </button>
        </div>

        {/* Filter Card */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, keywords or skills (e.g. React, UI/UX)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}-
            <div className="lg:w-1/4">
              <select
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-700"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-1/5">
              <select
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-700"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="budgetHigh">Budget: High to Low</option>
                <option value="budgetLow">Budget: Low to High</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                <FaFilter className="text-xs" />
                <span>Filter</span>
              </button>
              {(searchTerm || category || statusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs font-semibold">
            <span className="text-gray-400 uppercase tracking-wider mr-2">Status:</span>
            {['all', 'open', 'in-progress', 'completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st === 'all' ? 'All Projects' : st}
              </button>
            ))}
            <span className="ml-auto text-gray-500 text-xs">
              Showing {sortedJobs.length} {sortedJobs.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>

        {/* Jobs Grid / List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium text-sm">Loading project listings...</p>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              <FaSearch />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Projects Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find any jobs matching your current filter criteria. Try searching with different keywords.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl text-sm transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
