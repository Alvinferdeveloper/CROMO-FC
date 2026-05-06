-- Add country column to profiles and card_posts
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.card_posts ADD COLUMN IF NOT EXISTS country TEXT;
