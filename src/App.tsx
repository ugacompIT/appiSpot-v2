import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRoutes />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;