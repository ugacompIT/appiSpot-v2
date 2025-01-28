/*
  # Add featured image column to spots table

  1. Changes
    - Add `featured_image` column to `spots` table
    - Column is nullable to support spots without images
    - Uses text type to store the image URL
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE spots ADD COLUMN featured_image text;
  END IF;
END $$;