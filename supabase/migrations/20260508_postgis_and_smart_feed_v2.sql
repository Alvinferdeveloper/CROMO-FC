-- 1. Enable the PostGIS extension to handle geographic calculations
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Smart Discovery Function V2: Supports GPS Distance, City, and Search
-- This function prioritizes cards by:
--   a) Real physical distance (if GPS coordinates are provided)
--   b) Same city (if no GPS, but user city is known)
--   c) Recency (as a fallback)
CREATE OR REPLACE FUNCTION get_smart_cards_v2(
  p_user_lat FLOAT DEFAULT NULL,
  p_user_lng FLOAT DEFAULT NULL,
  p_user_city TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 12,
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
  distance_km FLOAT,
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
    -- Calculate distance in kilometers using PostGIS
    CASE 
      WHEN p_user_lat IS NOT NULL AND p_user_lng IS NOT NULL AND cp.location_lat IS NOT NULL AND cp.location_lng IS NOT NULL 
      THEN (ST_Distance(
        ST_MakePoint(p_user_lng, p_user_lat)::geography, 
        ST_MakePoint(cp.location_lng, cp.location_lat)::geography
      ) / 1000.0)
      ELSE NULL 
    END as distance_km,
    p.full_name as profile_name
  FROM card_posts cp
  LEFT JOIN profiles p ON cp.user_id = p.id
  WHERE cp.is_available = TRUE
    AND (p_search IS NULL OR cp.player_name ILIKE '%' || p_search || '%')
  ORDER BY 
    -- Priority 1: Physical proximity (GPS)
    (CASE WHEN p_user_lat IS NOT NULL AND cp.location_lat IS NOT NULL THEN 0 ELSE 1 END),
    distance_km ASC NULLS LAST,
    -- Priority 2: Same city match (Profile-based)
    (CASE WHEN cp.location_city = p_user_city THEN 0 ELSE 1 END),
    -- Priority 3: Newest first
    cp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
