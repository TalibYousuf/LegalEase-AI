import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // React to route changes by recalculating auth state
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location]);

  // React to custom auth change events (e.g., logout)
  useEffect(() => {
    const onAuthChanged = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const toggleDropdown = () => {
    setDropdownOpen((v) => !v);
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
              <li><Link to="/services" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">AI Technology</Link></li>
              <li><Link to="/pricing" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">Pricing</Link></li>
              <li><Link to="/about" className="text-white hover:text-gray-300 transition-colors text-sm font-medium">About</Link></li>
            </ul>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button onClick={toggleDropdown} className="text-white hover:text-gray-300 text-sm font-medium flex items-center" aria-label="Open menu">
                {/* Three dots icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-white hover:bg-gray-700">Login</Link>
                      <Link to="/signup" className="block px-4 py-2 text-white hover:bg-gray-700">Sign up</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" className="block px-4 py-2 text-white hover:bg-gray-700">Dashboard</Link>
                       <Link to="/summary" className="block px-4 py-2 text-white hover:bg-gray-700">Summary</Link>
                       <Link to="/comparison" className="block px-4 py-2 text-white hover:bg-gray-700">Comparison</Link>
                       <Link to="/upload" className="block px-4 py-2 text-white hover:bg-gray-700">Upload Documents</Link>
                       <Link to="/payment" className="block px-4 py-2 text-white hover:bg-gray-700">Payment</Link>
                       <div className="px-4 py-2 border-t border-gray-700"><LogoutButton /></div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Removed standalone LogoutButton and Dashboard text link */}
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
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-black bg-opacity-95 shadow-lg`}>
        <div className="px-4 py-3 space-y-1">
          <Link to="/" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Home</Link>
          <Link to="/services" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">AI Technology</Link>
          <Link to="/pricing" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Pricing</Link>
          <Link to="/about" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">About</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Login</Link>
              <Link to="/signup" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Dashboard</Link>
              <Link to="/summary" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Summary</Link>
              <Link to="/comparison" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Comparison</Link>
              <Link to="/upload" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Upload Documents</Link>
              <Link to="/payment" className="block text-white hover:bg-gray-800 px-3 py-2 rounded-md">Payment</Link>
              <div className="px-3 py-2"><LogoutButton /></div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;