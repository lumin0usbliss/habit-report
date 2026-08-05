import { ImageResponse } from 'next/og'
import { testConfig } from '@/data/config'

/**
 * OG image generator.
 *
 * DESIGN NOTE: Ships with a neutral placeholder design. The designer
 * replaces the background, typography weight, and accent color to
 * match the project palette after planning.
 */

export const alt = testConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
          padding: '80px',
          background: '#ffffff',
          color: '#111111',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: '#666666',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          {testConfig.shareHashtag.replace('#', '')}
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: 1000,
            color: '#111111',
          }}
        >
          {testConfig.title}
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 32,
            color: '#555555',
            maxWidth: 900,
            letterSpacing: '-0.01em',
          }}
        >
          {testConfig.subtitle}
        </div>
      </div>
    ),
    { ...size }
  )
}
