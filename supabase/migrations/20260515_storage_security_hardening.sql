-- 1. Create card-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-images', 'card-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Hardening avatars bucket policies
-- We drop existing ones to ensure a clean state with stricter rules
DROP POLICY IF EXISTS "Avatar public access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

CREATE POLICY "Avatar public access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Hardening card-images bucket policies
DROP POLICY IF EXISTS "Card images public access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own card images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own card images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own card images" ON storage.objects;

CREATE POLICY "Card images public access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'card-images');

CREATE POLICY "Users can upload their own card images" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'card-images' AND 
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own card images" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'card-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own card images" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'card-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
