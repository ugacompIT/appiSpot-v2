import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const SpotDetails = React.lazy(() => import('../pages/SpotDetails'));
const ExploreSpots = React.lazy(() => import('../pages/ExploreSpots'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const ListSpot = React.lazy(() => import('../pages/ListSpot'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreSpots />} />
        <Route path="/spots/:id" element={<SpotDetails />} />
        <Route path="/list-spot" element={<ListSpot />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;