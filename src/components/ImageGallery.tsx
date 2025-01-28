import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../lib/storage';
import toast from 'react-hot-toast';

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onChange, maxImages = 10 }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding new images would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    const loadingToast = toast.loading(`Processing ${files.length} image${files.length > 1 ? 's' : ''}...`);

    try {
      const uploadPromises = files.map(file => uploadImage(file, 'gallery'));
      const newImages = await Promise.all(uploadPromises);
      onChange([...images, ...newImages]);
      toast.dismiss(loadingToast);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Image Gallery *
      </label>
      <p className="text-sm text-gray-500 mb-4">
        Upload up to {maxImages} images of your spot. First image will be the featured image.
      </p>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden group bg-gray-100"
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading={index < 4 ? 'eager' : 'lazy'}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-[#2DD4BF] text-white text-xs font-medium rounded shadow-sm">
                Featured
              </div>
            )}
          </div>
        ))}
        
        {images.length < maxImages && (
          <div className="relative aspect-[4/3] sm:aspect-square">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="gallery-upload"
              multiple
              aria-label="Upload images"
            />
            <label
              htmlFor="gallery-upload"
              className="flex flex-col justify-center items-center h-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#2DD4BF] transition-all duration-300 group bg-white hover:bg-gray-50"
            >
              <div className="flex flex-col items-center text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-[#2DD4BF] transition-colors duration-300" />
                <span className="mt-2 text-sm font-medium text-gray-600 group-hover:text-gray-900">Add Images</span>
                <span className="mt-1 text-xs text-gray-500">
                  {maxImages - images.length} spot{maxImages - images.length !== 1 ? 's' : ''} remaining
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {images.length === 0 && (
        <p className="text-sm text-red-500 mt-2 flex items-center">
          <X className="h-4 w-4 mr-1" />
          At least one image is required
        </p>
      )}
    </div>
  );
};

export default ImageGallery;