-- Create spots bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('spots', 'spots')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Images are publicly accessible"
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
USING (bucket_id = 'spots' AND owner = auth.uid())
WITH CHECK (bucket_id = 'spots' AND owner = auth.uid());

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'spots' AND owner = auth.uid());