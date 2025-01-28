import React, { useState } from 'react';
import { MapPin, DollarSign, ListChecks, Shield, Plus, X, Info, Users, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ImageGallery from './ImageGallery';

interface SpotFormProps {
  onSuccess?: () => void;
}

const SpotForm: React.FC<SpotFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    capacity: '',
    square_footage: '',
    price_per_hour: '',
    rules: '',
    amenities: [] as string[],
    type: 'venue',
    images: [] as string[],
    features: {
      parking: false,
      wifi: false,
      accessibility: false,
      kitchen: false,
      sound_system: false,
      restrooms: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features],
      },
    }));
  };

  const handleAddAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()],
      }));
      setCurrentAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    setLoading(true);

    try {
      const spotData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        capacity: parseInt(formData.capacity),
        square_footage: parseInt(formData.square_footage),
        price_per_hour: parseFloat(formData.price_per_hour),
        amenities: formData.amenities,
        rules: formData.rules,
        type: formData.type,
        features: formData.features,
        featured_image: formData.images[0],
        gallery_images: formData.images.slice(1),
        status: 'active',
        host_id: '00000000-0000-0000-0000-000000000000'
      };

      const { data, error } = await supabase
        .from('spots')
        .insert(spotData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Spot created successfully!');
      
      // Navigate to the spot details page
      if (data) {
        navigate(`/spots/${data.id}`);
      }
      
      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <Info className="h-6 w-6 text-indigo-600" />
          <h2>Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Spot Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Cozy Downtown Studio"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Spot Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="venue">Venue</option>
              <option value="studio">Studio</option>
              <option value="office">Office Space</option>
              <option value="outdoor">Outdoor Space</option>
              <option value="restaurant">Restaurant</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Describe your spot in detail..."
          />
        </div>

        <ImageGallery
          images={formData.images}
          onChange={(images) => setFormData(prev => ({ ...prev, images }))}
        />
      </div>

      {/* Location */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <MapPin className="h-6 w-6 text-indigo-600" />
          <h2>Location</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              required
              value={formData.zip_code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Capacity and Pricing */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <DollarSign className="h-6 w-6 text-indigo-600" />
          <h2>Capacity and Pricing</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Maximum Capacity *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">people</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700">
              Square Footage *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="square_footage"
                name="square_footage"
                required
                min="1"
                value={formData.square_footage}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">sq. ft.</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700">
              Price per Hour *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="price_per_hour"
                name="price_per_hour"
                required
                min="0"
                step="0.01"
                value={formData.price_per_hour}
                onChange={handleChange}
                className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">/hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features and Amenities */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <ListChecks className="h-6 w-6 text-indigo-600" />
          <h2>Features and Amenities</h2>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(formData.features).map(([feature, enabled]) => (
              <button
                key={feature}
                type="button"
                onClick={() => handleFeatureToggle(feature)}
                className={`p-4 rounded-lg border ${
                  enabled
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700'
                } hover:bg-indigo-50 transition-colors duration-200`}
              >
                <span className="text-sm font-medium capitalize">
                  {feature.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="amenity" className="block text-sm font-medium text-gray-700">
              Additional Amenities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="amenity"
                value={currentAmenity}
                onChange={(e) => setCurrentAmenity(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., Projector"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="ml-2 inline-flex items-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h2>Rules and Guidelines</h2>
        </div>
        
        <div>
          <label htmlFor="rules" className="block text-sm font-medium text-gray-700">
            House Rules
          </label>
          <textarea
            id="rules"
            name="rules"
            rows={4}
            value={formData.rules}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="List any rules or guidelines for using your spot..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          {loading ? 'Creating...' : 'Create Spot'}
        </button>
      </div>
    </form>
  );
};

export default SpotForm;