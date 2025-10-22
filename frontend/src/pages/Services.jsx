import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Services() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">AI Technology</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              LegalEase AI leverages cutting-edge artificial intelligence to transform legal document analysis.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Document Analysis</h2>
            <p className="text-gray-300 mb-6">
              Our AI can process and analyze complex legal documents in seconds, identifying key clauses, potential risks, and important terms that might otherwise take hours to review manually.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Automated Summaries</h2>
            <p className="text-gray-300 mb-6">
              Get concise, accurate summaries of lengthy legal documents, helping you understand the key points without reading every page.
            </p>
            
            <h2 className="text-2xl font-bold mt-12 mb-4">Document Comparison</h2>
            <p className="text-gray-300 mb-6">
              Compare multiple versions of a document to quickly identify changes, additions, and deletions, saving hours of manual review.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Services;