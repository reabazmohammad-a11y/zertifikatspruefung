import assert from 'node:assert/strict'
import test from 'node:test'
import { demoExamples, formatBirthDateInput, maskBirthDateInput, parseBirthDateInput, formatIssuedAt, getCertificateId, validateVerificationInput, verifyCertificate, verifyQrPrototype } from '../lib/certificates.ts'

test('Punkte erscheinen sofort nach Tag und Monat bei fortlaufender Zahleneingabe', () => {
  let previous = ''
  const expected = ['0', '05.', '05.0', '05.08.', '05.08.1', '05.08.19', '05.08.199', '05.08.1992']
  for (const [index, digit] of [...'05081992'].entries()) {
    const raw = previous + digit
    const result = maskBirthDateInput(raw, previous, raw.length, 'insertText')
    assert.deepEqual(result, { formatted: expected[index], cursor: expected[index].length })
    previous = result.formatted
  }
  assert.equal(parseBirthDateInput(previous), '1992-08-05')
})

test('Löschen an automatischen Punkten bleibt möglich', () => {
  assert.deepEqual(maskBirthDateInput('05', '05.', 2, 'deleteContentBackward'), { formatted: '0', cursor: 1 })
  assert.deepEqual(maskBirthDateInput('05.08', '05.08.', 5, 'deleteContentBackward'), { formatted: '05.0', cursor: 4 })
  assert.deepEqual(maskBirthDateInput('0508.1992', '1992-08-05', 2, 'deleteContentForward'), { formatted: '05.81.992', cursor: 2 })
  assert.deepEqual(maskBirthDateInput('', '1992-08-05', 0, 'deleteContentBackward'), { formatted: '', cursor: 0 })
})

test('Einfügen und Korrekturen behalten Format und Cursorposition', () => {
  for (const raw of ['05081992', '05.08.1992', '1992-08-05']) {
    assert.deepEqual(maskBirthDateInput(raw, '', raw.length, 'insertFromPaste'), { formatted: '05.08.1992', cursor: 10 })
  }
  assert.deepEqual(maskBirthDateInput('05.09.1992', '1992-08-05', 5, 'insertText'), { formatted: '05.09.1992', cursor: 6 })
  assert.deepEqual(maskBirthDateInput('05.a', '05.', 4, 'insertText'), { formatted: '05.', cursor: 3 })
})

test('Zahleneingabe und deutsches Datum werden ohne Zeitzonenwechsel umgewandelt', () => {
  for (const [digits, german, iso] of [['05061992', '05.06.1992', '1992-06-05'], ['29022000', '29.02.2000', '2000-02-29'], ['23111985', '23.11.1985', '1985-11-23']]) {
    assert.equal(parseBirthDateInput(digits), iso)
    assert.equal(parseBirthDateInput(german), iso)
    assert.equal(formatBirthDateInput(iso), german)
  }
})

test('Leeren und Bearbeiten lassen unvollständige Eingaben unverändert', () => {
  for (const value of ['', '0', '05', '0506', '0506199', '05.06.199', 'text']) {
    assert.equal(parseBirthDateInput(value), value)
    assert.equal(formatBirthDateInput(value), value)
    if (value) assert.ok(validateVerificationInput({ ...demoExamples[0], birthDate: parseBirthDateInput(value) }).birthDate)
  }
})

test('Ungültige numerische Datumsangaben werden nicht korrigiert oder akzeptiert', () => {
  for (const value of ['30021992', '31041992', '01012099', '01011899', '29021993', '00121992']) {
    assert.ok(validateVerificationInput({ ...demoExamples[0], birthDate: parseBirthDateInput(value) }).birthDate)
  }
})

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
