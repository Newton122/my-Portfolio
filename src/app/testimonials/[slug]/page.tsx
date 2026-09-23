import { notFound } from 'next/navigation'
import { CERTIFICATES } from '@/lib/certificates'
import CertificateDetailContent from '@/components/CertificateDetailContent'

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cert = CERTIFICATES.find((c) => c.slug === slug)
  return { title: cert ? `${cert.title} — Certificate` : 'Certificate' }
}

export default async function CertificateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const certificate = CERTIFICATES.find((c) => c.slug === slug)
  if (!certificate) return notFound()

  return (
    <div className="bg-canvas pb-24">
      <CertificateDetailContent certificate={certificate} />
    </div>
  )
}
