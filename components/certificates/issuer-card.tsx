import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function IssuerCard() {
  return (
    <Card className="issuer-card">
      <CardHeader>
        <div className="card-heading"><Building2 className="size-5" aria-hidden="true" /><CardTitle><h3>Ermächtigte Stelle</h3></CardTitle></div>
        <CardDescription>Aussteller der Bescheinigung</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1"><p className="text-lg font-semibold">Active Helper</p><p className="text-sm text-muted-foreground">Erste Hilfe und Brandschutz</p></div>
          <address className="flex flex-col gap-5 text-sm not-italic leading-relaxed">
            <div className="flex items-start gap-3"><MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span>Hammerbrookstraße 73<br />20097 Hamburg</span></div>
            <a href="tel:+494022630573" className="contact-link"><Phone className="size-4 text-muted-foreground" aria-hidden="true" />040 22630573</a>
            <a href="mailto:info@active-helper.de" className="contact-link"><Mail className="size-4 text-muted-foreground" aria-hidden="true" />info@active-helper.de</a>
          </address>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">DGUV-Kennziffer</span><span className="font-semibold tracking-wide">8.1494</span></div>
      </CardFooter>
    </Card>
  )
}
