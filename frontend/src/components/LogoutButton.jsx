import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ className }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication artifacts
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Notify app about auth change
    window.dispatchEvent(new Event('auth:changed'));
    // Redirect to login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-white hover:text-indigo-300 transition-colors ${className || ''}`}
    >
      Logout
    </button>
  );
}

export default LogoutButton;