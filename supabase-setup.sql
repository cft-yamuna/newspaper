-- Create the storage bucket for newspaper photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'newspaper-photos',
  'newspaper-photos',
  true,  -- Make bucket public so images can be accessed without auth
  5242880,  -- 5MB file size limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow anyone to upload files (for photo booth use)
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'newspaper-photos');

-- Policy: Allow anyone to read/view files
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'newspaper-photos');

-- Policy: Allow anyone to update their files (optional)
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'newspaper-photos');

-- Policy: Allow anyone to delete files (optional, remove if you don't want this)
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'newspaper-photos');
