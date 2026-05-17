import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { siteConfig } from '@/lib/config'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const displayDomain = siteConfig.url.replace(/^https?:\/\//, '')

    // Params for customization
    const title = searchParams.get('title') || 'CROMO FC'
    const subtitle = searchParams.get('subtitle') || 'Colecciona. Intercambia. Gana.'
    const player = searchParams.get('player')
    const team = searchParams.get('team')
    const imageUrl = searchParams.get('image')
    const rarity = searchParams.get('rarity') || 'Normal'

    // Rarity Colors
    const colors = {
      Normal: '#10b981', // Emerald 500
      Bronce: '#b45309', // Amber 700
      Plata: '#64748b', // Slate 500
      Oro: '#eab308',    // Yellow 500
    }

    const themeColor = colors[rarity as keyof typeof colors] || colors.Normal

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b', // Zinc 950
            backgroundImage: `radial-gradient(circle at 50% 50%, ${themeColor}22 0%, transparent 70%)`,
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Branding */}
          <div
            style={{
              position: 'absolute',
              top: 50,
              left: 50,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: themeColor }} />
            <span style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>
              CROMO FC <span style={{ color: themeColor, fontStyle: 'italic', marginLeft: 4 }}>2026</span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0 80px',
              gap: 40,
            }}
          >
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {player || title}
              </h1>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#a1a1aa', // Zinc 400
                  margin: '10px 0 0 0',
                }}
              >
                {team || subtitle}
              </p>
              
              {player && (
                <div style={{ 
                  marginTop: 30, 
                  padding: '10px 20px', 
                  backgroundColor: `${themeColor}20`, 
                  border: `1px solid ${themeColor}40`,
                  borderRadius: 12,
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                   <span style={{ fontSize: 16, fontWeight: 800, color: themeColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                     Cromo de {rarity}
                   </span>
                </div>
              )}
            </div>

            {/* Right Content (Card Preview) */}
            <div
              style={{
                display: 'flex',
                position: 'relative',
                width: 320,
                height: 420,
                backgroundColor: '#18181b', // Zinc 900
                borderRadius: 32,
                border: `2px solid ${themeColor}40`,
                overflow: 'hidden',
                boxShadow: `0 20px 50px -10px ${themeColor}33`,
              }}
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Card"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: 10 }}>
                   <span style={{ fontSize: 80 }}>🃏</span>
                   <span style={{ fontSize: 12, fontWeight: 900, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Cromo FC</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Decoration */}
          <div style={{
            position: 'absolute',
            bottom: 50,
            right: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            opacity: 0.5
          }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{displayDomain}</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
