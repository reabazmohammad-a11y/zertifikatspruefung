import { Building2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function IssuerCard() {
  return (
    <Card className="issuer-card">
      <CardHeader>
        <div className="card-heading"><Building2 className="size-5" aria-hidden="true" /><CardTitle><h3>Ermächtigte Stelle</h3></CardTitle></div>
        <CardDescription>Aussteller der Bescheinigung</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Active Helper</p>
          <address className="flex flex-col gap-2 text-sm not-italic leading-relaxed">
            <p>Hammerbrookstraße 73<br />20097 Hamburg</p>
            <a href="tel:+494022630573" className="contact-link">040 22630573</a>
            <a href="mailto:info@active-helper.de" className="contact-link">info@active-helper.de</a>
          </address>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-3 text-sm"><span className="text-muted-foreground">DGUV-Kennziffer</span><span className="font-semibold tracking-wide">8.1494</span></div>
      </CardFooter>
    </Card>
  )
}
