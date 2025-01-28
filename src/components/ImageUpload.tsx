import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../lib/storage';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const loadingToast = toast.loading('Processing image...');
      const base64 = await uploadImage(file, 'featured');
      toast.dismiss(loadingToast);
      toast.success('Image processed successfully');
      onChange(base64);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Featured Image
      </label>
      
      {value ? (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Featured"
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  Upload an image
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;