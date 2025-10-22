import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments, compareDocuments } from '../services/api';

function Comparison() {
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
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
      alert('Please select both documents to compare');
      return;
    }
    
    if (selectedA === selectedB) {
      alert('Please select two different documents to compare');
      return;
    }
    
    setLoading(true);
    try {
      const result = await compareDocuments(selectedA, selectedB);
      setComparisonResult(result);
    } catch (err) {
      console.error('Comparison failed', err);
      alert(err?.message || 'Failed to compare documents');
    } finally {
      setLoading(false);
    }
  };

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
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Highlight</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="additions" className="mr-2" defaultChecked />
                        <label htmlFor="additions">Additions</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="deletions" className="mr-2" defaultChecked />
                        <label htmlFor="deletions">Deletions</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="modifications" className="mr-2" defaultChecked />
                        <label htmlFor="modifications">Modifications</label>
                      </div>
                    </div>
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
                </div>
              </div>
            </div>
            
            {/* Comparison Results */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                <h2 className="text-xl font-semibold mb-4">Comparison Results</h2>
                
                {comparisonResult ? (
                  <div className="space-y-6">
                    {/* Document Info */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">Comparing Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-blue-400 font-medium">Document 1:</span>
                          <p className="text-gray-300">{comparisonResult.doc1?.filename}</p>
                        </div>
                        <div>
                          <span className="text-green-400 font-medium">Document 2:</span>
                          <p className="text-gray-300">{comparisonResult.doc2?.filename}</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {comparisonResult.comparison?.summary && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{comparisonResult.comparison.summary}</p>
                      </div>
                    )}

                    {/* Key Differences */}
                    {comparisonResult.comparison?.keyDifferences && comparisonResult.comparison.keyDifferences.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-400">🔍 Key Differences</h3>
                        <ul className="space-y-2">
                          {comparisonResult.comparison.keyDifferences.map((diff, index) => (
                            <li key={index} className="bg-red-900 bg-opacity-30 border border-red-800 rounded p-3">
                              <p className="text-red-200">{diff}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Similar Clauses */}
                    {comparisonResult.comparison?.similarClauses && comparisonResult.comparison.similarClauses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">✅ Similar Clauses</h3>
                        <ul className="space-y-2">
                          {comparisonResult.comparison.similarClauses.map((clause, index) => (
                            <li key={index} className="bg-green-900 bg-opacity-30 border border-green-800 rounded p-3">
                              <p className="text-green-200">{clause}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Unique to Document 1 */}
                    {comparisonResult.comparison?.uniqueToDoc1 && comparisonResult.comparison.uniqueToDoc1.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-400">📄 Unique to {comparisonResult.doc1?.filename}</h3>
                        <ul className="space-y-2">
                          {comparisonResult.comparison.uniqueToDoc1.map((clause, index) => (
                            <li key={index} className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded p-3">
                              <p className="text-blue-200">{clause}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Unique to Document 2 */}
                    {comparisonResult.comparison?.uniqueToDoc2 && comparisonResult.comparison.uniqueToDoc2.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-purple-400">📄 Unique to {comparisonResult.doc2?.filename}</h3>
                        <ul className="space-y-2">
                          {comparisonResult.comparison.uniqueToDoc2.map((clause, index) => (
                            <li key={index} className="bg-purple-900 bg-opacity-30 border border-purple-800 rounded p-3">
                              <p className="text-purple-200">{clause}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Assessment */}
                    {comparisonResult.comparison?.riskAssessment && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">⚠️ Risk Assessment</h3>
                        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded p-4">
                          <p className="text-yellow-200">{comparisonResult.comparison.riskAssessment}</p>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {comparisonResult.comparison?.recommendations && comparisonResult.comparison.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">💡 Recommendations</h3>
                        <ul className="space-y-2">
                          {comparisonResult.comparison.recommendations.map((rec, index) => (
                            <li key={index} className="bg-green-900 bg-opacity-30 border border-green-800 rounded p-3">
                              <p className="text-green-200">{rec}</p>
                            </li>
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