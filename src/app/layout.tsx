import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_KR, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { testConfig } from "@/data/config"
import { TestProvider } from "@/context/TestContext"
import "./globals.css"

const fontIbmPlex = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
})

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

/* ── SEO Metadata ─────────────────────────────────────
 *  1. .env.local의 NEXT_PUBLIC_SITE_URL을 실제 도메인으로 변경하세요.
 *  2. Google Search Console → 소유권 확인 → HTML 태그에서 코드 복사
 *     → .env.local의 GOOGLE_SITE_VERIFICATION에 붙여넣기
 *  3. 네이버 서치어드바이저 → 사이트 등록 → HTML 태그에서 코드 복사
 *     → .env.local의 NAVER_SITE_VERIFICATION에 붙여넣기
 * ──────────────────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: testConfig.title,
    template: `%s | ${testConfig.title}`,
  },
  description: testConfig.subtitle,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: testConfig.title,
    description: testConfig.subtitle,
    type: "website",
    locale: 'ko_KR',
    url: BASE_URL,
    // OG 이미지는 src/app/opengraph-image.tsx 가 자동 생성 (동적 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: testConfig.title,
    description: testConfig.subtitle,
    // twitter 이미지도 opengraph-image 를 자동 재사용
  },
  // favicon 은 src/app/icon.svg 에서 자동 감지
  // 구글 서치콘솔 & 네이버 서치어드바이저 인증 코드 (.env.local에서 설정)
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  ...(process.env.NAVER_SITE_VERIFICATION && {
    other: { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION },
  }),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // themeColor: designer sets this after deciding the palette.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${fontIbmPlex.variable} ${fontSpaceGrotesk.variable}`}>
      <body className="font-sans bg-[var(--color-hazzi-canvas)] text-[var(--color-hazzi-ink)] antialiased selection:bg-[var(--color-hazzi-lime)] selection:text-[var(--color-hazzi-ink)]">
        <main className="min-h-screen flex flex-col">
          <TestProvider>
            {children}
          </TestProvider>
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
