import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find the Best Freelancers
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Connect with talented professionals for your projects, or find great jobs to match your skills.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/jobs" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-md transition"
            >
              Find Jobs
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition border border-blue-500"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-4">Post Jobs</h3>
              <p className="text-gray-600">
                Clients can easily post new job requirements with budget and required skills.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-4">Find Talent</h3>
              <p className="text-gray-600">
                Freelancers browse available jobs and submit proposals to win the work.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-4">Get Paid</h3>
              <p className="text-gray-600">
                Work together to complete projects successfully.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
