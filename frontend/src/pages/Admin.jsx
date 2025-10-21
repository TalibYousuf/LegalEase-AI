import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Admin() {
  // Mock data for admin dashboard
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Admin', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Inactive' },
  ]);

  const stats = {
    totalUsers: 42,
    activeUsers: 38,
    documentsProcessed: 156,
    averageProcessingTime: '2.3 minutes',
    storageUsed: '1.2 GB',
  };

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Uploaded document', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Generated summary', time: '3 hours ago' },
    { id: 3, user: 'Robert Johnson', action: 'Compared documents', time: '5 hours ago' },
    { id: 4, user: 'Emily Davis', action: 'Created account', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Total Users:</span>
                  <span>{stats.totalUsers}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Active Users:</span>
                  <span>{stats.activeUsers}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Document Statistics</h2>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Processed:</span>
                  <span>{stats.documentsProcessed}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Avg. Processing Time:</span>
                  <span>{stats.averageProcessingTime}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-400">Storage Used:</span>
                  <span>{stats.storageUsed}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">System Status:</span>
                  <span className="text-green-400">Online</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* User Management */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 pr-6">Name</th>
                    <th className="pb-3 pr-6">Email</th>
                    <th className="pb-3 pr-6">Role</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-3 pr-6">{user.name}</td>
                      <td className="py-3 pr-6">{user.email}</td>
                      <td className="py-3 pr-6">{user.role}</td>
                      <td className="py-3 pr-6">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-purple-400 hover:text-purple-300 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex justify-between border-b border-gray-700 pb-3">
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-400"> - {activity.action}</span>
                  </div>
                  <span className="text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Admin;