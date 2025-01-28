import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, MapPin, Users, Star, Building2, Warehouse, Briefcase, Music, Sun, Coffee } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase, cachedQuery } from '../lib/supabase';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

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

const ExploreSpots = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    priceRange: '',
    capacity: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = useMemo(() => {
    return categories.find(cat => cat.id === filters.type);
  }, [filters.type]);

  const fetchSpots = useCallback(async () => {
    try {
      const result = await cachedQuery(`spots-${filters.type || 'all'}`, async () => {
        let query = supabase
          .from('spots')
          .select('*')
          .order('created_at', { ascending: false });

        // Only apply type filter if a category is selected
        if (filters.type) {
          query = query.eq('type', filters.type);
        }

        const { data, error } = await query;

        if (error) throw error;

        return data?.map(spot => ({
          ...spot,
          rating: 5,
          square_footage: spot.square_footage || Math.floor(Math.random() * (1000 - 100 + 1) + 100)
        })) || [];
      }, {
        // Enable stale-while-revalidate for smoother UX
        staleWhileRevalidate: true,
        // Cache for 15 minutes
        ttl: 1000 * 60 * 15
      });

      setSpots(result);
    } catch (error: any) {
      toast.error('Error loading spots');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.type]);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const filteredSpots = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return spots.filter(spot => {
      // Search filter
      const matchesSearch = searchTerm === '' || [
        spot.name,
        spot.description,
        spot.city,
        spot.state
      ].some(field => field?.toLowerCase().includes(searchTermLower));
      
      // Capacity filter
      const matchesCapacity = !filters.capacity || (
        filters.capacity === 'small' ? spot.capacity <= 20 :
        filters.capacity === 'medium' ? spot.capacity > 20 && spot.capacity <= 50 :
        filters.capacity === 'large' ? spot.capacity > 50 : true
      );

      // Price filter
      const matchesPrice = !filters.priceRange || (
        filters.priceRange === 'budget' ? spot.price_per_hour <= 50 :
        filters.priceRange === 'mid' ? spot.price_per_hour > 50 && spot.price_per_hour <= 150 :
        filters.priceRange === 'premium' ? spot.price_per_hour > 150 : true
      );

      return matchesSearch && matchesCapacity && matchesPrice;
    });
  }, [spots, searchTerm, filters]);

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
    );
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL params for category filter
    if (key === 'type') {
      if (value) {
        setSearchParams({ type: value });
      } else {
        searchParams.delete('type');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, setSearchParams]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        {currentCategory && (
          <div className="mb-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
              <img
                src={currentCategory.image}
                alt={currentCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 text-white mb-2">
                  <currentCategory.icon className="h-6 w-6" />
                  <h1 className="text-2xl sm:text-3xl font-bold">{currentCategory.name}</h1>
                </div>
                <p className="text-gray-200">{currentCategory.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            <button
              onClick={() => handleFilterChange('type', '')}
              className={`px-4 py-2 rounded-full transition-colors ${
                !filters.type
                  ? 'bg-[#2DD4BF] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Spots
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange('type', category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  filters.type === category.id
                    ? 'bg-[#2DD4BF] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">Any Size</option>
                  <option value="small">Small (≤ 20)</option>
                  <option value="medium">Medium (21-50)</option>
                  <option value="large">Large (50+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">Any Price</option>
                  <option value="budget">Budget (≤ $50/hr)</option>
                  <option value="mid">Mid-Range ($51-150/hr)</option>
                  <option value="premium">Premium ($150+/hr)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No spots found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpots.map((spot) => (
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
    </div>
  );
};

export default ExploreSpots;