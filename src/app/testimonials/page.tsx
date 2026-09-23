"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, ArrowUpRight } from 'lucide-react'
import { PageShell, PageHeader, Eyebrow } from '@/components/ui'
import { CERTIFICATES } from '@/lib/certificates'
import { useLanguage } from '@/context/LanguageContext'

export default function CertificatesPage() {
  const { t, language } = useLanguage()
  const certificates = language === 'fr' ? t.testimonials.data : CERTIFICATES

  return (
    <PageShell width="wide" header={<PageHeader
        eyebrow={language === 'fr' ? 'Vérifiable' : 'Verifiable'}
        title={t.testimonials.title}
        lead={t.testimonials.subtitle}
      />}>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {certificates.map((cert: any, i: number) => (
          <motion.div
            key={cert.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              href={`/testimonials/${cert.slug}`}
              className="panel panel-interactive group flex h-full flex-col p-5 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-signal-edge bg-signal-wash">
                  <Award size={16} className="text-signal" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="data-mono mb-1.5 text-ink-3">{cert.date}</div>
                  <h2 className="text-h3 leading-snug transition-colors group-hover:text-signal">{cert.title}</h2>
                  <Eyebrow className="mt-2">{cert.subtitle}</Eyebrow>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">{cert.description}</p>

              <span className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium text-ink-2 transition-colors group-hover:text-signal">
                {language === 'fr' ? 'Voir le certificat' : 'View certificate'}
                <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
