import { useRef, useState, type RefObject } from 'react'
import Image from 'next/image'
import { ArrowRight, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { demoExamples, type VerificationInput } from '@/lib/certificates'
import { QrVerificationForm } from './qr-verification-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function BrandLogo() {
  return (
    <a href="https://active-helper.de" className="brand-logo" aria-label="Active Helper – zur Website">
      <Image src="/images/active-helper-login-logo.png" alt="Active Helper – Erste Hilfe und Brandschutz" width={2000} height={490} className="h-auto w-44 sm:w-52" priority />
    </a>
  )
}

const exampleLabels = ['Bescheinigung bestätigt', 'Keine Bescheinigung gefunden', 'Datensatz als ungültig markiert']

type SiteHeaderProps = {
  pending: boolean
  onSelectExample: (input: VerificationInput) => void
  onVerifyQrExample: (input: VerificationInput) => void
  resultFocusRef: RefObject<HTMLDivElement | null>
}

export function SiteHeader({ pending, onSelectExample, onVerifyQrExample, resultFocusRef }: SiteHeaderProps) {
  const [examplesOpen, setExamplesOpen] = useState(false)
  const [qrTestOpen, setQrTestOpen] = useState(false)
  const selectedExample = useRef(false)

  return (
    <header className="site-header">
      <div className="page-container">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><ShieldCheck className="size-4" aria-hidden="true" /> Zertifikatsprüfung</span>
            <Dialog open={examplesOpen} onOpenChange={(open) => {
              if (open) {
                selectedExample.current = false
                setQrTestOpen(false)
              }
              setExamplesOpen(open)
            }} onOpenChangeComplete={(open) => {
              if (!open && selectedExample.current) resultFocusRef.current?.focus({ preventScroll: true })
            }}>
              <DialogTrigger disabled={pending} render={<Button variant="outline" className="rounded-full" />}>Prototyp</DialogTrigger>
              <DialogContent className="prototype-dialog" finalFocus={() => !selectedExample.current}>
                {qrTestOpen ? (
                  <QrVerificationForm onVerify={(input) => {
                    selectedExample.current = true
                    setExamplesOpen(false)
                    onVerifyQrExample(input)
                  }} />
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Testdatensatz auswählen</DialogTitle>
                      <DialogDescription>Übernimmt fiktive Testdaten und zeigt das zugehörige Prüfergebnis direkt an.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                      {demoExamples.map((example, index) => (
                        <Button key={example.certificateId} variant="outline" size="lg" className="h-auto min-h-12 justify-between whitespace-normal text-left" disabled={pending} onClick={() => {
                          selectedExample.current = true
                          setExamplesOpen(false)
                          onSelectExample(example)
                        }}>
                          <span>{exampleLabels[index]}</span>
                          <ArrowRight data-icon="inline-end" aria-hidden="true" />
                        </Button>
                      ))}
                      <Button variant="outline" size="lg" className="h-auto min-h-12 justify-between whitespace-normal text-left" disabled={pending} onClick={() => setQrTestOpen(true)}>
                        <span>QR-Code-Aufruf testen</span>
                        <ArrowRight data-icon="inline-end" aria-hidden="true" />
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
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
            <a href="https://active-helper.de/impressum/" target="_blank" rel="noopener noreferrer" className="footer-link">Impressum<span className="sr-only"> (neuer Tab)</span></a>
            <a href="https://active-helper.de/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer" className="footer-link">Datenschutz<span className="sr-only"> (neuer Tab)</span></a>
          </nav>
          <p className="text-sm">© {new Date().getFullYear()} Active Helper. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
