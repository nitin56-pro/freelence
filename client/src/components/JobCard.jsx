import { Link } from 'react-router-dom';
import { FaRegClock, FaDollarSign, FaUserTie, FaPaperPlane } from 'react-icons/fa';

const JobCard = ({ job }) => {
  // Format date safely
  const postedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  // Format skills cleanly
  const skills = Array.isArray(job?.skillsRequired) && job.skillsRequired.length > 0
    ? job.skillsRequired
    : (typeof job?.skills === 'string' ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  const clientName = job?.client?.name || job?.clientName || 'Verified Client';
  const clientCompany = job?.client?.company;
  const statusColor = job?.status === 'open'
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : job?.status === 'in-progress'
    ? 'bg-amber-100 text-amber-800 border-amber-200'
    : job?.status === 'completed'
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {job?.category || 'General'}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 hover:text-blue-600 transition">
              <Link to={`/jobs/${job?._id}`}>{job?.title}</Link>
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${statusColor}`}>
            {job?.status || 'OPEN'}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {job?.description}
        </p>

        {/* Budget & Proposals */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 font-medium mb-4">
          <div className="flex items-center text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            <FaDollarSign className="mr-0.5" />
            <span>${job?.budgetMin} - ${job?.budgetMax}</span>
          </div>
          {job?.proposalsCount !== undefined && (
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 text-xs">
              <FaPaperPlane className="mr-1.5 text-blue-500" />
              <span>{job.proposalsCount} {job.proposalsCount === 1 ? 'Proposal' : 'Proposals'}</span>
            </div>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="text-xs text-gray-500 self-center pl-1 font-medium">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 flex items-center gap-1">
            <FaUserTie className="text-gray-400" /> {clientName}
            {clientCompany && <span className="text-gray-400 font-normal">({clientCompany})</span>}
          </span>
          <span className="flex items-center gap-1 mt-0.5 text-gray-400">
            <FaRegClock /> Posted {postedDate}
          </span>
        </div>

        <Link
          to={`/jobs/${job?._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
