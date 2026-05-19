-- 1. CREATE TEST USERS (Auth)
-- Note: The password for all will be 'password123'
-- UUIDs corregidos (solo caracteres hexadecimales 0-9, a-f)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  ('8fd685fc-429e-4640-be34-85fab69a962b', 'carlos.madrid@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Carlos de Madrid"}'),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'ana.mexico@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Ana G. CDMX"}'),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'mateo.argentina@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Mateo Messi-Fan"}'),
  ('c3d4e5f6-a7b8-4c7d-8e9f-0a1b2c3d4e5f', 'john.ny@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "John Collector NY"}'),
  ('d4e5f6a7-b8c9-4d8e-9f0a-1b2c3d4e5f6a', 'sophie.london@test.com', crypt('password123', gen_salt('bf')), now(), '{"full_name": "Sophie London Cards"}')
ON CONFLICT (id) DO NOTHING;

-- 2. Update Profiles (Locations and Onboarding)
UPDATE public.profiles SET 
  location_city = 'Madrid', country = 'España', location_lat = 40.4168, location_lng = -3.7038, onboarding_completed = true 
  WHERE id = '8fd685fc-429e-4640-be34-85fab69a962b';

UPDATE public.profiles SET 
  location_city = 'Ciudad de México', country = 'México', location_lat = 19.4326, location_lng = -99.1332, onboarding_completed = true 
  WHERE id = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

UPDATE public.profiles SET 
  location_city = 'Buenos Aires', country = 'Argentina', location_lat = -34.6037, location_lng = -58.3816, onboarding_completed = true 
  WHERE id = 'b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e';

UPDATE public.profiles SET 
  location_city = 'New York', country = 'USA', location_lat = 40.7128, location_lng = -74.0060, onboarding_completed = true 
  WHERE id = 'c3d4e5f6-a7b8-4c7d-8e9f-0a1b2c3d4e5f';

UPDATE public.profiles SET 
  location_city = 'London', country = 'UK', location_lat = 51.5074, location_lng = -0.1278, onboarding_completed = true 
  WHERE id = 'd4e5f6a7-b8c9-4d8e-9f0a-1b2c3d4e5f6a';

-- 3. INSERT TEST CARDS WITH 5 DIFFERENT IMAGES
DO $$
DECLARE
    user_record RECORD;
    i INT;
    v_player TEXT;
    v_team TEXT;
    v_img TEXT;
    v_rarity TEXT;
BEGIN
    FOR user_record IN SELECT id, location_city, country, location_lat, location_lng FROM public.profiles WHERE onboarding_completed = true LOOP
        FOR i IN 0..4 LOOP
            -- Logic for player variety
            v_player := CASE i WHEN 0 THEN 'Lionel Messi' WHEN 1 THEN 'Cristiano Ronaldo' WHEN 2 THEN 'Kylian Mbappé' WHEN 3 THEN 'Lamine Yamal' ELSE 'Harry Kane' END;
            v_team   := CASE i WHEN 0 THEN 'Argentina' WHEN 1 THEN 'Portugal' WHEN 2 THEN 'Francia' WHEN 3 THEN 'España' ELSE 'Brasil' END;
            v_img    := CASE i WHEN 0 THEN 'https://aygbfmoatmptrztprwun.supabase.co/storage/v1/object/public/test/messi.jpg' 
                               WHEN 1 THEN 'https://aygbfmoatmptrztprwun.supabase.co/storage/v1/object/public/test/cristiano.jpg' 
                               WHEN 2 THEN 'https://aygbfmoatmptrztprwun.supabase.co/storage/v1/object/public/test/mbappe.jpg' 
                               WHEN 3 THEN 'https://aygbfmoatmptrztprwun.supabase.co/storage/v1/object/public/test/lamine.jpg' 
                               ELSE 'https://aygbfmoatmptrztprwun.supabase.co/storage/v1/object/public/test/kane.jpg' END;
            v_rarity := CASE i WHEN 0 THEN 'Oro' WHEN 1 THEN 'Plata' WHEN 2 THEN 'Bronce' ELSE 'Normal' END;

            INSERT INTO public.card_posts (
                user_id, player_name, team_name, card_number, rarity, description, desired_trade, 
                location_city, country, location_lat, location_lng, image_url, is_available
            ) VALUES (
                user_record.id,
                v_player,
                v_team,
                'ST-' || (100 + i),
                v_rarity::card_rarity,
                'Cromo de prueba en excelente estado.',
                'Busco completar mi equipo favorito.',
                user_record.location_city, user_record.country, user_record.location_lat, user_record.location_lng,
                v_img,
                true
            );
        END LOOP;
    END LOOP;
END $$;
