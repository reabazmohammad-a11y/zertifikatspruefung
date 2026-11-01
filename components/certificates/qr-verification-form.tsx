'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { demoExamples, validateVerificationInput, type InputErrors, type VerificationInput } from '@/lib/certificates'

export function QrVerificationForm({ onVerify }: { onVerify: (input: VerificationInput) => void }) {
  const certificateId = demoExamples[0].certificateId
  const [birthDate, setBirthDate] = useState('')
  const [errors, setErrors] = useState<InputErrors>({})
  const birthDateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    birthDateRef.current?.focus()
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = { certificateId, birthDate }
    const nextErrors = validateVerificationInput(input)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      birthDateRef.current?.focus()
      return
    }
    onVerify(input)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Zertifikat prüfen</DialogTitle>
        <DialogDescription id="qr-verification-note">Die Zertifikats-ID wurde übernommen. Geben Sie zur Prüfung noch das Geburtsdatum der teilnehmenden Person ein.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} noValidate aria-label="Zertifikat prüfen" aria-describedby="qr-verification-note" onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.target instanceof HTMLInputElement || event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
      }}>
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="qr-certificate-id">Zertifikats-ID <span className="required-mark" aria-hidden="true">*</span></FieldLabel>
            <Input id="qr-certificate-id" name="certificateId" value={certificateId} readOnly autoComplete="off" aria-describedby="qr-verification-note" className="h-12" />
          </Field>
          <Field data-invalid={Boolean(errors.birthDate)}>
            <FieldLabel htmlFor="qr-birth-date">Geburtsdatum <span className="required-mark" aria-hidden="true">*</span></FieldLabel>
            <Input ref={birthDateRef} id="qr-birth-date" name="birthDate" type="date" lang="de" min="1900-01-01" value={birthDate} onChange={(event) => {
              setBirthDate(event.target.value)
              setErrors({})
            }} autoComplete="off" required aria-invalid={Boolean(errors.birthDate)} aria-describedby={errors.birthDate ? 'qr-birth-date-error' : undefined} className="h-12" />
            {errors.birthDate && <FieldError id="qr-birth-date-error">{errors.birthDate}</FieldError>}
          </Field>
          <Button type="submit" size="lg" className="h-12">
            <ShieldCheck data-icon="inline-start" aria-hidden="true" />
            Zertifikat prüfen
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </FieldGroup>
      </form>
    </>
  )
}
