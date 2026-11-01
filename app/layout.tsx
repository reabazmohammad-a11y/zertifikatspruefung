import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const figtree = localFont({ src: '../public/fonts/figtree-latin.woff2', variable: '--font-figtree', weight: '400 700', display: 'swap' })
const bricolage = localFont({ src: '../public/fonts/bricolage-grotesque-latin.woff2', variable: '--font-bricolage', weight: '400 700', display: 'swap' })

export const metadata: Metadata = {
  title: 'Zertifikate prüfen | Active Helper',
  description: 'Prüfen Sie Bescheinigungsdaten mit Zertifikats-ID und Geburtsdatum. Active-Helper-Prototyp mit ausschließlich fiktiven Beispieldaten.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f6f8',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`light bg-background ${figtree.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
