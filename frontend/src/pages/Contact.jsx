import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xl text-gray-300 mb-6">
                Have questions about our services? Get in touch with our team.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input type="email" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea rows="4" className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"></textarea>
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded">
                  Send Message
                </button>
              </form>
            </div>
            
            <div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">contact@legalease.ai</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Address</p>
                    <p className="text-white">123 Legal Street<br />San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Contact;