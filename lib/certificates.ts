export type CertificateSearchParams = Record<string, string | string[] | undefined>

export type Certificate = {
  id: string
  courseType: string
  courseDate: string
  issuedAt: string
  lastName: string
  firstName: string
  birthDate: string
}

export type VerificationResult =
  | { status: 'confirmed'; certificate: Certificate }
  | { status: 'not-found' }
  | { status: 'invalid' }

export type VerificationInput = { certificateId: string; birthDate: string }
export type InputErrors = Partial<Record<keyof VerificationInput, string>>

export const demoExamples = [
  { label: 'Bestätigte Bescheinigung', certificateId: 'AH-2026-08149', birthDate: '1992-06-05' },
  { label: 'Nicht gefunden', certificateId: 'AH-2026-00000', birthDate: '1992-06-05' },
  { label: 'Ungültiger Datensatz', certificateId: 'AH-2026-08150', birthDate: '1992-06-05' },
] as const

const demoCertificate: Certificate = {
  id: 'AH-2026-08149',
  courseType: 'Erste-Hilfe-Ausbildung',
  courseDate: '2026-08-13',
  issuedAt: '2026-08-14T14:32:00+02:00',
  lastName: 'Beispiel',
  firstName: 'Lena',
  birthDate: '1992-06-05',
}

export function getCertificateId(params: CertificateSearchParams): string {
  const value = params.id ?? params.certificateId ?? params.certificate_id
  return typeof value === 'string' ? value.trim().slice(0, 80) : ''
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

export function formatIssuedAt(value: string): string {
  const timestamp = new Date(value)
  const date = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'Europe/Berlin' }).format(timestamp)
  const time = new Intl.DateTimeFormat('de-DE', { timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(timestamp)
  return `${date} um ${time} Uhr`
}

export function validateVerificationInput(input: VerificationInput): InputErrors {
  const errors: InputErrors = {}
  if (!input.certificateId.trim()) {
    errors.certificateId = 'Bitte geben Sie die Zertifikats-ID ein.'
  } else if (!/^[a-zA-Z0-9-]{4,80}$/.test(input.certificateId.trim())) {
    errors.certificateId = 'Bitte prüfen Sie die Zertifikats-ID. Erlaubt sind Buchstaben, Zahlen und Bindestriche.'
  }
  const date = new Date(`${input.birthDate}T00:00:00Z`)
  if (!input.birthDate) {
    errors.birthDate = 'Bitte geben Sie das Geburtsdatum ein.'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== input.birthDate || input.birthDate < '1900-01-01' || date.getTime() > Date.now()) {
    errors.birthDate = 'Bitte geben Sie ein gültiges Geburtsdatum ein, das nicht in der Zukunft liegt.'
  }
  return errors
}

// BACKEND-ANBINDUNG: Diese reine Demo-Funktion durch einen serverseitigen API-Aufruf ersetzen.
// Dort ID UND Geburtsdatum validieren, Anfragen begrenzen und nur bei vollständiger
// Übereinstimmung Teilnehmerdaten ausgeben. Keine personenbezogenen Daten in URLs oder Logs.
// Der Abgleich bestätigt ausschließlich den gespeicherten Datensatz, keine PDF-Signatur.
export async function verifyCertificate(input: VerificationInput): Promise<VerificationResult> {
  if (Object.keys(validateVerificationInput(input)).length) return { status: 'not-found' }
  const id = input.certificateId.trim().toUpperCase()
  if (input.birthDate !== demoCertificate.birthDate) return { status: 'not-found' }
  if (id === 'AH-2026-08150') return { status: 'invalid' }
  if (id !== demoCertificate.id) return { status: 'not-found' }
  return { status: 'confirmed', certificate: { ...demoCertificate } }
}
