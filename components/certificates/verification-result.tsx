'use client'

import { CircleCheck, FileSearch, FileText, Info, RotateCcw, SearchX, ShieldCheck, ShieldX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatDate, type VerificationResult as Result } from '@/lib/certificates'

export function VerificationStatus({ result }: { result: Result }) {
  if (result.status !== 'confirmed') return null
  return (
    <Alert className="confirmation-banner" role="status">
      <CircleCheck aria-hidden="true" />
      <AlertTitle><h3>Bescheinigung im Active-Helper-System bestätigt</h3></AlertTitle>
      <AlertDescription>Die eingegebenen Angaben stimmen mit einem bei Active Helper gespeicherten Datensatz überein.</AlertDescription>
    </Alert>
  )
}

export function VerificationResult({ result, onReset }: { result: Result | null; onReset: () => void }) {
  if (!result) {
    return (
      <Card className="result-card empty-result">
        <CardHeader>
          <div className="card-heading"><FileText className="size-5" aria-hidden="true" /><CardTitle><h3>Ihre Bescheinigungsdaten</h3></CardTitle></div>
          <CardDescription>Nach der Prüfung sehen Sie hier die hinterlegten Angaben.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="empty-content">
            <span className="document-icon"><FileSearch className="size-8" strokeWidth={1.4} aria-hidden="true" /></span>
            <div className="flex flex-col gap-3 text-center">
              <h4 className="text-xl font-semibold text-balance">Bereit für die Prüfung</h4>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Geben Sie die Zertifikats-ID und das Geburtsdatum der teilnehmenden Person ein.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter><p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 shrink-0" aria-hidden="true" />Teilnehmerdaten werden erst nach dem Abgleich angezeigt.</p></CardFooter>
      </Card>
    )
  }

  if (result.status !== 'confirmed') {
    const invalid = result.status === 'invalid'
    const Icon = invalid ? ShieldX : SearchX
    return (
      <Card className="result-card error-result" data-status={result.status}>
        <CardHeader><div className="card-heading"><FileText className="size-5" aria-hidden="true" /><CardTitle><h3>Ergebnis der Prüfung</h3></CardTitle></div><CardDescription>Es werden keine Teilnehmerdaten angezeigt.</CardDescription></CardHeader>
        <CardContent>
          <div className="empty-content">
            <span className="document-icon"><Icon className="size-8" strokeWidth={1.4} aria-hidden="true" /></span>
            <div className="flex flex-col gap-3 text-center" role="status">
              <h4 className="text-xl font-semibold text-balance">{invalid ? 'Datensatz als ungültig markiert' : 'Keine Bescheinigung gefunden'}</h4>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{invalid ? 'Dieser Datensatz ist im Active-Helper-System als ungültig markiert. Bei Fragen wenden Sie sich bitte an Active Helper.' : 'Zu dieser Kombination aus Zertifikats-ID und Geburtsdatum wurde kein Datensatz gefunden. Bitte überprüfen Sie beide Angaben.'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter><Button variant="outline" size="lg" onClick={onReset}><RotateCcw data-icon="inline-start" />Weitere Bescheinigung prüfen</Button></CardFooter>
      </Card>
    )
  }

  const { certificate } = result
  const fields = [
    ['Kursart', certificate.courseType],
    ['Kursdatum', formatDate(certificate.courseDate)],
    ['Nachname', certificate.lastName],
    ['Vorname', certificate.firstName],
    ['Geburtsdatum', formatDate(certificate.birthDate)],
    ['Zertifikats-ID', certificate.id],
  ]

  return (
    <Card className="result-card">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="card-heading"><FileText className="size-5" aria-hidden="true" /><CardTitle><h3>Hinterlegte Bescheinigungsdaten</h3></CardTitle></div><Badge variant="secondary">Beispieldaten</Badge></div>
        <CardDescription>Diese Angaben sind der Bescheinigung zugeordnet.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="certificate-fields">{fields.map(([label, value]) => <div className="flex flex-col gap-2" key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-base font-medium break-words">{value}</dd></div>)}</dl>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-3"><p className="flex items-center gap-2 text-sm font-semibold"><Info className="size-4" aria-hidden="true" />Erläuterung</p><p className="text-sm leading-relaxed text-muted-foreground">Die hier aufgeführten Bescheinigungsdaten sind im Active-Helper-System hinterlegt. Active Helper bestätigt den Abgleich mit dem gespeicherten Datensatz.</p><p className="text-sm leading-relaxed text-muted-foreground">In diesem Prototyp wird der Abgleich ausschließlich mit fiktiven Beispieldaten demonstriert.</p></div>
      </CardFooter>
    </Card>
  )
}
