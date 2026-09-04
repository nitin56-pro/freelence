const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-bold mb-2">FreelanceHub</h2>
        <p className="text-gray-400 text-sm">
          A platform to connect top freelancers with great clients.
        </p>
        <p className="text-gray-500 text-xs mt-4">
          &copy; {year} FreelanceHub. BCA Final Year Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
