import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments } from '../services/api';

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
  
  const handleCompare = () => {
    setLoading(true);
    // Simulated compare result (backend integration can be added later)
    setTimeout(() => {
      setComparisonResult({
        similarities: 78,
        differences: 22,
        addedClauses: 3,
        removedClauses: 1,
        modifiedClauses: 5,
        keyChanges: [
          { type: 'addition', section: '4.2', description: 'Added intellectual property clause' },
          { type: 'removal', section: '2.1', description: 'Removed outdated payment terms' },
          { type: 'modification', section: '5.3', description: 'Modified confidentiality period from 1 year to 2 years' },
          { type: 'modification', section: '7.1', description: 'Changed dispute resolution from arbitration to mediation' },
          { type: 'modification', section: '9.4', description: 'Updated termination notice period from 30 to 60 days' },
        ]
      });
      setLoading(false);
    }, 1200);
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
                  <div>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">{comparisonResult.similarities}%</div>
                        <div className="text-sm text-gray-300">Similar</div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-400">{comparisonResult.differences}%</div>
                        <div className="text-sm text-gray-300">Different</div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{comparisonResult.addedClauses + comparisonResult.removedClauses}</div>
                        <div className="text-sm text-gray-300">Added/Removed</div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">{comparisonResult.modifiedClauses}</div>
                        <div className="text-sm text-gray-300">Modified</div>
                      </div>
                    </div>
                    
                    {/* Key Changes */}
                    <h3 className="text-lg font-medium mb-3">Key Changes</h3>
                    <div className="space-y-3">
                      {comparisonResult.keyChanges.map((change, index) => (
                        <div key={index} className="flex items-start p-3 rounded-lg bg-gray-700">
                          <div className={`mr-3 mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                            change.type === 'addition' ? 'bg-green-400' : 
                            change.type === 'removal' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>
                          <div>
                            <div className="font-medium">Section {change.section}</div>
                            <div className="text-gray-300 text-sm">{change.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        View Full Comparison
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Export Report
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Share Results
                      </button>
                    </div>
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