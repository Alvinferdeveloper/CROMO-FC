'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCardsForMap } from '../actions/map-actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Fix for default Leaflet icons in Next.js
const createCardIcon = (imageUrl: string | null) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="group relative">
        <div class="w-16 h-20 bg-white p-0.5 rounded-lg shadow-xl border-2 border-white overflow-hidden transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-125 hover:z-1000 ring-1 ring-black/5">
          ${imageUrl
        ? `<img src="${imageUrl}" class="w-full h-full object-cover rounded-md" />`
        : `<div class="w-full h-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground uppercase">Sin foto</div>`
      }
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-b border-r border-black/10"></div>
      </div>
    `,
    iconSize: [48, 64],
    iconAnchor: [24, 64],
  })
}

export default function MapView() {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCards() {
      const result = await getCardsForMap()
      if (result.data) {
        setCards(result.data)
      }
      setIsLoading(false)
    }
    loadCards()
  }, [])

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="font-bold text-muted-foreground tracking-tight">Cargando mapa de coleccionistas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <MapContainer
        center={[20, -20]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {cards.map((card) => (
          <Marker
            key={card.id}
            position={[card.location_lat, card.location_lng]}
            icon={createCardIcon(card.image_url)}
          >
            <Popup className="custom-popup">
              <div className="w-48 space-y-3">
                <div>
                  <h3 className="font-bold leading-none">{card.player_name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{card.team_name}</p>
                </div>
                <Button asChild size="sm" className="w-full rounded-full h-8 text-xs font-bold">
                  <Link href={`/cards/${card.id}`}>Ver Detalle</Link>
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-1000 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border shadow-2xl max-w-xs">
        <h4 className="font-black text-sm mb-1 uppercase tracking-tighter">Descubrimiento Cercano</h4>
        <p className="text-xs text-muted-foreground leading-snug">
          Las ubicaciones son aproximadas para proteger la privacidad de los coleccionistas.
        </p>
      </div>
    </div>
  )
}
