import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Cookies() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookies Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              Information about how we use cookies on our website.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies</h2>
            <p className="text-gray-300 mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Cookies</h2>
            <p className="text-gray-300 mb-6">
              We use cookies to enhance your experience on our website and to improve our services.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Cookies;