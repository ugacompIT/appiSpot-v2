import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SpotForm from '../components/SpotForm';
import SpotList from '../components/SpotList';
import toast from 'react-hot-toast';

const HostDashboard = () => {
  const { user, profile } = useAuth();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSpots();
    }
  }, [user]);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('host_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error: any) {
      toast.error('Error loading spots');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this spot?')) return;

    try {
      const { error } = await supabase
        .from('spots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Spot deleted successfully');
      fetchSpots();
    } catch (error: any) {
      toast.error('Error deleting spot');
    }
  };

  const handleEdit = (spot: any) => {
    // TODO: Implement edit functionality
    toast.error('Edit functionality coming soon');
  };

  if (!profile || profile.role !== 'host') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Spots</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showForm ? (
              <>
                <X className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add New Spot
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Spot</h2>
            <SpotForm
              onSuccess={() => {
                fetchSpots();
                setShowForm(false);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading spots...</p>
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spots yet</h3>
            <p className="text-gray-600">Click the button above to add your first spot.</p>
          </div>
        ) : (
          <SpotList
            spots={spots}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default HostDashboard;