import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [location.search, navigate]);
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <p>Completing login...</p>
    </div>
  );
}

export default LoginCallback;