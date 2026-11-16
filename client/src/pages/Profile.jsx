import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaUserCircle, FaMapMarkerAlt, FaStar, FaBriefcase, FaEdit, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    location: '',
    company: ''
  });

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/profile');
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          bio: res.data.bio || '',
          skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : (res.data.skills || ''),
          hourlyRate: res.data.hourlyRate || '',
          location: res.data.location || '',
          company: res.data.company || ''
        });

        // Fetch reviews received by this user
        if (user?._id) {
          try {
            const revRes = await api.get(`/reviews/user/${user._id}`);
            setReviews(revRes.data);
          } catch {
            // No reviews yet
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [user?._id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', formData);
      setProfile(res.data);
      if (updateUserData) {
        updateUserData(res.data);
      }
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const skillsList = Array.isArray(profile.skills) && profile.skills.length > 0
    ? profile.skills
    : (typeof profile.skills === 'string' ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-3xl flex items-center justify-center border border-white/30 shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black">{profile.name || user?.name}</h1>
                  <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                    <span className="capitalize font-semibold bg-white/20 px-2.5 py-0.5 rounded-full text-xs">
                      {user?.role}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-xs" />
                      {profile.location || 'Location not specified'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2 shrink-0"
              >
                {isEditing ? 'Cancel Edit' : <><FaEdit /> <span>Edit Profile</span></>}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 text-center py-4 bg-gray-50/50">
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase block">Reputation</span>
              <span className="text-lg font-bold text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                <FaStar /> {profile.rating || 0}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase block">Total Reviews</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5 block">{profile.totalReviews || reviews.length}</span>
            </div>
            {user?.role === 'freelancer' && (
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase block">Hourly Rate</span>
                <span className="text-lg font-bold text-emerald-600 mt-0.5 block">
                  {profile.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Negotiable'}
                </span>
              </div>
            )}
            <div>
              <span className="text-xs text-gray-500 font-semibold uppercase block">Account Role</span>
              <span className="text-lg font-bold text-gray-800 capitalize mt-0.5 block">{user?.role}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Bangalore, India"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {user?.role === 'client' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="e.g. Acme Technologies Pvt Ltd"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Professional Bio</label>
                  <textarea
                    name="bio"
                    rows="4"
                    placeholder="Tell clients or collaborators about your background, experience, and accomplishments..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>

                {user?.role === 'freelancer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                        Skills (Comma separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        placeholder="React, Node.js, MongoDB, Figma"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                        Hourly Rate ($/hr)
                      </label>
                      <input
                        type="number"
                        name="hourlyRate"
                        min="0"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
                >
                  <FaCheck />
                  <span>Save Profile</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About Me</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {profile.bio || 'No professional bio provided yet. Click "Edit Profile" to tell clients about your background.'}
                  </p>
                </div>

                {user?.role === 'freelancer' && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.length > 0 ? (
                        skillsList.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg text-xs border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">No skills specified yet.</span>
                      )}
                    </div>
                  </div>
                )}

                {user?.role === 'client' && profile.company && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Company</h3>
                    <p className="text-gray-800 font-semibold flex items-center gap-2">
                      <FaBriefcase className="text-gray-400" />
                      <span>{profile.company}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Client & Peer Reviews ({reviews.length})</h2>
              <p className="text-xs text-gray-500 mt-0.5">Verified ratings from completed contracts</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black text-lg bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <FaStar />
              <span>{profile.rating || 0} / 5</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
              <p className="text-gray-500 text-sm">
                No reviews yet. Reviews will automatically appear once projects are completed and evaluated.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm text-gray-900">
                        {rev.reviewer?.name || 'Verified Member'}
                      </span>
                      {rev.job?.title && (
                        <p className="text-xs text-gray-500 mt-0.5">Project: {rev.job.title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <FaStar />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
