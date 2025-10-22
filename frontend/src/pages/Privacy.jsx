import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              We respect your privacy and are committed to protecting your personal data.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-300 mb-6">
              We collect information you provide directly to us when you register for an account, use our services, or communicate with us.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 mb-6">
              We use the information we collect to provide, maintain, and improve our services, and to develop new ones.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Privacy;