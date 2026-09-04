import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for editing
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    hourlyRate: '',
    location: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
        // Pre-fill form data
        setFormData({
          bio: res.data.bio || '',
          skills: res.data.skills || '',
          hourlyRate: res.data.hourlyRate || '',
          location: res.data.location || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        
        {/* Profile Header */}
        <div className="bg-blue-600 text-white p-6 sm:px-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-blue-100 mt-1 capitalize">{user.role} | {profile.location || 'Location not set'}</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-bold hover:bg-gray-100"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">Email</h3>
            <p className="text-gray-800">{user.email}</p>
          </div>

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  name="location"
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea 
                  name="bio"
                  rows="4" 
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                  value={formData.bio} 
                  onChange={handleChange} 
                />
              </div>

              {user.role === 'freelancer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                    <input 
                      type="text" 
                      name="skills"
                      className="w-full mt-1 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.skills} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                    <input 
                      type="number" 
                      name="hourlyRate"
                      className="w-full mt-1 px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.hourlyRate} 
                      onChange={handleChange} 
                    />
                  </div>
                </>
              )}
              
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                Save Changes
              </button>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Bio</h3>
                <p className="text-gray-800 mt-1 whitespace-pre-wrap">{profile.bio || 'No bio provided.'}</p>
              </div>

              {user.role === 'freelancer' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.skills ? profile.skills.split(',').map((skill, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700 border">
                          {skill.trim()}
                        </span>
                      )) : <span className="text-gray-500 italic">None specified</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">Hourly Rate</h3>
                    <p className="text-gray-800 mt-1 font-bold">
                      {profile.hourlyRate ? `$${profile.hourlyRate}/hr` : 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
