-- Add coordinates to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location_lat FLOAT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location_lng FLOAT;
