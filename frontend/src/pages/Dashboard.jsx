import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { listDocuments, uploadDocument } from '../services/api';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');
  const userInfo = useMemo(() => {
    try {
      if (!token) return null;
      // JWT payload is the middle part
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      return { name: payload.name, email: payload.email };
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const docs = await listDocuments();
        setDocuments(docs);
      } catch (e) {
        console.error('Failed to load documents', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const todayUploadCount = useMemo(() => {
    const today = new Date();
    return documents.filter((d) => {
      const dt = new Date(d.createdAt);
      return dt.getFullYear() === today.getFullYear() && dt.getMonth() === today.getMonth() && dt.getDate() === today.getDate();
    }).length;
  }, [documents]);
  const freeDailyLimit = 3;
  const remainingToday = Math.max(0, freeDailyLimit - todayUploadCount);
  const usagePct = Math.min(100, Math.round((todayUploadCount / freeDailyLimit) * 100));

  // Helper to detect analyzed documents across string/object summary shapes
  const isAnalyzed = (doc) => {
    const s = doc?.summary;
    if (!s) return false;
    if (typeof s === 'string') return s.length > 0;
    if (typeof s === 'object') return Object.keys(s).length > 0;
    return false;
  };
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(file);
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Upload failed', err);
      alert(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <div className="mt-4 md:mt-0">
              <label className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded mr-3 cursor-pointer">
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading || remainingToday === 0} />
                {uploading ? 'Uploading...' : remainingToday === 0 ? 'Daily Limit Reached' : 'Upload Document'}
              </label>
              <Link to="/summary" className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded inline-block">
                New Analysis
              </Link>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
              <p className="text-2xl font-bold">{userInfo?.name || 'User'}</p>
              <p className="text-gray-400 mt-1">Free Plan</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Documents</h2>
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-gray-400 mt-1">Total Uploaded</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Analyses</h2>
              <p className="text-2xl font-bold">{documents.filter(isAnalyzed).length}</p>
              <p className="text-gray-400 mt-1">Documents Analyzed</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Daily Uploads</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3 mb-2">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${usagePct}%` }}></div>
              </div>
              <p className="text-gray-400 text-sm">{todayUploadCount}/{freeDailyLimit} used today</p>
            </div>
          </div>

          {remainingToday === 0 && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 rounded p-4 mb-6">
              Daily limit reached for Free plan. Come back tomorrow or upgrade.
            </div>
          )}
          
          {/* Recent Documents */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Recent Documents</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 pr-6">Document</th>
                    <th className="pb-3 pr-6">Date</th>
                    <th className="pb-3 pr-6">Type</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 && (
                    <tr>
                      <td className="py-3 pr-6" colSpan={5}>{loading ? 'Loading...' : 'No documents yet'}</td>
                    </tr>
                  )}
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b border-gray-700">
                      <td className="py-3 pr-6">{doc.filename}</td>
                      <td className="py-3 pr-6">{new Date(doc.createdAt).toLocaleString()}</td>
                      <td className="py-3 pr-6">{(doc.mimetype || '').toUpperCase() || (doc.filename.split('.').pop() || '').toUpperCase()}</td>
                      <td className="py-3 pr-6">
                        <span className={`px-2 py-1 rounded text-xs ${isAnalyzed(doc) ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                          {isAnalyzed(doc) ? 'Analyzed' : 'Uploaded'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <Link className="text-purple-400 hover:text-purple-300" to={`/summary?docId=${doc.id}`}>Summary</Link>
                          <Link className="text-purple-400 hover:text-purple-300" to={`/comparison?docId=${doc.id}`}>Compare</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/summary" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Generate Summary</span>
                  </div>
                </Link>
                <Link to="/comparison" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <span>Compare Documents</span>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Account Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Documents Remaining Today:</span>
                  <span className="font-medium">{remainingToday}/{freeDailyLimit}</span>
                </div>
                <div className="mt-4">
                  <Link to="/pricing" className="text-purple-400 hover:text-purple-300 text-sm">
                    Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Tips</h2>
              <p className="text-gray-300">Upload documents to see real-time insights here. Your activity feed will populate as you work with your documents.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Dashboard;