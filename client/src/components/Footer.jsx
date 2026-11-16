import { Link } from 'react-router-dom';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white mb-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm shadow-xs">
                <FaBriefcase />
              </span>
              <span>Freelance<span className="text-blue-500">Hub</span></span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              A full-stack MERN freelance marketplace platform connecting top developer, design, and content talent with global clients.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link></li>
              <li><Link to="/post-job" className="hover:text-white transition">Post a Project</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition">User Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <FaGraduationCap className="text-blue-400" />
              <span>Academic Info</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              BCA / B.Tech Final Year Major Project.<br />
              Architecture: React 19, Node.js, Express, MongoDB.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {year} FreelanceHub. All rights reserved.</p>
          <p className="text-gray-400">Designed & Developed for University Capstone Evaluation</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
