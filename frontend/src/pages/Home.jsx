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
  <div className="min-h-screen bg-gray-900 text-white">
    <Header />

    {/* Hero Section */}
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black bg-cover bg-center opacity-80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
             <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 17L12 22L22 17" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 12L12 17L22 12" fill="#6d28d9" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Legal Document<br />Analysis Made Simple
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Upload your legal documents and get instant AI-powered summaries, risk analysis, and comparisons.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#upload" className="inline-block bg-purple-600 text-white font-medium py-2 px-6 rounded-md hover:bg-purple-700 transition-colors">
              Try It Now
            </a>
            <a href="/pricing" className="inline-block bg-transparent border border-white text-white font-medium py-2 px-6 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>

    {/* Company Logos */}
    <section className="py-10 bg-gray-900">
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
    <section id="upload" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 bg-opacity-80 rounded-lg shadow-xl p-8 border border-gray-700">
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
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-purple-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Summaries</h3>
            <p className="text-gray-400">Get concise summaries of complex legal documents in seconds, highlighting key terms and obligations.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-purple-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Risk Analysis</h3>
            <p className="text-gray-400">Identify potential legal risks and red flags in contracts before signing, with detailed explanations.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-purple-500 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Comparison</h3>
            <p className="text-gray-400">Compare multiple versions of contracts to quickly spot changes and understand their implications.</p>
          </div>
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
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4 text-yellow-400">★★★★★</div>
            <p className="text-gray-300 mb-4">"LegalEase AI has transformed how our firm handles contract review. What used to take hours now takes minutes."</p>
            <div className="font-medium">Sarah J.</div>
            <div className="text-sm text-gray-400">Corporate Attorney</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4 text-yellow-400">★★★★★</div>
            <p className="text-gray-300 mb-4">"The risk analysis feature has helped us identify critical issues in contracts that we might have otherwise missed."</p>
            <div className="font-medium">Michael T.</div>
            <div className="text-sm text-gray-400">Legal Operations Manager</div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="mb-4 text-yellow-400">★★★★★</div>
            <p className="text-gray-300 mb-4">"Document comparison has been a game-changer for our negotiation process. We can quickly see what's changed between versions."</p>
            <div className="font-medium">Elena R.</div>
            <div className="text-sm text-gray-400">In-house Counsel</div>
          </div>
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