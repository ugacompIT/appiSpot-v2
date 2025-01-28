import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(current => 
      current === images.length - 1 ? 0 : current + 1
    );
  }, [images.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(current => 
      current === 0 ? images.length - 1 : current - 1
    );
  }, [images.length, isTransitioning]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match the transition duration

    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!images.length) return null;

  return (
    <div className="relative h-full w-full group touch-pan-y">
      <div 
        className="relative h-full overflow-hidden rounded-lg bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="absolute w-full h-full transition-transform duration-500 ease-out cursor-pointer"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onClick={() => onImageClick?.(currentIndex)}
        >
          <div className="flex h-full" style={{ width: `${images.length * 100}%` }}>
            {images.map((image, index) => (
              <div 
                key={index}
                className="relative h-full"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : 'low'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:p-3"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:p-3"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && setCurrentIndex(index)}
            disabled={isTransitioning}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-3 sm:w-4' 
                : 'bg-white/50 hover:bg-white/75'
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;