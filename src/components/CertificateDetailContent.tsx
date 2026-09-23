"use client"

import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Award } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Certificate } from '@/lib/certificates'
import { useLanguage } from '@/context/LanguageContext'
import DotsField from '@/components/DotsField'

export default function CertificateDetailContent({ certificate }: { certificate: Certificate }) {
  const { t, language } = useLanguage()
  const cert =
    language === 'fr'
      ? t.testimonials.data.find((c: any) => c.slug === certificate.slug) || certificate
      : certificate

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      {/* Steel band, matching every other route, so the floating navbar
          always has something dark behind it. */}
      <div className="bg-steel relative isolate overflow-hidden">
        <DotsField />
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-6 pb-14 pt-32 sm:pb-16 sm:pt-36">
          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-signal-bright"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            {language === 'fr' ? 'Retour aux certificats' : 'Back to certificates'}
          </Link>

          <div className="mt-8 flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-signal-bright/25 bg-signal-bright/10">
              <Award size={19} className="text-signal-bright" />
            </span>
            <div>
              <div className="label-mono text-signal-bright">{cert.subtitle}</div>
              <h1 className="mt-2 font-display text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1] tracking-[-0.03em] text-white">
                {cert.title}
              </h1>
              <p className="data-mono mt-3 text-white/40">{cert.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-14 sm:pt-16">
      <figure className="panel overflow-hidden p-0">
        <Image
          src={certificate.preview}
          alt={cert.previewLabel || cert.title}
          width={900}
          height={640}
          className="h-auto w-full bg-surface-2 object-contain"
        />
      </figure>

      <p className="mt-8 max-w-prose text-base leading-relaxed text-ink-2">{cert.description}</p>

      <a
        href={certificate.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-signal mt-8 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
      >
        <ExternalLink size={15} /> {language === 'fr' ? 'Vérifier le certificat' : 'Verify certificate'}
      </a>
      </div>
    </motion.div>
  )
}
