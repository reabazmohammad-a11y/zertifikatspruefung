'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, ChevronDown, FlaskConical, Info, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { demoExamples, formatDate, validateVerificationInput, verifyCertificate, type InputErrors, type VerificationInput, type VerificationResult as Result } from '@/lib/certificates'
import { SiteFooter, SiteHeader } from './site-chrome'
import { IssuerCard } from './issuer-card'
import { VerificationForm } from './verification-form'
import { VerificationResult, VerificationStatus } from './verification-result'

export function CertificatePage({ initialCertificateId }: { initialCertificateId: string }) {
  const [input, setInput] = useState<VerificationInput>({ certificateId: initialCertificateId, birthDate: '' })
  const [errors, setErrors] = useState<InputErrors>({})
  const [result, setResult] = useState<Result | null>(null)
  const [pending, setPending] = useState(false)
  const [fromQr, setFromQr] = useState(Boolean(initialCertificateId))
  const [demoNote, setDemoNote] = useState('')
  const [requestError, setRequestError] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const submitLock = useRef(false)

  useEffect(() => {
    if (result) {
      resultRef.current?.focus({ preventScroll: true })
      resultRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' })
    }
  }, [result])

  function changeInput(field: keyof VerificationInput, value: string) {
    setInput((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setResult(null)
    setRequestError(false)
    setDemoNote('')
    if (field === 'certificateId') setFromQr(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current) return
    const nextErrors = validateVerificationInput(input)
    setErrors(nextErrors)
    setResult(null)
    setRequestError(false)
    if (Object.keys(nextErrors).length) {
      document.getElementById(nextErrors.certificateId ? 'certificate-id' : 'birth-date')?.focus()
      return
    }
    submitLock.current = true
    setPending(true)
    try {
      setResult(await verifyCertificate(input))
    } catch {
      setRequestError(true)
    } finally {
      submitLock.current = false
      setPending(false)
    }
  }

  function reset() {
    setInput({ certificateId: '', birthDate: '' })
    setErrors({})
    setResult(null)
    setFromQr(false)
    setDemoNote('')
    setRequestError(false)
    const url = new URL(window.location.href)
    for (const parameter of ['id', 'certificateId', 'certificate_id']) url.searchParams.delete(parameter)
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    document.getElementById('certificate-id')?.focus()
  }

  function useExample(index: number) {
    const example = demoExamples[index]
    setInput({ certificateId: example.certificateId, birthDate: example.birthDate })
    setErrors({})
    setResult(null)
    setFromQr(false)
    setRequestError(false)
    setDemoNote(`${example.label}: ${example.certificateId}, ${formatDate(example.birthDate)}. Klicken Sie auf „Bescheinigung prüfen“.`)
    document.getElementById('certificate-id')?.focus()
  }

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#page-title" className="skip-link">Zum Prüfbereich springen</a>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <VerificationForm input={input} errors={errors} pending={pending} fromQr={fromQr} onChange={changeInput} onSubmit={submit} />
        <section className="results-section" aria-labelledby="results-heading">
          <div className="page-container">
            <div className="results-heading-row"><h2 id="results-heading" className="text-lg font-semibold">Prüfergebnis</h2><span className="text-sm text-muted-foreground">{result ? 'Prüfung mit Beispieldaten' : 'Noch keine Prüfung durchgeführt'}</span></div>
            <div ref={resultRef} tabIndex={-1} className="result-region" aria-label="Prüfergebnis" aria-busy={pending}>
              {result && <VerificationStatus result={result} />}
              {requestError && <Alert variant="destructive"><Info aria-hidden="true" /><AlertTitle>Prüfung derzeit nicht möglich</AlertTitle><AlertDescription>Bitte versuchen Sie es erneut oder wenden Sie sich an Active Helper.</AlertDescription></Alert>}
              <div className="results-grid">
                <VerificationResult result={result} onReset={reset} />
                <IssuerCard />
              </div>
              {result?.status === 'confirmed' && <div className="reset-row"><Button variant="outline" size="lg" onClick={reset}><RotateCcw data-icon="inline-start" aria-hidden="true" />Weitere Bescheinigung prüfen</Button></div>}
            </div>
            <div className="verification-disclaimer"><Info className="size-4 shrink-0" aria-hidden="true" /><p>Geprüft wird der Abgleich mit einem gespeicherten Datensatz. Eine PDF-Datei oder elektronische Signatur wird hier nicht geprüft.</p></div>
            <details className="demo-panel">
              <summary><span className="flex items-center gap-3"><FlaskConical className="size-4 shrink-0" aria-hidden="true" /><span><strong className="font-semibold">Prototyp mit Beispieldaten</strong><span className="demo-summary-description"> · Keine echte Zertifikatsprüfung</span></span></span><span className="demo-toggle">Ausprobieren<ChevronDown className="size-4" aria-hidden="true" /></span></summary>
              <div className="demo-body">
                <p className="text-sm leading-relaxed text-muted-foreground">Wählen Sie einen Beispielfall. Die Felder werden ausgefüllt; starten Sie die Prüfung anschließend selbst. Alle Teilnehmerdaten sind fiktiv.</p>
                <div className="flex flex-wrap gap-2">{demoExamples.map((example, index) => <Button key={example.certificateId} variant="outline" onClick={() => useExample(index)} disabled={pending}>{example.label}<ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>)}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">Beispiel: AH-2026-08149 · Geburtsdatum: 05.06.1992</p>
                <p role="status" className="text-sm leading-relaxed">{demoNote}</p>
              </div>
            </details>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
