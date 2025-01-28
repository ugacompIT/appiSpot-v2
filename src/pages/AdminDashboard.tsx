import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile } = useAuth();

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;