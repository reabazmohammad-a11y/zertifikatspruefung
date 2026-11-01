import assert from 'node:assert/strict'
import test from 'node:test'
import { demoExamples, formatIssuedAt, getCertificateId, validateVerificationInput, verifyCertificate, verifyQrPrototype } from '../lib/certificates.ts'

test('Ohne Linkparameter bleibt die ID leer', () => {
  assert.equal(getCertificateId({}), '')
})

test('QR-Link übernimmt ausschließlich die ID und begrenzt ihre Länge', () => {
  assert.equal(getCertificateId({ id: ' AH-2026-08149 ', birthDate: '1992-06-05' }), 'AH-2026-08149')
  assert.equal(getCertificateId({ certificateId: 'AH-2026-08149' }), 'AH-2026-08149')
  assert.equal(getCertificateId({ certificate_id: 'AH-2026-08149' }), 'AH-2026-08149')
  assert.equal(getCertificateId({ id: ['one', 'two'] }), '')
  assert.equal(getCertificateId({ id: 'x'.repeat(1000) }).length, 80)
})

test('Beide Angaben sind Pflichtfelder', () => {
  assert.deepEqual(Object.keys(validateVerificationInput({ certificateId: '', birthDate: '' })).sort(), ['birthDate', 'certificateId'])
})

test('Ungültige und zukünftige Geburtsdaten werden abgelehnt', () => {
  for (const birthDate of ['1992-02-30', '1992-13-01', '2099-01-01', '1899-12-31', 'text']) {
    assert.ok(validateVerificationInput({ certificateId: demoExamples[0].certificateId, birthDate }).birthDate)
  }
})

test('Bestätigter Datensatz benötigt beide passenden Angaben', async () => {
  const result = await verifyCertificate(demoExamples[0])
  assert.equal(result.status, 'confirmed')
  assert.equal(result.certificate.firstName, 'Lena')
  assert.equal(result.certificate.courseType, 'Erste-Hilfe-Ausbildung')
  assert.equal(result.certificate.issuedAt, '2026-08-14T14:32:00+02:00')
  assert.equal(result.certificate.courseDate, '2026-08-13')
})

test('Ausstellungszeitpunkt wird mit deutscher Sommer- und Winterzeit dargestellt', () => {
  assert.equal(formatIssuedAt('2026-08-14T12:32:00Z'), '14.08.2026 um 14:32 Uhr')
  assert.equal(formatIssuedAt('2026-01-14T13:32:00Z'), '14.01.2026 um 14:32 Uhr')
})

test('Fehlerhaftes Geburtsdatum gibt keine Teilnehmerdaten oder ID-Gültigkeit preis', async () => {
  for (const example of [demoExamples[0], demoExamples[2]]) {
    assert.deepEqual(await verifyCertificate({ ...example, birthDate: '1992-06-06' }), { status: 'not-found' })
  }
})

test('Unbekannte und ungültige Bescheinigungen enthalten keine Teilnehmerdaten', async () => {
  assert.deepEqual(await verifyCertificate(demoExamples[1]), { status: 'not-found' })
  assert.deepEqual(await verifyCertificate(demoExamples[2]), { status: 'invalid' })
})

test('IDs werden ohne Beachtung der Großschreibung abgeglichen', async () => {
  assert.equal((await verifyCertificate({ ...demoExamples[0], certificateId: ' ah-2026-08149 ' })).status, 'confirmed')
})

test('Leere oder manipulierte Eingaben geben keine Daten zurück', async () => {
  assert.deepEqual(await verifyCertificate({ certificateId: '', birthDate: '' }), { status: 'not-found' })
  assert.deepEqual(await verifyCertificate({ certificateId: '<script>', birthDate: '1992-06-05' }), { status: 'not-found' })
})

test('QR-Prototyp bestätigt beliebige gültige Geburtsdaten und übernimmt sie ins Ergebnis', async () => {
  const original = await verifyCertificate(demoExamples[0])
  for (const birthDate of ['1900-01-01', '1985-11-23', '1992-06-05', '2000-02-29', '2004-09-17']) {
    const result = await verifyQrPrototype({ ...demoExamples[0], birthDate })
    assert.deepEqual(result, { status: 'confirmed', certificate: { ...original.certificate, birthDate } })
  }
})

test('QR-Prototyp weist leere, ungültige und zukünftige Geburtsdaten weiterhin zurück', async () => {
  for (const birthDate of ['', 'text', '1992-02-30', '1992-13-01', '2099-01-01', '1899-12-31']) {
    assert.deepEqual(await verifyQrPrototype({ ...demoExamples[0], birthDate }), { status: 'not-found' })
  }
})

test('QR-Prototyp verändert weder Beispieldaten noch die übrige Prüflogik', async () => {
  const original = await verifyCertificate(demoExamples[0])
  const examplesBefore = structuredClone(demoExamples)
  const input = { ...demoExamples[0], birthDate: '1985-11-23' }
  const firstQrResult = await verifyQrPrototype(input)
  await verifyQrPrototype({ ...input, birthDate: '2000-02-29' })
  assert.equal(firstQrResult.certificate.birthDate, input.birthDate)
  assert.deepEqual(demoExamples, examplesBefore)
  assert.deepEqual(await verifyCertificate(input), { status: 'not-found' })
  assert.deepEqual(await verifyCertificate(demoExamples[0]), original)
  assert.deepEqual(await verifyCertificate(demoExamples[1]), { status: 'not-found' })
  assert.deepEqual(await verifyCertificate(demoExamples[2]), { status: 'invalid' })
  assert.deepEqual(await verifyQrPrototype(demoExamples[1]), { status: 'not-found' })
  assert.deepEqual(await verifyQrPrototype(demoExamples[2]), { status: 'not-found' })
})
