-- Function to find card matches based on user's wishlist using fuzzy matching (trigrams)
CREATE OR REPLACE FUNCTION public.get_wishlist_matches(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  player_name TEXT,
  team_name TEXT,
  card_number TEXT,
  image_url TEXT,
  rarity public.card_rarity,
  desired_trade TEXT,
  location_city TEXT,
  country TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  profile_name TEXT,
  profile_avatar TEXT,
  similarity_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (cp.id)
    cp.id,
    cp.player_name,
    cp.team_name,
    cp.card_number,
    cp.image_url,
    cp.rarity,
    cp.desired_trade,
    cp.location_city,
    cp.country,
    cp.location_lat,
    cp.location_lng,
    cp.created_at,
    cp.user_id,
    p.full_name as profile_name,
    p.avatar_url as profile_avatar,
    max(similarity(cp.player_name, wi.player_name)) as similarity_score
  FROM public.card_posts cp
  JOIN public.profiles p ON cp.user_id = p.id
  CROSS JOIN public.wishlist_items wi
  WHERE wi.user_id = p_user_id
    AND cp.user_id != p_user_id
    AND cp.is_available = true
    -- Use trigram similarity threshold (adjustable)
    AND (cp.player_name % wi.player_name OR cp.player_name ILIKE '%' || wi.player_name || '%' OR wi.player_name ILIKE '%' || cp.player_name || '%')
  GROUP BY cp.id, p.id
  ORDER BY cp.id, similarity_score DESC, cp.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;
