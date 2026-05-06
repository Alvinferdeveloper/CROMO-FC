-- Add location_city column to card_posts table
ALTER TABLE public.card_posts ADD COLUMN IF NOT EXISTS location_city TEXT;
