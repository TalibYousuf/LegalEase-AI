import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Terms() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              Please read these terms carefully before using our services.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing or using our services, you agree to be bound by these Terms of Service.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Services</h2>
            <p className="text-gray-300 mb-6">
              You may use our services only as permitted by law and these Terms of Service.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Terms;