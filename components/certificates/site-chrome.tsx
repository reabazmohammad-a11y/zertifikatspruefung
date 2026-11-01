import Image from 'next/image'
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function BrandLogo() {
  return (
    <a href="https://active-helper.de" className="brand-logo" aria-label="Active Helper – zur Website">
      <Image src="/images/active-helper-logo.png" alt="Active Helper" width={1548} height={320} className="h-auto w-52 sm:w-60" priority />
      <span className="brand-tagline">Erste Hilfe und Brandschutz</span>
    </a>
  )
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-6">
            <span className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><ShieldCheck className="size-4" aria-hidden="true" /> Zertifikatsprüfung</span>
            <Badge variant="outline">Prototyp</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="kontakt">
      <div className="page-container">
        <div className="footer-main">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Active Helper</span>
            <p className="text-sm text-muted-foreground">Erste Hilfe und Brandschutz.</p>
          </div>
          <address className="flex flex-col gap-3 text-sm not-italic text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-7">
            <span className="flex items-start gap-2"><MapPin className="size-4 shrink-0" aria-hidden="true" /><span>Hammerbrookstraße 73<br />20097 Hamburg</span></span>
            <a href="tel:+494022630573" className="contact-link"><Phone className="size-4" aria-hidden="true" />040 22630573</a>
            <a href="mailto:info@active-helper.de" className="contact-link"><Mail className="size-4" aria-hidden="true" />info@active-helper.de</a>
          </address>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Active Helper</p>
          <nav aria-label="Rechtliche Informationen" className="flex flex-wrap items-center gap-6">
            <a href="https://active-helper.de/impressum/" target="_blank" rel="noopener noreferrer" className="contact-link">Impressum<ArrowUpRight className="size-4" aria-hidden="true" /><span className="sr-only"> (neuer Tab)</span></a>
            <a href="https://active-helper.de/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer" className="contact-link">Datenschutz<ArrowUpRight className="size-4" aria-hidden="true" /><span className="sr-only"> (neuer Tab)</span></a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
