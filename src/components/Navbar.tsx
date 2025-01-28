import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#00D1FF]">appi</span>
                <span className="text-black">Sp</span>
                <span className="text-[#00D1FF]">ot</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/explore"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/explore') ? 'text-[#00D1FF]' : 'text-gray-700 hover:text-[#00D1FF]'
              }`}
            >
              Explore Spots
            </Link>

            <Link
              to="/list-spot"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/list-spot') ? 'text-[#00D1FF]' : 'text-gray-700 hover:text-[#00D1FF]'
              }`}
            >
              List Your Spot
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/about') ? 'text-[#00D1FF]' : 'text-gray-700 hover:text-[#00D1FF]'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contact') ? 'text-[#00D1FF]' : 'text-gray-700 hover:text-[#00D1FF]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#00D1FF] focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/explore"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/explore') ? 'text-[#00D1FF] bg-gray-50' : 'text-gray-700 hover:text-[#00D1FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Spots
            </Link>

            <Link
              to="/list-spot"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/list-spot') ? 'text-[#00D1FF] bg-gray-50' : 'text-gray-700 hover:text-[#00D1FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              List Your Spot
            </Link>

            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') ? 'text-[#00D1FF] bg-gray-50' : 'text-gray-700 hover:text-[#00D1FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/contact') ? 'text-[#00D1FF] bg-gray-50' : 'text-gray-700 hover:text-[#00D1FF] hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;