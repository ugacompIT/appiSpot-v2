/*
  # Add Gallery Images Support

  1. Changes
    - Add gallery_images column to spots table to store multiple images
    - Default to empty array if no gallery images

  2. Notes
    - Uses JSONB array to store multiple image URLs
    - Maintains backward compatibility with existing spots
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'gallery_images'
  ) THEN
    ALTER TABLE spots ADD COLUMN gallery_images text[] DEFAULT '{}';
  END IF;
END $$;