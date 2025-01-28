import React from 'react';
import { MapPin, Users, Clock, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Spot {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  price_per_hour: number;
  status: string;
  featured_image: string | null;
}

interface SpotListProps {
  spots: Spot[];
  onEdit: (spot: Spot) => void;
  onDelete: (id: string) => void;
}

const SpotList: React.FC<SpotListProps> = ({ spots, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {spots.map((spot) => (
        <div
          key={spot.id}
          className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-48">
            {spot.featured_image ? (
              <img
                src={spot.featured_image}
                alt={spot.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{spot.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                spot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {spot.status}
              </span>
            </div>
            
            <p className="mt-2 text-gray-600 line-clamp-2">{spot.description}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{`${spot.address}, ${spot.city}, ${spot.state}`}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Capacity: {spot.capacity}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{formatCurrency(spot.price_per_hour)}/hour</span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => onEdit(spot)}
                className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={() => onDelete(spot.id)}
                className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotList;