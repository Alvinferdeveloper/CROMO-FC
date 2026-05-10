-- Advanced search function for the marketplace
CREATE OR REPLACE FUNCTION public.get_advanced_market_cards(
  p_search TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_team TEXT DEFAULT NULL,
  p_user_lat FLOAT DEFAULT NULL,
  p_user_lng FLOAT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
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
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  user_id UUID,
  profile_name TEXT,
  distance_km FLOAT
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
    cp.is_available,
    cp.created_at,
    cp.user_id,
    p.full_name as profile_name,
    (CASE 
      WHEN p_user_lat IS NOT NULL AND p_user_lng IS NOT NULL AND cp.location_lat IS NOT NULL AND cp.location_lng IS NOT NULL
      THEN (
        -- Simple distance calculation in degrees, converted to approximate KM
        -- For a more precise calculation, one would use PostGIS, 
        -- but this is very efficient for a standard schema.
        sqrt(power(cp.location_lat - p_user_lat, 2) + power(cp.location_lng - p_user_lng, 2)) * 111.32
      )
      ELSE NULL
    END) as distance_km
  FROM public.card_posts cp
  LEFT JOIN public.profiles p ON cp.user_id = p.id
  WHERE cp.is_available = true
    AND (p_search IS NULL OR cp.player_name ILIKE '%' || p_search || '%' OR cp.team_name ILIKE '%' || p_search || '%')
    AND (p_country IS NULL OR cp.country ILIKE '%' || p_country || '%')
    AND (p_city IS NULL OR cp.location_city ILIKE '%' || p_city || '%')
    AND (p_team IS NULL OR cp.team_name ILIKE '%' || p_team || '%')
  ORDER BY
    -- Smart prioritization
    (CASE WHEN distance_km IS NOT NULL THEN 0 ELSE 1 END),
    distance_km ASC NULLS LAST,
    cp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
