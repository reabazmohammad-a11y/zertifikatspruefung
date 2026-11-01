import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' })

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
    <html lang="de" className={`light bg-background ${montserrat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
