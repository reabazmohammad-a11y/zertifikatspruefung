'use client'

import type { FormEvent } from 'react'
import { ArrowRight, LoaderCircle, LockKeyhole, QrCode, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { InputErrors, VerificationInput } from '@/lib/certificates'

type Props = {
  input: VerificationInput
  errors: InputErrors
  pending: boolean
  fromQr: boolean
  onChange: (field: keyof VerificationInput, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function VerificationForm({ input, errors, pending, fromQr, onChange, onSubmit }: Props) {
  return (
    <section className="verification-band" aria-labelledby="page-title">
      <div className="page-container">
        <div className="verification-intro">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Digitale Bescheinigungen</p>
            <h1 id="page-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Zertifikate prüfen</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Prüfen Sie, ob eine Bescheinigung bei Active Helper hinterlegt ist.<br className="hidden sm:block" /> Sie benötigen die Zertifikats-ID und das Geburtsdatum der teilnehmenden Person.</p>
          </div>
        </div>
        <form onSubmit={onSubmit} noValidate aria-label="Bescheinigung prüfen" onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
        }}>
          <FieldGroup className="verification-fields">
            <Field data-invalid={Boolean(errors.certificateId)} data-disabled={pending}>
              <FieldLabel htmlFor="certificate-id">Zertifikats-ID <span className="required-mark" aria-hidden="true">*</span></FieldLabel>
              <Input id="certificate-id" name="certificateId" placeholder="z. B. AH-2026-08149" value={input.certificateId} onChange={(event) => onChange('certificateId', event.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} required maxLength={80} disabled={pending} aria-invalid={Boolean(errors.certificateId)} aria-describedby={errors.certificateId ? 'certificate-id-error' : fromQr ? 'qr-note' : undefined} />
              {errors.certificateId && <FieldError id="certificate-id-error">{errors.certificateId}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(errors.birthDate)} data-disabled={pending}>
              <FieldLabel htmlFor="birth-date">Geburtsdatum <span className="required-mark" aria-hidden="true">*</span></FieldLabel>
              <Input id="birth-date" name="birthDate" type="date" lang="de" min="1900-01-01" value={input.birthDate} onChange={(event) => onChange('birthDate', event.target.value)} autoComplete="off" required disabled={pending} aria-invalid={Boolean(errors.birthDate)} aria-describedby={errors.birthDate ? 'birth-date-error' : undefined} />
              {errors.birthDate && <FieldError id="birth-date-error">{errors.birthDate}</FieldError>}
            </Field>
            <Button type="submit" size="lg" className="verify-button" disabled={pending}>
              {pending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <ShieldCheck data-icon="inline-start" aria-hidden="true" />}
              {pending ? 'Angaben werden geprüft …' : 'Bescheinigung prüfen'}
              {!pending && <ArrowRight data-icon="inline-end" aria-hidden="true" />}
            </Button>
          </FieldGroup>
          <div className="form-notes">
            {fromQr ? <p id="qr-note" className="flex items-start gap-2"><QrCode className="size-4 shrink-0" aria-hidden="true" />ID aus dem Link übernommen. Bitte ergänzen Sie das Geburtsdatum.</p> : <p className="flex items-start gap-2"><LockKeyhole className="size-4 shrink-0" aria-hidden="true" />Zum Schutz persönlicher Daten sind beide Angaben erforderlich.</p>}
            <span className="shrink-0">* Pflichtfelder</span>
          </div>
        </form>
      </div>
    </section>
  )
}
