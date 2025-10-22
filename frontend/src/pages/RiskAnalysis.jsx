import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments, analyzeRisks } from '../services/api';

function RiskAnalysis() {
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
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

  const handleAnalyzeRisks = async () => {
    if (!selectedId) {
      alert('Please select a document first');
      return;
    }
    setLoading(true);
    try {
      const res = await analyzeRisks(selectedId);
      setRiskAnalysis(res.riskAnalysis);
    } catch (err) {
      console.error('Risk analysis failed', err);
      alert(err?.message || 'Failed to analyze risks');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'low': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Risk Analysis</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Document Selection Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Document</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Choose Document</label>
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
                  
                  <button 
                    onClick={handleAnalyzeRisks}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Risks'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Risk Analysis Results */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                <h2 className="text-xl font-semibold mb-4">Risk Analysis Results</h2>
                
                {riskAnalysis ? (
                  <div className="space-y-6">
                    {/* Overall Risk Score */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Overall Risk Assessment</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskAnalysis.overallRiskLevel)}`}>
                            {riskAnalysis.overallRiskLevel?.toUpperCase() || 'UNKNOWN'}
                          </span>
                          {riskAnalysis.riskScore && (
                            <span className={`text-2xl font-bold ${getRiskScoreColor(riskAnalysis.riskScore)}`}>
                              {riskAnalysis.riskScore}/100
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Red Flags */}
                    {riskAnalysis.redFlags && riskAnalysis.redFlags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-400">🚨 Red Flags</h3>
                        <ul className="space-y-2">
                          {riskAnalysis.redFlags.map((flag, index) => (
                            <li key={index} className="bg-red-900 bg-opacity-30 border border-red-800 rounded p-3">
                              <p className="text-red-200">{flag}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Clauses */}
                    {riskAnalysis.missingClauses && riskAnalysis.missingClauses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">⚠️ Missing Clauses</h3>
                        <ul className="space-y-2">
                          {riskAnalysis.missingClauses.map((clause, index) => (
                            <li key={index} className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded p-3">
                              <p className="text-yellow-200">{clause}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Breakdown */}
                    {riskAnalysis.riskBreakdown && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Risk Breakdown by Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(riskAnalysis.riskBreakdown).map(([category, details]) => (
                            <div key={category} className="bg-gray-700 rounded p-4">
                              <h4 className="font-semibold text-blue-400 capitalize mb-2">{category}</h4>
                              <p className="text-gray-300 text-sm">{details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-400">💡 Recommendations</h3>
                        <ul className="space-y-2">
                          {riskAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded p-3">
                              <p className="text-blue-200">{rec}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <p className="text-gray-400">Select a document and click "Analyze Risks" to get started</p>
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

export default RiskAnalysis;
