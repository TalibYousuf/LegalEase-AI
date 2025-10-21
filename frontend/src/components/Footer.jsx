import React from 'react';

function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-6 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} LegalEase AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;