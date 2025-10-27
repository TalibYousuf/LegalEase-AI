import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4001/api';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({ email, name }));
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
            
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button onClick={handleGoogle} className="w-full bg-white text-gray-900 font-medium py-2 px-4 rounded mb-4">
              Continue with Google
            </button>
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="px-3 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Signup;