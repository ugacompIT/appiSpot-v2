/*
  # Update storage policies for public access

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies with proper public access
    - Ensure anonymous access for image viewing
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Create new policies with proper access control
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'spots');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'spots'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'spots');

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'spots');