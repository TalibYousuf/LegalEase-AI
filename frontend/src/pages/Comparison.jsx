import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments, compareDocuments } from '../services/api';

function Comparison() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const docs = await listDocuments();
        setDocuments(docs);
        const docId = searchParams.get('docId');
        if (docId) {
          setSelectedA(docId);
        }
        if (docs.length) {
          setSelectedA((prev) => prev || docs[0].id);
          setSelectedB(docs.length > 1 ? docs[1].id : docs[0].id);
        }
      } catch (e) {
        console.error('Failed to load documents', e);
      }
    })();
  }, [searchParams]);
  
  const handleCompare = async () => {
    if (!selectedA || !selectedB) {
      setError('Please select two documents');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await compareDocuments(selectedA, selectedB);
      setResult(resp);
    } catch (e) {
      console.error('Compare failed', e);
      setError(e?.message || 'Failed to compare documents');
    } finally {
      setLoading(false);
    }
  };

  const comparison = result?.comparison;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Document Comparison</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document Selection Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Documents</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">First Document</label>
                  <select 
                    value={selectedA}
                    onChange={(e) => setSelectedA(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    {documents.length === 0 && <option value="">No documents</option>}
                    {documents.map(doc => (
                      <option key={`first-${doc.id}`} value={doc.id}>
                        {doc.filename}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Second Document</label>
                  <select 
                    value={selectedB}
                    onChange={(e) => setSelectedB(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    {documents.length === 0 && <option value="">No documents</option>}
                    {documents.map(doc => (
                      <option key={`second-${doc.id}`} value={doc.id}>
                        {doc.filename}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Comparison Options</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Comparison Type</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                      <option>Full Document</option>
                      <option>Selected Sections</option>
                      <option>Key Clauses Only</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleCompare}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Comparing...' : 'Compare Documents'}
                  </button>
                  {error && <p className="text-red-300 text-sm">{error}</p>}
                </div>
              </div>
            </div>
            
            {/* Comparison Results */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                <h2 className="text-xl font-semibold mb-4">Comparison Results</h2>
                
                {comparison ? (
                  <div>
                    <div className="mb-6">
                      <div className="text-gray-300 text-sm">Comparing:</div>
                      <div className="text-lg font-medium">{result.doc1?.filename} vs {result.doc2?.filename}</div>
                    </div>
                    {/* Summary */}
                    <div className="bg-gray-700 p-4 rounded-lg mb-6">
                      <div className="font-semibold mb-2">Summary</div>
                      <div className="text-gray-200 text-sm whitespace-pre-line">{comparison.summary}</div>
                    </div>
                    {/* Key Differences */}
                    {Array.isArray(comparison.keyDifferences) && comparison.keyDifferences.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Key Differences</h3>
                        <div className="space-y-3">
                          {comparison.keyDifferences.map((diff, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-gray-700">
                              <div className="text-gray-200 text-sm">{diff}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Recommendations */}
                    {Array.isArray(comparison.recommendations) && comparison.recommendations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                        <ul className="list-disc list-inside text-gray-300">
                          {comparison.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <p className="text-gray-400">Select two documents and click "Compare Documents" to see the differences</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Comparison;