export type Rarity = 'Normal' | 'Bronce' | 'Plata' | 'Oro';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  location_city: string | null;
  country: string | null;
  contact_methods: {
    whatsapp?: string;
    instagram?: string;
  };
}

export interface Card {
  id: string;
  user_id: string;
  player_name: string;
  card_number: string | null;
  team_name: string;
  album_name: string | null;
  image_url: string | null;
  description: string | null;
  desired_trade: string | null;
  is_available: boolean;
  location_lat: number | null;
  location_lng: number | null;
  location_city: string | null;
  country: string | null;
  rarity: Rarity;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
  distance_km?: number | null;
}
