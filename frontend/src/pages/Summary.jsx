import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments, uploadDocument, generateSummary } from '../services/api';

function Summary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const docs = await listDocuments();
        setDocuments(docs);
        const docId = searchParams.get('docId');
        if (docId) {
          setSelectedId(docId);
        } else if (docs.length) {
          setSelectedId(docs[0].id);
        }
      } catch (e) {
        console.error('Failed to load documents', e);
      }
    })();
  }, [searchParams]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const doc = await uploadDocument(file);
      setDocuments((prev) => [doc, ...prev]);
      setSelectedId(doc.id);
    } catch (err) {
      console.error('Upload failed', err);
      alert(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedId) {
      alert('Please select or upload a document first');
      return;
    }
    setLoading(true);
    try {
      const res = await generateSummary(selectedId);
      setSummary(res.summary || null);
    } catch (err) {
      console.error('Summary generation failed', err);
      if (err?.error === 'openai_token_exhausted' || err?.message?.includes('token finished')) {
        alert('Error from OpenAI as token finished. Please check your API key or usage limits.');
      } else {
        alert(err?.message || 'Failed to generate summary');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = () => {
    if (!summary) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="text-gray-400">Upload or select a document, then click "Generate Summary"</p>
        </div>
      );
    }
    if (typeof summary === 'string') {
      return (
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-line">{summary}</p>
        </div>
      );
    }

    // Structured summary object
    const {
      executiveSummary,
      keyTerms = [],
      obligations = [],
      risks = [],
      recommendations = []
    } = summary || {};

    return (
      <div className="space-y-6">
        {executiveSummary && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
            <p className="text-gray-300 whitespace-pre-line">{executiveSummary}</p>
          </div>
        )}

        {Array.isArray(keyTerms) && keyTerms.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Terms</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {keyTerms.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(obligations) && obligations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Obligations</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {obligations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(risks) && risks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Risks</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {risks.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(recommendations) && recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {recommendations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Document Summary</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document Info Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select or Upload Document</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Existing Documents</label>
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      {documents.length === 0 && <option value="">No documents yet</option>}
                      {documents.map((d) => (
                        <option key={d.id} value={d.id}>{d.filename}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Upload New Document (PDF, DOCX, TXT)</label>
                    <input
                      type="file"
                      onChange={handleUpload}
                      className="w-full text-sm"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-gray-400 mt-2">Uploading...</p>}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Summary Options</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Summary Length</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                      <option>Brief (1-2 paragraphs)</option>
                      <option>Standard (3-5 paragraphs)</option>
                      <option>Detailed (6+ paragraphs)</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleGenerateSummary}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Summary'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Summary Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
                {renderSummary()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Summary;