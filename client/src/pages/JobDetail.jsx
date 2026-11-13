import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaDollarSign, 
  FaRegCalendarAlt, 
  FaUserTie, 
  FaStar, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaPaperPlane, 
  FaBuilding, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [myProposal, setMyProposal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal form state
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [submittingProposal, setSubmittingProposal] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchJobData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${id}`);
      const jobData = res.data;
      setJob(jobData);

      const clientId = jobData.client?._id || jobData.client;
      const isJobOwner = user && (user._id === clientId || user.role === 'admin');

      if (isJobOwner) {
        const propRes = await api.get(`/proposals/job/${id}`);
        setProposals(propRes.data);
      } else if (user && user.role === 'freelancer') {
        const myPropsRes = await api.get('/proposals/my-proposals');
        const found = myPropsRes.data.find(
          (p) => (p.job?._id || p.job) === id
        );
        setMyProposal(found || null);
      }

      // Fetch reviews for this job
      try {
        const revRes = await api.get(`/reviews/job/${id}`);
        setReviews(revRes.data);
      } catch {
        // Ignore if no reviews yet
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a proposal');
      navigate('/login');
      return;
    }

    try {
      setSubmittingProposal(true);
      const res = await api.post('/proposals', {
        job: id,
        coverLetter,
        proposedBudget: Number(proposedBudget),
        deliveryDays: Number(deliveryDays)
      });
      toast.success('Proposal submitted successfully!');
      setMyProposal(res.data);
      setCoverLetter('');
      setProposedBudget('');
      setDeliveryDays('');
      fetchJobData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const updateProposalStatus = async (proposalId, status) => {
    try {
      await api.put(`/proposals/${proposalId}/status`, { status });
      toast.success(`Proposal ${status === 'accepted' ? 'accepted! Project is now In-Progress.' : 'rejected'}`);
      fetchJobData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update proposal status');
    }
  };

  const handleCompleteJob = async () => {
    if (!window.confirm('Mark this project as completed? Both parties will be able to leave reviews.')) return;
    try {
      await api.put(`/jobs/${id}/complete`);
      toast.success('Project marked as completed!');
      fetchJobData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark project complete');
    }
  };

  const handleReviewSubmit = async (e, revieweeId) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post('/reviews', {
        job: id,
        reviewee: revieweeId,
        rating: Number(rating),
        comment
      });
      toast.success('Review submitted! Thank you for your feedback.');
      setComment('');
      setRating(5);
      fetchJobData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Project Not Found</h2>
        <Link to="/jobs" className="text-blue-600 hover:underline mt-4 inline-block font-semibold">
          Back to Browse Jobs
        </Link>
      </div>
    );
  }

  const clientId = job.client?._id || job.client;
  const isOwner = user && user._id === clientId;
  const acceptedProposal = proposals.find((p) => p.status === 'accepted') || (myProposal?.status === 'accepted' ? myProposal : null);

  const skillsList = Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0
    ? job.skillsRequired
    : (typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  const postedDateStr = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A';
  const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Flexible';

  // Determine if current user already reviewed this job
  const hasReviewed = user && reviews.some((r) => (r.reviewer?._id || r.reviewer) === user._id);

  // Determine who the current user can review if job is completed
  let reviewTargetId = null;
  let reviewTargetName = '';
  if (job.status === 'completed' && user && !hasReviewed) {
    if (isOwner && acceptedProposal) {
      reviewTargetId = acceptedProposal.freelancer?._id || acceptedProposal.freelancer;
      reviewTargetName = acceptedProposal.freelancer?.name || 'the Freelancer';
    } else if (myProposal?.status === 'accepted') {
      reviewTargetId = clientId;
      reviewTargetName = job.client?.name || 'the Client';
    }
  }

  const statusBadge =
    job.status === 'open'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : job.status === 'in-progress'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : job.status === 'completed'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to All Projects</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {job.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 leading-tight">
                    {job.title}
                  </h1>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border uppercase tracking-wider ${statusBadge}`}>
                  {job.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-500 pb-6 border-b border-gray-100">
                <span>Posted on {postedDateStr}</span>
                <span>•</span>
                <span>{job.proposalsCount || proposals.length} Proposals Submitted</span>
              </div>

              <div className="py-6 border-b border-gray-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Project Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {job.description}
                </p>
              </div>

              <div className="py-6 border-b border-gray-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Required Skills & Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 font-semibold px-3.5 py-1.5 rounded-lg text-xs border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 italic">No specific skills listed</span>
                  )}
                </div>
              </div>

              {/* Client Completion Control */}
              {isOwner && job.status === 'in-progress' && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Project In Progress</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Once the freelancer delivers the work, mark this contract as completed.
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteJob}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition shrink-0 flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    <span>Mark Completed</span>
                  </button>
                </div>
              )}
            </div>

            {/* FREELANCER SECTION: My Submitted Proposal or Bid Form */}
            {user?.role === 'freelancer' && (
              <>
                {myProposal ? (
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-blue-200">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Your Submitted Proposal</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          myProposal.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : myProposal.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {myProposal.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500 font-semibold uppercase">Your Bid</span>
                        <p className="text-lg font-bold text-emerald-700">${myProposal.proposedBudget}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-semibold uppercase">Delivery Time</span>
                        <p className="text-lg font-bold text-gray-800">{myProposal.deliveryDays} Days</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {myProposal.coverLetter}
                    </p>
                  </div>
                ) : job.status === 'open' ? (
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FaPaperPlane className="text-blue-600 text-base" />
                      <span>Submit a Proposal</span>
                    </h2>
                    <p className="text-xs text-gray-500 mb-6">
                      Explain your technical approach and provide an accurate budget & timeline.
                    </p>

                    <form onSubmit={submitProposal} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                            Bid Amount ($)
                          </label>
                          <input
                            type="number"
                            required
                            min="5"
                            placeholder={`e.g. ${job.budgetMin}`}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            value={proposedBudget}
                            onChange={(e) => setProposedBudget(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                            Delivery Time (Days)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 10"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            value={deliveryDays}
                            onChange={(e) => setDeliveryDays(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                          Cover Letter
                        </label>
                        <textarea
                          required
                          rows="5"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Outline your relevant experience, architecture plan, and why you're the best fit..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingProposal}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition disabled:bg-blue-300"
                      >
                        {submittingProposal ? 'Submitting Proposal...' : 'Submit Bid Proposal'}
                      </button>
                    </form>
                  </div>
                ) : null}
              </>
            )}

            {/* CLIENT OWNER: Proposals Received */}
            {(isOwner || user?.role === 'admin') && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Received Proposals ({proposals.length})
                </h2>

                {proposals.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                    <p className="text-gray-500 text-sm">
                      No freelancers have submitted proposals yet. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {proposals.map((prop) => {
                      const freelancer = prop.freelancer || {};
                      return (
                        <div
                          key={prop._id}
                          className={`p-5 rounded-xl border transition ${
                            prop.status === 'accepted'
                              ? 'bg-emerald-50/40 border-emerald-300'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                                {freelancer.name ? freelancer.name.charAt(0).toUpperCase() : 'F'}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-base">
                                  {freelancer.name || 'Freelancer'}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                                    <FaStar /> {freelancer.rating || 'New'}
                                  </span>
                                  {freelancer.hourlyRate > 0 && (
                                    <span>${freelancer.hourlyRate}/hr</span>
                                  )}
                                  {freelancer.location && <span>{freelancer.location}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-black text-emerald-700">
                                ${prop.proposedBudget}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                Delivery in {prop.deliveryDays} days
                              </div>
                            </div>
                          </div>

                          {/* Freelancer Skills */}
                          {Array.isArray(freelancer.skills) && freelancer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {freelancer.skills.slice(0, 5).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded border border-gray-200"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-gray-700 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap mb-4">
                            {prop.coverLetter}
                          </p>

                          <div className="flex flex-wrap justify-between items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                prop.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : prop.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              Status: {prop.status}
                            </span>

                            {prop.status === 'pending' && isOwner && job.status === 'open' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateProposalStatus(prop._id, 'accepted')}
                                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs shadow-xs transition"
                                >
                                  <FaCheckCircle />
                                  <span>Accept & Hire</span>
                                </button>
                                <button
                                  onClick={() => updateProposalStatus(prop._id, 'rejected')}
                                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-1.5 rounded-lg text-xs border border-red-200 transition"
                                >
                                  <FaTimesCircle />
                                  <span>Reject</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* REVIEW SUBMISSION FORM (When job is completed) */}
            {reviewTargetId && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Leave a Review for {reviewTargetName}
                </h2>
                <p className="text-xs text-gray-500 mb-5">
                  Share your feedback to help maintain community trust and verified ratings.
                </p>

                <form onSubmit={(e) => handleReviewSubmit(e, reviewTargetId)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition ${
                            star <= rating ? 'text-amber-400 scale-110' : 'text-gray-300'
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-gray-700">{rating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                      Review Comment
                    </label>
                    <textarea
                      required
                      rows="3"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      placeholder="Describe communication quality, timeliness, and overall delivery..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* EXISTING REVIEWS FOR THIS PROJECT */}
            {reviews.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Project Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-sm text-gray-900">
                          {rev.reviewer?.name || 'User'}
                          <span className="text-xs text-gray-400 font-normal ml-2 capitalize">
                            ({rev.reviewer?.role}) → {rev.reviewee?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <FaStar /> {rev.rating}.0
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Project Budget & Deadline Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3">
                Contract Summary
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-100">
                  <FaDollarSign />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Project Budget</span>
                  <span className="text-lg font-black text-gray-900">
                    ${job.budgetMin} - ${job.budgetMax}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg border border-blue-100">
                  <FaRegCalendarAlt />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 block">Target Deadline</span>
                  <span className="text-base font-bold text-gray-900">{deadlineStr}</span>
                </div>
              </div>
            </div>

            {/* Client Information Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3 mb-4">
                About the Client
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                  {job.client?.name ? job.client.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <FaUserTie className="text-gray-400 text-xs" />
                    {job.client?.name || 'Verified Client'}
                  </h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                    <FaStar />
                    <span>{job.client?.rating || '5.0'}</span>
                    <span className="text-gray-400 font-normal">
                      ({job.client?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                {job.client?.company && (
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-400" />
                    <span>{job.client.company}</span>
                  </div>
                )}
                {job.client?.location && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{job.client.location}</span>
                  </div>
                )}
              </div>

              {!user && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition"
                  >
                    Sign in to Apply
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
