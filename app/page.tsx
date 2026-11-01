import { CertificatePage } from '@/components/certificates/certificate-page'
import { getCertificateId, type CertificateSearchParams } from '@/lib/certificates'

export default async function Home({ searchParams }: { searchParams: Promise<CertificateSearchParams> }) {
  const params = await searchParams
  return <CertificatePage initialCertificateId={getCertificateId(params)} />
}
