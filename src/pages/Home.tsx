import React, { useEffect, useState, useCallback } from 'react';
import { Search, MapPin, Users, Star, Building2, Warehouse, Briefcase, Music, Sun, Coffee, PartyPopper, Dumbbell, Utensils, Gift, Church, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, cachedQuery } from '../lib/supabase';
import { formatCurrency } from '../utils/format';
import CategorySlider from '../components/CategorySlider';

interface Spot {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  capacity: number;
  price_per_hour: number;
  type: string;
  featured_image: string | null;
  square_footage: number | null;
  rating: number;
}

const categories = [
  {
    id: 'party',
    name: 'Party Venues',
    description: 'Perfect for celebrations and gatherings',
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'gym',
    name: 'Gyms',
    description: 'Fitness and training spaces',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'picnic',
    name: 'Picnic Areas',
    description: 'Outdoor dining and relaxation',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'bridal_shower',
    name: 'Bridal Shower',
    description: 'Elegant celebration spaces',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'wedding',
    name: 'Wedding Reception',
    description: 'Romantic wedding venues',
    icon: Church,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'fundraiser',
    name: 'Fundraiser',
    description: 'Spaces for charitable events',
    icon: HeartHandshake,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'venue',
    name: 'Venues',
    description: 'Perfect for events and gatherings',
    icon: Warehouse,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'office',
    name: 'Office Spaces',
    description: 'Professional workspaces',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'studio',
    name: 'Studios',
    description: 'Creative and recording spaces',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'outdoor',
    name: 'Outdoor Spaces',
    description: 'Open-air locations',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'restaurant',
    name: 'Restaurants',
    description: 'Dining and entertainment',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  },
];

const Home = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = useCallback(async () => {
    try {
      const result = await cachedQuery('featured-spots', async () => {
        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        return data?.map(spot => ({
          ...spot,
          rating: 5,
          square_footage: spot.square_footage || Math.floor(Math.random() * (1000 - 100 + 1) + 100)
        })) || [];
      });

      setSpots(result);
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2048")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find the Perfect Spot for Your Next Event
          </h1>
          <p className="text-xl text-white mb-8">
            Discover unique venues for parties, weddings, festivals, and more
          </p>
          
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Where do you want to host your event?"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                  />
                </div>
              </div>
              <Link
                to="/explore"
                className="bg-[#2DD4BF] text-white px-6 py-2 rounded-md hover:bg-[#26b8a5] transition-colors flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spots Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Spots</h2>
          <Link
            to="/explore"
            className="text-[#2DD4BF] hover:text-[#26b8a5] font-medium"
          >
            View all spots →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spots available</h3>
            <p className="text-gray-600">Be the first to list your spot!</p>
            <Link
              to="/list-spot"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2DD4BF] hover:bg-[#26b8a5]"
            >
              List Your Spot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/spots/${spot.id}`} className="block relative w-full h-48">
                  <img
                    src={spot.featured_image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                    alt={spot.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    fetchpriority="low"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300" />
                </Link>

                <div className="p-4">
                  <div className="flex items-start gap-1 text-[#2DD4BF] mb-2">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{spot.city}</span>
                  </div>

                  {renderStars(spot.rating)}

                  <div className="mt-3 space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{spot.square_footage} sq. ft.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Max. Attendees: {spot.capacity}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-[#2DD4BF]">
                      {formatCurrency(spot.price_per_hour)}<span className="text-sm font-normal">/hr</span>
                    </div>
                    <Link
                      to={`/spots/${spot.id}`}
                      className="px-4 py-2 bg-[#2DD4BF] text-white rounded-md hover:bg-[#26b8a5] transition-colors"
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-lg text-gray-600">Find the perfect space for any occasion</p>
          </div>

          <div className="relative pb-8">
            <CategorySlider categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;