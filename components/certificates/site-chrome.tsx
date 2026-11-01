import Image from 'next/image'
import { Mail, Phone, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function BrandLogo() {
  return (
    <a href="https://active-helper.de" className="brand-logo" aria-label="Active Helper – zur Website">
      <Image src="/images/active-helper-login-logo.png" alt="Active Helper – Erste Hilfe und Brandschutz" width={2000} height={490} className="h-auto w-52 sm:w-60" priority />
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
        <div className="footer-content">
          <nav aria-label="Kontakt und rechtliche Informationen" className="flex flex-wrap items-center justify-center gap-5">
            <a href="https://active-helper.de/impressum/" target="_blank" rel="noopener noreferrer" className="footer-link">Impressum<span className="sr-only"> (neuer Tab)</span></a>
            <a href="https://active-helper.de/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer" className="footer-link">Datenschutz<span className="sr-only"> (neuer Tab)</span></a>
            <Dialog>
              <DialogTrigger className="footer-link">Kontakt</DialogTrigger>
              <DialogContent className="contact-dialog">
                <DialogHeader>
                  <DialogTitle>Kontakt</DialogTitle>
                  <DialogDescription>Du hast Fragen? Wir sind gerne für dich da.</DialogDescription>
                </DialogHeader>
                <address className="flex flex-col gap-4 not-italic">
                  <a href="mailto:buchung@active-helper.de" className="contact-detail"><Mail className="size-5 shrink-0" aria-hidden="true" /><span className="flex min-w-0 flex-col gap-1"><span className="text-muted-foreground">E-Mail</span><span className="break-words">buchung@active-helper.de</span></span></a>
                  <a href="tel:+494022630573" className="contact-detail"><Phone className="size-5 shrink-0" aria-hidden="true" /><span className="flex flex-col gap-1"><span className="text-muted-foreground">Telefon</span><span>040 22630573</span></span></a>
                </address>
                <div className="contact-hours">
                  <p>Geschäftszeiten: Mo–Fr, 10:00–18:00 Uhr</p>
                  <p>Bitte beachten Sie, dass unser Büro am Wochenende nicht besetzt ist. Die Kurse finden trotzdem wie geplant statt.</p>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
          <p className="text-sm">© {new Date().getFullYear()} Active Helper. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
