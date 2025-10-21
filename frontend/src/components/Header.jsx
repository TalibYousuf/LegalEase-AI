import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black bg-opacity-90 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-white no-underline flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div className="h-6 border-l border-gray-600 mx-4"></div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4 lg:space-x-6">
              <li><Link to="/" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Home</Link></li>
              <li className="relative group">
                <Link to="/product" className="text-white hover:text-gray-300 transition-colors text-sm font-medium flex items-center">
                  Product
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
              </li>
              <li className="relative group">
                <Link to="/ai-technology" className="text-white hover:text-gray-300 transition-colors text-sm font-medium flex items-center">
                  AI Technology
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
              </li>
              <li><Link to="/customers" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Customers</Link></li>
              <li className="relative group">
                <Link to="/resources" className="text-white hover:text-gray-300 transition-colors text-sm font-medium flex items-center">
                  Resources
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </Link>
              </li>
              <li><Link to="/pricing" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Pricing</Link></li>
              <li><Link to="/about" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">About</Link></li>
            </ul>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Contact sales</Link>
            <Link to="/login" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Login</Link>
            <Link to="/signup" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Sign up</Link>
            <Link to="/dashboard" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Dashboard</Link>
            <LogoutButton className="text-sm font-medium" />
            <Link to="/trial" className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">Start free trial</Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black bg-opacity-95 shadow-lg`}>
        <div className="px-4 py-3 space-y-1">
          <Link to="/" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Home</Link>
          <Link to="/product" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Product</Link>
          <Link to="/ai-technology" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">AI Technology</Link>
          <Link to="/customers" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Customers</Link>
          <Link to="/resources" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Resources</Link>
          <Link to="/pricing" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Pricing</Link>
          <Link to="/about" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">About</Link>
          <Link to="/contact" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Contact sales</Link>
          <Link to="/login" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Login</Link>
          <Link to="/signup" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Sign up</Link>
          <Link to="/dashboard" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Dashboard</Link>
          <div className="px-3 py-2">
            <LogoutButton />
          </div>
          <Link to="/trial" className="block bg-white text-gray-900 px-3 py-2 rounded-md">Start free trial</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;