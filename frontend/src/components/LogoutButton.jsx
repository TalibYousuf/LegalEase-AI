import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ className }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear authentication tokens here
    // For example: localStorage.removeItem('authToken');
    
    // For demonstration purposes, we'll just simulate a logout
    console.log('User logged out');
    
    // Redirect to home page after logout
    navigate('/');
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