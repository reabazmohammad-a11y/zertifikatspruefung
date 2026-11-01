import assert from 'node:assert/strict'
import test from 'node:test'
import { demoExamples, getCertificateId, validateVerificationInput, verifyCertificate } from '../lib/certificates.ts'

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
