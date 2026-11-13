const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 text-white py-10 mt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Freelance<span className="text-blue-400">Hub</span></h2>
            <p className="text-slate-400 text-sm max-w-xs">
              A calmer place to find good work and the people who do it well.
            </p>
          </div>
          <div className="flex items-start gap-6 text-sm text-slate-400">
            <a href="/jobs" className="hover:text-white">Find work</a>
            <a href="/register" className="hover:text-white">Join the community</a>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-8 pt-5 border-t border-slate-800">
          &copy; {year} FreelanceHub. Built for independent work.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
