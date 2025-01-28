import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Users, Star, Building2, Calendar, Clock, Shield, Wifi, Car, Coffee, Music, Accessibility, File as Toilet, X, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';
import ImageCarousel from '../components/ImageCarousel';
import ImageViewer from '../components/ImageViewer';

interface Spot {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  capacity: number;
  price_per_hour: number;
  type: string;
  features: {
    parking: boolean;
    wifi: boolean;
    accessibility: boolean;
    kitchen: boolean;
    sound_system: boolean;
    restrooms: boolean;
  };
  amenities: string[];
  rules: string;
  featured_image: string | null;
  square_footage: number;
  rating: number;
  gallery_images?: string[];
}

interface TimeInputs {
  hours: string;
  minutes: string;
}

const SpotDetails = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<TimeInputs>({ hours: '', minutes: '' });
  const [endTime, setEndTime] = useState<TimeInputs>({ hours: '', minutes: '' });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allImages = useMemo(() => {
    if (!spot) return [];
    return [
      spot.featured_image,
      ...(spot.gallery_images || [])
    ].filter((img): img is string => Boolean(img));
  }, [spot]);

  useEffect(() => {
    fetchSpotDetails();
  }, [id]);

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 7; i <= 23; i++) {
      options.push(i);
    }
    for (let i = 0; i <= 6; i++) {
      options.push(i);
    }
    return options;
  };

  const generateMinuteOptions = () => {
    const options = [];
    for (let i = 0; i < 60; i++) {
      options.push(i.toString().padStart(2, '0'));
    }
    return options;
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  const fetchSpotDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setSpot({
        ...data,
        rating: 5,
        square_footage: data.square_footage || 1000
      });
    } catch (error: any) {
      toast.error('Error loading spot details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
    );
  };

  const handleStartTimeChange = (type: 'hours' | 'minutes', value: string) => {
    const numValue = parseInt(value);
    if (type === 'hours' && (numValue < 0 || numValue > 23)) return;
    if (type === 'minutes' && (numValue < 0 || numValue > 59)) return;
    
    setStartTime(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleEndTimeChange = (type: 'hours' | 'minutes', value: string) => {
    const numValue = parseInt(value);
    if (type === 'hours' && (numValue < 0 || numValue > 23)) return;
    if (type === 'minutes' && (numValue < 0 || numValue > 59)) return;
    
    setEndTime(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearStartTime = () => {
    setStartTime({ hours: '', minutes: '' });
  };

  const clearEndTime = () => {
    setEndTime({ hours: '', minutes: '' });
  };

  const calculateTotalCost = useMemo(() => {
    if (!spot || !startTime.hours || !startTime.minutes || !endTime.hours || !endTime.minutes) {
      return null;
    }

    const startDate = new Date();
    startDate.setHours(parseInt(startTime.hours), parseInt(startTime.minutes), 0);

    const endDate = new Date();
    endDate.setHours(parseInt(endTime.hours), parseInt(endTime.minutes), 0);

    // If end time is before start time, assume it's the next day
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const totalCost = spot.price_per_hour * durationInHours;

    // Round to 2 decimal places
    return Math.round(totalCost * 100) / 100;
  }, [spot, startTime.hours, startTime.minutes, endTime.hours, endTime.minutes]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Booking functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2DD4BF]"></div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Spot not found</h2>
          <p className="mt-2 text-gray-600">The spot you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-4 sm:mb-8">
          <div className="lg:col-span-2">
            <div className="relative h-[250px] sm:h-[400px] rounded-lg overflow-hidden">
              {allImages.length === 1 ? (
                <img
                  src={allImages[0]}
                  alt={spot?.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setShowImageViewer(true);
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              ) : (
                <ImageCarousel
                  images={allImages}
                  onImageClick={(index) => {
                    setSelectedImageIndex(index);
                    setShowImageViewer(true);
                  }}
                />
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="w-full bg-[#2DD4BF] text-white py-3 rounded-md hover:bg-[#26b8a5] transition-colors font-medium mb-4"
            >
              {showBookingForm ? 'Hide Booking Form' : 'Show Booking Form'}
            </button>
          </div>

          <div className={`lg:block ${showBookingForm ? 'block' : 'hidden'}`}>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg h-fit">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl sm:text-2xl font-bold text-[#2DD4BF]">
                  {formatCurrency(spot.price_per_hour)}<span className="text-sm font-normal">/hr</span>
                </div>
                {renderStars(spot.rating)}
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <div className="relative flex space-x-2">
                      <select
                        value={startTime.hours}
                        onChange={(e) => handleStartTimeChange('hours', e.target.value)}
                        className="flex-1 border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF] text-sm"
                        required
                      >
                        <option value="">Hour</option>
                        {generateTimeOptions().map((hour) => (
                          <option key={hour} value={hour}>
                            {formatHour(hour)}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 self-center">:</span>
                      <select
                        value={startTime.minutes}
                        onChange={(e) => handleStartTimeChange('minutes', e.target.value)}
                        className="flex-1 border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF] text-sm"
                        required
                      >
                        <option value="">Min</option>
                        {generateMinuteOptions().map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                      {(startTime.hours || startTime.minutes) && (
                        <button
                          type="button"
                          onClick={clearStartTime}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <div className="relative flex space-x-2">
                      <select
                        value={endTime.hours}
                        onChange={(e) => handleEndTimeChange('hours', e.target.value)}
                        className="flex-1 border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF] text-sm"
                        required
                      >
                        <option value="">Hour</option>
                        {generateTimeOptions().map((hour) => (
                          <option key={hour} value={hour}>
                            {formatHour(hour)}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 self-center">:</span>
                      <select
                        value={endTime.minutes}
                        onChange={(e) => handleEndTimeChange('minutes', e.target.value)}
                        className="flex-1 border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF] text-sm"
                        required
                      >
                        <option value="">Min</option>
                        {generateMinuteOptions().map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                      {(endTime.hours || endTime.minutes) && (
                        <button
                          type="button"
                          onClick={clearEndTime}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out ${
                  calculateTotalCost !== null 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-4 pointer-events-none'
                }`}>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="h-5 w-5 text-[#2DD4BF] mr-2" />
                        <span className="font-medium">Total Cost:</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-bold text-[#2DD4BF]">
                          {calculateTotalCost !== null && formatCurrency(calculateTotalCost)}
                        </span>
                        {calculateTotalCost !== null && (
                          <span className="text-sm text-gray-500">
                            {`(${Math.round((calculateTotalCost / spot.price_per_hour) * 100) / 100} hours)`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2DD4BF] text-white py-3 rounded-md hover:bg-[#26b8a5] transition-colors font-medium"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{spot.name}</h1>
              <div className="flex items-center text-gray-600 mb-4 text-sm sm:text-base">
                <MapPin className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                <span className="break-words">{`${spot.address}, ${spot.city}, ${spot.state} ${spot.zip_code}`}</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{spot.description}</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {spot.features.wifi && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Wifi className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">WiFi</span>
                  </div>
                )}
                {spot.features.parking && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Car className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">Parking</span>
                  </div>
                )}
                {spot.features.kitchen && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Coffee className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">Kitchen</span>
                  </div>
                )}
                {spot.features.sound_system && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Music className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">Sound System</span>
                  </div>
                )}
                {spot.features.accessibility && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Accessibility className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">Accessible</span>
                  </div>
                )}
                {spot.features.restrooms && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Toilet className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                    <span className="text-sm sm:text-base">Restrooms</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
              <div className="prose text-gray-600 text-sm sm:text-base">
                {spot.rules || "No specific rules provided by the host."}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                    <span>Capacity</span>
                  </div>
                  <span className="font-medium">{spot.capacity} people</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                    <span>Space</span>
                  </div>
                  <span className="font-medium">{spot.square_footage} sq. ft.</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                    <span>Type</span>
                  </div>
                  <span className="font-medium capitalize">{spot.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                    <span>Min. Booking</span>
                  </div>
                  <span className="font-medium">1 hour</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="space-y-2">
                {spot.amenities && spot.amenities.length > 0 ? (
                  spot.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600 text-sm sm:text-base">
                      <Shield className="h-5 w-5 text-[#2DD4BF] mr-2 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">No additional amenities listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          images={allImages}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default SpotDetails;