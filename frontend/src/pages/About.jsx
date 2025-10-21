import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">About LegalEase AI</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              LegalEase AI is revolutionizing the legal industry by leveraging cutting-edge artificial intelligence to make legal document analysis faster, more accurate, and more accessible.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              Our mission is to democratize access to legal insights by providing powerful AI tools that help legal professionals, businesses, and individuals understand complex legal documents without the traditional barriers of time and cost.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Story</h2>
            <p className="text-gray-300 mb-6">
              Founded in 2023 by a team of legal experts and AI researchers, LegalEase AI was born from the frustration of spending countless hours analyzing legal documents. We believed there had to be a better way, and we set out to build it.
            </p>
            <p className="text-gray-300 mb-6">
              After years of research and development, we've created a platform that can analyze, summarize, and compare legal documents with remarkable accuracy, saving our users hundreds of hours and providing insights that might otherwise be missed.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'CEO & Co-Founder',
                  bio: 'Former corporate attorney with 15 years of experience',
                  image: 'https://randomuser.me/api/portraits/women/23.jpg'
                },
                {
                  name: 'Michael Chen',
                  role: 'CTO & Co-Founder',
                  bio: 'AI researcher with PhD from Stanford University',
                  image: 'https://randomuser.me/api/portraits/men/45.jpg'
                },
                {
                  name: 'Aisha Patel',
                  role: 'Head of Legal Research',
                  bio: 'Specialized in contract law and legal document analysis',
                  image: 'https://randomuser.me/api/portraits/women/65.jpg'
                }
              ].map((member, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-indigo-400 mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Values</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-bold">Accuracy:</span> We're committed to providing the most accurate analysis possible, constantly refining our AI models.
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-bold">Accessibility:</span> We believe everyone should have access to powerful legal tools, regardless of budget or technical expertise.
                </div>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-bold">Innovation:</span> We're constantly pushing the boundaries of what's possible with AI in the legal field.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default About;