import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Renders a visual 'fan' or 'deck' of stickers for the Hero section using static assets.
 */
export function VisualCardDeck() {
  const staticCards = [
    { id: 1, image_url: '/stickers/hero-1.png', name: 'Legend 1' },
    { id: 2, image_url: '/stickers/hero-2.png', name: 'Legend 2' },
    { id: 3, image_url: '/stickers/hero-3.png', name: 'Legend 3' },
    { id: 4, image_url: '/stickers/hero-4.png', name: 'Legend 4' },
    { id: 5, image_url: '/stickers/hero-5.png', name: 'Legend 5' },
  ]

  const cardStyles = [
    "rotate-[-15deg] -translate-x-12 translate-y-4 z-10 opacity-80",
    "rotate-[-8deg] -translate-x-6 translate-y-2 z-20",
    "rotate-[0deg] translate-y-0 z-30 scale-110 shadow-2xl ring-2 ring-emerald-400/20",
    "rotate-[8deg] translate-x-6 translate-y-2 z-20",
    "rotate-[15deg] translate-x-12 translate-y-4 z-10 opacity-80",
  ]

  return (
    <div className="relative flex items-center justify-center h-48 md:h-64 w-full mt-8 mb-4 perspective-1000">
      <div className="flex items-center justify-center w-full max-w-lg relative">
        {staticCards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              "absolute w-28 md:w-36 aspect-3/4 rounded-xl border-4 border-white bg-white shadow-xl overflow-hidden transition-all duration-500 hover:scale-125 hover:z-50 hover:rotate-0 cursor-pointer",
              cardStyles[index]
            )}
          >
            <div className="relative w-full h-full bg-slate-100">
              <Image
                src={card.image_url}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/10 font-black text-emerald-900/20 text-2xl tracking-tighter">
                2026
              </div>
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-white/20 via-transparent to-transparent opacity-50" />
          </div>
        ))}
      </div>
    </div>
  )
}
