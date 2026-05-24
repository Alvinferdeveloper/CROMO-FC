'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCardsForMap } from '../actions/map-actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

// Helper component to update map view when props change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

// Fix for default Leaflet icons in Next.js
const createCardIcon = (imageUrl: string | null) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="group relative">
        <div class="w-12 h-15 bg-white p-0.5 rounded-lg shadow-2xl border-[1.5px] border-white overflow-hidden transform -rotate-3 transition-all duration-500 group-hover:rotate-0 group-hover:scale-125 group-hover:z-1000 ring-4 ring-black/5">
          ${imageUrl
        ? `<img src="${imageUrl}" class="w-full h-full object-cover rounded-[4px]" />`
        : `<div class="w-full h-full bg-zinc-100 flex items-center justify-center text-[6px] font-black text-zinc-400 uppercase">No Pic</div>`
      }
          <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-b border-r border-black/10 z-0"></div>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
  })
}

interface MapViewProps {
  userLocation?: { lat: number, lng: number } | null
}

export default function MapView({ userLocation }: MapViewProps) {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const defaultCenter: [number, number] = [20, -20]
  const defaultZoom = 3

  const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter
  const mapZoom = userLocation ? 12 : defaultZoom

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

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-inner">
      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden !important;
          border-radius: 24px !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .custom-popup .leaflet-popup-close-button {
          top: 12px !important;
          right: 12px !important;
          color: white !important;
          background: rgba(0,0,0,0.3) !important;
          backdrop-filter: blur(4px) !important;
          border-radius: 50% !important;
          padding: 4px !important;
          z-index: 50 !important;
        }
      `}</style>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />

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
            <Popup className="custom-popup" minWidth={200}>
              <div className="w-[210px] overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-white/20">
                {/* Card Head / Image with 4:5 Aspect Ratio */}
                <div className="relative aspect-4/5 w-full bg-zinc-100 dark:bg-zinc-800 group">
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.player_name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl grayscale opacity-20">🃏</span>
                    </div>
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-start bg-linear-to-b from-black/40 to-transparent">
                    <div className="px-2 py-0.5 bg-white/20 backdrop-blur-md border border-white/30 text-[9px] font-black text-white rounded-full tracking-tighter">
                      #{card.card_number || '00'}
                    </div>
                    {card.rarity !== 'Normal' && (
                      <div className={cn(
                        "px-2 py-0.5 text-[8px] font-black text-white rounded-full uppercase tracking-widest shadow-lg border",
                        card.rarity === 'Legendary' ? "bg-amber-500 border-amber-400" : "bg-emerald-500 border-emerald-400"
                      )}>
                        {card.rarity}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-black text-lg text-zinc-950 dark:text-white leading-none tracking-tighter">
                      {card.player_name}
                    </h3>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1.5">
                      {card.team_name}
                    </p>
                  </div>

                  {/* Collector Info */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none truncate">Coleccionista</p>
                      <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mt-1 truncate">
                        {card.profiles?.full_name || 'Usuario'}
                      </p>
                    </div>
                  </div>

                  <Button asChild className="w-full h-10 cursor-pointer font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none transition-[transform,opacity,box-shadow] duration-200">
                    <Link href={`/cards/${card.id}`}>Ver detalles</Link>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend Overlay */}
      <div className="absolute bottom-8 left-8 z-1000 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl p-6 rounded-lg border border-white/20 shadow-2xl max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <h4 className="font-black text-md uppercase text-zinc-900 dark:text-white">Red de Intercambio</h4>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-bold">
          Explora los cromos disponibles cerca de ti. Cada marcador es una oportunidad de completar tu álbum.
        </p>
      </div>
    </div>
  )
}
