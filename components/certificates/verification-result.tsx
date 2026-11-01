'use client'

import { CircleCheck, FileSearch, FileText, Info, SearchX, ShieldX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatDate, formatIssuedAt, type VerificationResult as Result } from '@/lib/certificates'

export function VerificationStatus({ result }: { result: Result }) {
  if (result.status !== 'confirmed') return null
  return (
    <Alert className="confirmation-banner" role="status">
      <CircleCheck aria-hidden="true" />
      <AlertTitle><h3>Echtheit der Bescheinigung bestätigt</h3></AlertTitle>
      <AlertDescription>Die Angaben stimmen mit einer von Active Helper ausgestellten Bescheinigung überein.</AlertDescription>
    </Alert>
  )
}

export function VerificationResult({ result }: { result: Result | null }) {
  if (!result) {
    return (
      <Card className="result-card empty-result">
        <CardContent>
          <div className="empty-content">
            <span className="document-icon"><FileSearch className="size-8" strokeWidth={1.4} aria-hidden="true" /></span>
            <div className="flex flex-col gap-3 text-center">
              <h3 className="text-xl font-semibold text-balance">Noch keine Bescheinigung geprüft</h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Nach der Eingabe sehen Sie hier das Ergebnis.</p>
            </div>
          </div>
        </CardContent>
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
              <h4 className="text-xl font-semibold text-balance">{invalid ? 'Ungültige Bescheinigung' : 'Keine Bescheinigung gefunden'}</h4>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{invalid ? 'Diese Bescheinigung ist bei Active Helper als ungültig vermerkt. Bei Fragen kontaktieren Sie uns bitte.' : 'Zu dieser Kombination aus Zertifikats-ID und Geburtsdatum wurde keine Bescheinigung gefunden. Bitte überprüfen Sie beide Angaben.'}</p>
            </div>
          </div>
        </CardContent>
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
        <div className="card-heading"><FileText className="size-5" aria-hidden="true" /><CardTitle><h3>Angaben zur Bescheinigung</h3></CardTitle></div>
        <CardDescription>Diese Bescheinigung wurde von Active Helper ausgestellt.</CardDescription>
        <CardDescription>Ausgestellt am <time dateTime={certificate.issuedAt}>{formatIssuedAt(certificate.issuedAt)}</time>.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="certificate-fields">{fields.map(([label, value]) => <div className="flex flex-col gap-2" key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-base font-medium break-words">{value}</dd></div>)}</dl>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-3"><p className="flex items-center gap-2 text-sm font-semibold"><Info className="size-4" aria-hidden="true" />Erläuterung</p><p className="text-sm leading-relaxed text-muted-foreground">Die Angaben stimmen mit den bei Active Helper gespeicherten Angaben zu dieser Bescheinigung überein.</p></div>
      </CardFooter>
    </Card>
  )
}
