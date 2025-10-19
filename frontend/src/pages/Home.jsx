import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const [documentSummary, setDocumentSummary] = useState(null);

  const handleUploadStart = () => {
    setIsUploading(true);
    setError('');
  };

  const handleUploadSuccess = (fileName) => {
    setIsUploading(false);
    setUploadedFile(fileName);
    
    // Simulate getting a document summary from the backend
    setDocumentSummary({
      title: "Sample Contract Agreement",
      summary: "This agreement outlines the terms and conditions between Party A and Party B for software development services. Key points include payment terms, intellectual property rights, and termination clauses.",
      keyPoints: [
        "Payment of $10,000 due within 30 days of project completion",
        "All intellectual property rights transfer to client upon final payment",
        "Either party may terminate with 14 days written notice",
        "Confidentiality provisions survive termination of agreement"
      ]
    });
  };

  const handleUploadError = (errorMessage) => {
    setIsUploading(false);
    setError(errorMessage);
  };

  return (
  <div className="min-h-screen bg-black text-white">
    <Header />

    {/* Hero Section */}
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black bg-cover bg-center opacity-80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            The #1 AI Agent<br />for customer service
          </h1>
          <div className="flex justify-center space-x-4 mb-16">
            <span className="text-sm text-gray-400">#1 IN PERFORMANCE BENCHMARKS</span>
            <span className="text-sm text-gray-400">#1 IN COMPETITIVE BAKE-OFFS</span>
            <span className="text-sm text-gray-400">#1 RANKING ON G2</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#upload" className="inline-block bg-white text-black font-medium py-2 px-6 rounded-md hover:bg-gray-100 transition-colors">
              Start free trial
            </a>
            <a href="#features" className="inline-block bg-transparent border border-white text-white font-medium py-2 px-6 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
              View demo
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Company Logos */}
    <section className="py-10 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          <div className="text-gray-400 text-lg">Amplitude</div>
          <div className="text-gray-400 text-lg">Synthesia</div>
          <div className="text-gray-400 text-lg">LauraDarby</div>
          <div className="text-gray-400 text-lg">Coda</div>
          <div className="text-gray-400 text-lg">Shutterstock</div>
          <div className="text-gray-400 text-lg">Loopla</div>
        </div>
      </div>
    </section>

    {/* Upload Section */}
    <section id="upload" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Upload Your Document
            </h2>

            <FileUpload 
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              isUploading={isUploading}
            />

            {error && (
              <div className="bg-red-900 bg-opacity-20 text-red-400 p-4 rounded-md mt-4 border border-red-800">
                <p>{error}</p>
              </div>
            )}

            {documentSummary && (
              <div className="mt-8 border-t border-gray-800 pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {documentSummary.title}
                </h3>
                <div className="bg-black bg-opacity-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-300 mb-2">Summary</h4>
                  <p className="text-gray-400">{documentSummary.summary}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-300 mb-2">Key Points</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {documentSummary.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-400">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          How LegalEase AI Helps You
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature cards here */}
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="py-20 bg-gray-800 bg-opacity-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Testimonial cards here */}
        </div>
      </div>
    </section>

    {/* CTA Section
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Legal Document Workflow?</h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
          Join thousands of legal professionals who are saving time and gaining deeper insights with LegalEase AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#upload" className="inline-block bg-white text-blue-600 font-medium py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
            Try It Now
          </a>
          <a href="/contact" className="inline-block bg-transparent border border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
            Contact Sales
          </a>
        </div>
      </div>
    </section> */}

    <Footer />
  </div>
);
}
export default Home;