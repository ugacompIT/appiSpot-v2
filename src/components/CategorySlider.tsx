import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

interface CategorySliderProps {
  categories: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 6; // Show 6 items per page (3x2 grid)
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(current => 
      current === totalPages - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(current => 
      current === 0 ? totalPages - 1 : current - 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match transition duration

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden group">
      <div 
        ref={sliderRef}
        className="relative flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* Create pages of 6 categories (3x2 grid) */}
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div 
            key={pageIndex}
            className="w-full flex-shrink-0"
            style={{ paddingRight: pageIndex === totalPages - 1 ? 0 : '1.5rem' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((category) => (
                  <Link
                    key={category.id}
                    to={`/explore?type=${category.id}`}
                    className="group relative h-48 overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                      <div className="flex items-center space-x-2 text-white mb-1 sm:mb-2">
                        <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        <h3 className="text-lg sm:text-xl font-bold">{category.name}</h3>
                      </div>
                      <p className="text-gray-200 text-xs sm:text-sm line-clamp-2">{category.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous categories"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next categories"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && setCurrentIndex(index)}
            disabled={isTransitioning}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#2DD4BF] w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to category page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;