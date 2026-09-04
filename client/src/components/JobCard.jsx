import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  // Format date to be readable
  const postedDate = new Date(job.createdAt || Date.now()).toLocaleDateString();
  
  // Format skills string if it exists
  const skills = job.skills ? job.skills.split(',') : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.category}</p>
        </div>
        
        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold
          ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {job.status ? job.status.toUpperCase() : 'OPEN'}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 font-semibold">Budget: ${job.budgetMin} - ${job.budgetMax}</p>
        
        {/* Render Skills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-200">
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <p>Client: {job.clientName || 'Anonymous'}</p>
          <p>Posted: {postedDate}</p>
        </div>
        
        <Link 
          to={`/jobs/${job._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
