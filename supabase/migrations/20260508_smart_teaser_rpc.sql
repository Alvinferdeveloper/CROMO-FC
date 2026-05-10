-- Create a professional function for the smart teaser
CREATE OR REPLACE FUNCTION public.get_smart_teaser(
  p_user_city TEXT DEFAULT NULL,
  p_user_country TEXT DEFAULT NULL,
  p_user_lat FLOAT DEFAULT NULL,
  p_user_lng FLOAT DEFAULT NULL,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  player_name TEXT,
  card_number TEXT,
  team_name TEXT,
  image_url TEXT,
  desired_trade TEXT,
  location_city TEXT,
  country TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  profile_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.player_name,
    cp.card_number,
    cp.team_name,
    cp.image_url,
    cp.desired_trade,
    cp.location_city,
    cp.country,
    cp.location_lat,
    cp.location_lng,
    cp.created_at,
    cp.user_id,
    p.full_name as profile_name
  FROM public.card_posts cp
  LEFT JOIN public.profiles p ON cp.user_id = p.id
  WHERE cp.is_available = true
  ORDER BY
    -- 1. Prioritize same city
    (CASE WHEN cp.location_city = p_user_city THEN 0 ELSE 1 END),
    -- 2. Prioritize same country
    (CASE WHEN cp.country = p_user_country THEN 0 ELSE 1 END),
    -- 3. Prioritize by distance if lat/lng are provided
    (CASE 
      WHEN p_user_lat IS NOT NULL AND p_user_lng IS NOT NULL AND cp.location_lat IS NOT NULL AND cp.location_lng IS NOT NULL
      THEN (
        point(cp.location_lng, cp.location_lat) <-> point(p_user_lng, p_user_lat)
      )
      ELSE 999999
    END),
    -- 4. Finally by date
    cp.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
