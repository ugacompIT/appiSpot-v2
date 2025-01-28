import React from 'react';
import SpotForm from '../components/SpotForm';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const ListSpot = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List Your Spot</h1>
          <p className="mt-2 text-gray-600">Share your space with others and start earning.</p>
        </div>

        {/* Guidelines Card */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-indigo-600 mt-0.5" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Listing Guidelines</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-2">
                <li>• Provide accurate and detailed information about your space</li>
                <li>• Include clear rules and guidelines for guests</li>
                <li>• Set a fair hourly rate based on your location and amenities</li>
                <li>• Be responsive to booking requests and inquiries</li>
                <li>• Keep your calendar up to date</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <SpotForm />
        </div>
      </div>
    </div>
  );
};

export default ListSpot;