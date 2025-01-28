import React from 'react';
import { Users, Shield, Clock, Map } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">About appiSpot</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            We're revolutionizing the way people find and book unique spaces for their events and activities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community First</h3>
            <p className="text-sm sm:text-base text-gray-600">Bringing people together through shared spaces</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
            <p className="text-sm sm:text-base text-gray-600">Safe and secure transactions for peace of mind</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center">
            <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Flexible Hours</h3>
            <p className="text-sm sm:text-base text-gray-600">Book spaces by the hour, on your schedule</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center">
            <Map className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg font-semibold mb-2">Local Spaces</h3>
            <p className="text-sm sm:text-base text-gray-600">Discover unique venues in your area</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            At appiSpot, we believe that every space has potential and every gathering deserves the perfect venue. 
            Our mission is to connect space owners with people who need them, creating opportunities for meaningful 
            experiences and community connections. Whether you're hosting a workshop, celebration, or meeting, 
            we're here to help you find the ideal spot.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;