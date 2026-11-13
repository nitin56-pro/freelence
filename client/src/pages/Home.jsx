import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaCode, 
  FaMobileAlt, 
  FaPaintBrush, 
  FaPenNib, 
  FaCloud, 
  FaRobot, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaStar, 
  FaArrowRight 
} from 'react-icons/fa';

const categories = [
  { name: 'Web Development', icon: FaCode, count: '120+ Jobs', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Mobile App', icon: FaMobileAlt, count: '85+ Jobs', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Design', icon: FaPaintBrush, count: '94+ Jobs', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Writing', icon: FaPenNib, count: '45+ Jobs', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'DevOps & Cloud', icon: FaCloud, count: '38+ Jobs', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { name: 'AI & Data Science', icon: FaRobot, count: '62+ Jobs', color: 'text-rose-600 bg-rose-50 border-rose-200' }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white py-16 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold mb-6 border border-blue-200/60 shadow-xs">
            <FaShieldAlt className="text-blue-600" />
            <span>Independent talent. Serious results.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find the right people for the work that matters
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl mx-auto font-normal leading-relaxed">
            FreelanceHub brings thoughtful clients and proven specialists together. Find your next project, or bring the right person onto your team.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleHeroSearch} className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex-1 flex items-center px-4 py-2">
              <FaSearch className="text-gray-400 mr-3 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by skill (e.g. React, Node.js, Figma)..."
                className="w-full text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <FaArrowRight className="text-xs" />
            </button>
          </form>

          {/* Quick CTA Pills */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm font-semibold">
            <span className="text-gray-500">Popular:</span>
            <Link to="/jobs?category=Web%20Development" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              Web Development
            </Link>
            <Link to="/jobs?category=Mobile%20App" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              Mobile App
            </Link>
            <Link to="/jobs?category=Design" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              UI/UX Design
            </Link>
            <Link to="/jobs?category=Writing" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              Technical Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Metrics Bar */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-black text-gray-900 tracking-tight">1,500+</div>
              <div className="text-sm font-medium text-gray-500 mt-1">Verified Freelancers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black text-blue-600 tracking-tight">3,200+</div>
              <div className="text-sm font-medium text-gray-500 mt-1">Completed Contracts</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black text-emerald-600 tracking-tight">99.2%</div>
              <div className="text-sm font-medium text-gray-500 mt-1">Client Satisfaction</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black text-purple-600 tracking-tight">&lt; 24h</div>
              <div className="text-sm font-medium text-gray-500 mt-1">Average First Proposal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-gray-600 mt-3 text-base">
              Find projects that align with your specialized technical skills or hire domain experts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition group flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border ${cat.color}`}>
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition text-lg">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 mt-1">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">How FreelanceHub Works</h2>
            <p className="text-gray-600 mt-2">
              Designed for transparency, speed, and real-time collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50/80 p-8 rounded-2xl border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Post or Browse Jobs</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clients post project requirements with budget and timelines. Freelancers discover matching gigs tailored to their tech stack.
              </p>
            </div>

            <div className="bg-gray-50/80 p-8 rounded-2xl border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bid & Collaborate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Freelancers submit competitive proposals with delivery milestones. Clients review portfolios, accept proposals, and initiate work.
              </p>
            </div>

            <div className="bg-gray-50/80 p-8 rounded-2xl border border-gray-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deliver & Review</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete deliverables, mark contracts done, and exchange mutual star ratings and written reviews to build verified reputations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Made for good work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
                A simpler way to work together
              </h2>
              <p className="text-gray-600 mt-4 text-base leading-relaxed">
                From the first conversation to the final handoff, keep the work, feedback, and next steps in one clear place.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Clear expectations</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Share the brief, budget, and timeline before the work begins.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Better matches</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Compare relevant proposals and choose based on fit, not noise.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Reputation that travels</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Build trust through honest reviews after every completed project.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900">A healthy project brief</h4>
                  <p className="text-xs text-gray-500">The details clients and freelancers actually need</p>
                </div>
                <div className="flex items-center text-amber-500 gap-1 text-sm font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <FaStar />
                  <span>Trusted by both sides</span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">A clear scope</span>
                  <span className="font-bold text-blue-600">What needs to be done</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">A fair budget</span>
                  <span className="font-bold text-emerald-600">Value for good work</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">A real timeline</span>
                  <span className="font-bold text-purple-600">No surprise deadlines</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">A shared finish line</span>
                  <span className="font-bold text-gray-800">Work you can be proud of</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Link
                  to="/jobs"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition"
                >
                  Explore Jobs Live
                </Link>
                <Link
                  to="/register"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl text-center text-sm transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to get moving?
          </h2>
          <p className="mt-4 text-blue-100 text-base max-w-xl mx-auto">
            Join a community built around useful briefs, honest proposals, and work that gets finished.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl border border-blue-500 shadow-lg transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
