'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Info, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { validateVerificationInput, verifyCertificate, verifyQrPrototype, type InputErrors, type VerificationInput, type VerificationResult as Result } from '@/lib/certificates'
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
    if (field === 'certificateId') setFromQr(false)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runVerification(input)
  }

  async function runVerification(values: VerificationInput, verify: typeof verifyCertificate = verifyCertificate) {
    if (submitLock.current) return
    const nextErrors = validateVerificationInput(values)
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
      setResult(await verify(values))
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
    setRequestError(false)
    const url = new URL(window.location.href)
    for (const parameter of ['id', 'certificateId', 'certificate_id']) url.searchParams.delete(parameter)
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    document.getElementById('certificate-id')?.focus()
  }

  function useExample(example: VerificationInput) {
    if (submitLock.current) return
    const values = { certificateId: example.certificateId, birthDate: example.birthDate }
    setInput(values)
    setFromQr(false)
    void runVerification(values)
  }

  function useQrExample(values: VerificationInput) {
    if (submitLock.current) return
    setInput(values)
    setFromQr(false)
    void runVerification(values, verifyQrPrototype)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <a href="#page-title" className="skip-link">Zum Prüfbereich springen</a>
      <SiteHeader pending={pending} onSelectExample={useExample} onVerifyQrExample={useQrExample} resultFocusRef={resultRef} />
      <main className="flex flex-1 flex-col">
        <VerificationForm input={input} errors={errors} pending={pending} fromQr={fromQr} onChange={changeInput} onSubmit={submit} />
        <section className="results-section" aria-labelledby="results-heading">
          <div className="page-container">
            <div className="results-heading-row"><h2 id="results-heading" className="text-lg font-semibold">Prüfergebnis</h2><span className="text-sm text-muted-foreground">{result ? 'Prüfung abgeschlossen' : 'Noch keine Prüfung durchgeführt'}</span></div>
            <div ref={resultRef} tabIndex={-1} className="result-region" aria-label="Prüfergebnis" aria-busy={pending}>
              {result && <VerificationStatus result={result} />}
              {requestError && <Alert variant="destructive"><Info aria-hidden="true" /><AlertTitle>Prüfung derzeit nicht möglich</AlertTitle><AlertDescription>Bitte versuchen Sie es erneut oder wenden Sie sich an Active Helper.</AlertDescription></Alert>}
              <div className="results-grid">
                <VerificationResult result={result} />
                <IssuerCard />
              </div>
            </div>
            {result && <div className="reset-row"><Button variant="outline" size="lg" onClick={reset}><RotateCcw data-icon="inline-start" aria-hidden="true" />Weitere Bescheinigung prüfen</Button></div>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
