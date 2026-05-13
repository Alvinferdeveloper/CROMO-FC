import { MapClient } from '@/features/map/components/map-client'
import { createClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'Mapa de Coleccionistas - PaniniTrade 2026',
  description: 'Encuentra cromos disponibles cerca de tu ubicación',
}

export default async function MapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userLocation = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('location_lat, location_lng')
      .eq('id', user.id)
      .single()

    if (data?.location_lat && data?.location_lng) {
      userLocation = {
        lat: data.location_lat,
        lng: data.location_lng
      }
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MapClient userLocation={userLocation} />
    </div>
  )
}
