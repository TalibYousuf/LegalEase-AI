import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Premium',
    documentsUploaded: 24,
    documentsAnalyzed: 18,
  };

  // Mock recent documents
  const recentDocuments = [
    { id: 1, title: 'Employment Contract', date: '2023-10-15', type: 'PDF', status: 'Analyzed' },
    { id: 2, title: 'NDA with Client X', date: '2023-10-10', type: 'DOCX', status: 'Analyzed' },
    { id: 3, title: 'Service Agreement', date: '2023-10-05', type: 'PDF', status: 'Uploaded' },
    { id: 4, title: 'Lease Agreement', date: '2023-09-28', type: 'PDF', status: 'Analyzed' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <div className="mt-4 md:mt-0">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded mr-3">
                Upload Document
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
                New Analysis
              </button>
            </div>
          </div>
          
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
              <p className="text-2xl font-bold">{user.name}</p>
              <p className="text-gray-400 mt-1">{user.plan} Plan</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Documents</h2>
              <p className="text-2xl font-bold">{user.documentsUploaded}</p>
              <p className="text-gray-400 mt-1">Total Uploaded</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Analyses</h2>
              <p className="text-2xl font-bold">{user.documentsAnalyzed}</p>
              <p className="text-gray-400 mt-1">Documents Analyzed</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-1">Usage</h2>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3 mb-2">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-gray-400 text-sm">75% of monthly limit</p>
            </div>
          </div>
          
          {/* Recent Documents */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Recent Documents</h2>
              <Link to="/documents" className="text-purple-400 hover:text-purple-300">
                View All
              </Link>
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
                  {recentDocuments.map(doc => (
                    <tr key={doc.id} className="border-b border-gray-700">
                      <td className="py-3 pr-6">{doc.title}</td>
                      <td className="py-3 pr-6">{doc.date}</td>
                      <td className="py-3 pr-6">{doc.type}</td>
                      <td className="py-3 pr-6">
                        <span className={`px-2 py-1 rounded text-xs ${
                          doc.status === 'Analyzed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {doc.status}
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
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/upload" className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span>Upload New Document</span>
                  </div>
                </Link>
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
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <p className="font-medium">Document Uploaded</p>
                  <p className="text-gray-400 text-sm">Service Agreement.pdf</p>
                  <p className="text-gray-400 text-xs mt-1">Today, 10:30 AM</p>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <p className="font-medium">Summary Generated</p>
                  <p className="text-gray-400 text-sm">NDA with Client X.docx</p>
                  <p className="text-gray-400 text-xs mt-1">Yesterday, 2:15 PM</p>
                </div>
                <div>
                  <p className="font-medium">Documents Compared</p>
                  <p className="text-gray-400 text-sm">Contract v1.0 and Contract v1.1</p>
                  <p className="text-gray-400 text-xs mt-1">Oct 15, 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Account Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan:</span>
                  <span className="font-medium">{user.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Renewal Date:</span>
                  <span className="font-medium">Nov 15, 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Documents Remaining:</span>
                  <span className="font-medium">25/100</span>
                </div>
                <div className="mt-4">
                  <Link to="/account" className="text-purple-400 hover:text-purple-300 text-sm">
                    Manage Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Dashboard;