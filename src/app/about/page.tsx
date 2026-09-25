"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import { PageShell, PageHeader, Eyebrow, TONE, toneAt } from '@/components/ui'
import { useLanguage } from '@/context/LanguageContext'

const GITHUB_URL = 'https://github.com/Newton122'
const LINKEDIN_URL = 'https://www.linkedin.com/in/brighton-matikiti-1a48b2365'
const EMAIL = 'matikitibrighton6@gmail.com'

export default function AboutPage() {
  const { t, language } = useLanguage()
  const values = [
    { title: t.about.depth, body: t.about.depthBody },
    { title: t.about.building, body: t.about.buildingBody },
    { title: t.about.honesty, body: t.about.honestyBody },
  ]
  const paragraphs = [t.about.intro2, t.about.intro3].filter(Boolean)

  return (
    <PageShell width="wide" header={<PageHeader
        eyebrow={language === 'fr' ? 'Profil' : 'Profile'}
        tone="violet"
        title={t.about.title}
        lead={t.about.intro1}
      />}>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        {/* Narrative column, set at reading width. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-prose space-y-6">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-lead text-ink-2">
                {para}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid max-w-prose grid-cols-1 gap-5 border-y border-line py-6 sm:grid-cols-2">
            <div>
              <dt className="label-mono text-ink-3">{t.about.nationalityLabel}</dt>
              <dd className="mt-2 text-base font-semibold text-ink">{t.about.nationality}</dd>
            </div>
            <div>
              <dt className="label-mono text-ink-3">{t.about.languagesLabel}</dt>
              <dd className="mt-2 text-base font-semibold text-ink">{t.about.languages}</dd>
            </div>
          </dl>

          <div className="mt-12 border-t border-line pt-8">
            <Eyebrow tone="blue" className="mb-5">{language === 'fr' ? 'Me joindre' : 'Reach me'}</Eyebrow>
            <div className="flex flex-col gap-2.5">
              {[
                { href: GITHUB_URL, Icon: Github, label: 'github.com/Newton122' },
                { href: LINKEDIN_URL, Icon: Linkedin, label: 'linkedin.com/in/brighton-matikiti' },
                { href: `mailto:${EMAIL}`, Icon: Mail, label: EMAIL },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-ink-2 transition-colors hover:text-signal"
                >
                  <Icon size={15} className="shrink-0 text-ink-3 transition-colors group-hover:text-signal" />
                  <span className="data-mono truncate">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Image column - one lead frame plus two supporting stills. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-3"
        >
          <figure className="panel overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-surface-2">
              <Image src="/img.jpg" alt="Brighton at work" fill className="object-cover" />
            </div>
            <figcaption className="label-mono border-t border-line px-4 py-3 text-ink-3">
              {t.about.myProfile}
            </figcaption>
          </figure>

          <div className="grid grid-cols-2 gap-3">
            {[
              { src: '/managerdash.png', alt: 'Unitrans dashboard', caption: 'Unitrans' },
              { src: '/SmartTask.png', alt: 'Smart Task Tracker interface', caption: 'Smart Task' },
            ].map(({ src, alt, caption }) => (
              <figure key={src} className="panel overflow-hidden p-0">
                <div className="relative aspect-square bg-surface-2">
                  <Image src={src} alt={alt} fill className="object-cover" />
                </div>
                <figcaption className="label-mono border-t border-line px-3 py-2.5 text-ink-3">
                  {caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Values - three short lines, each carrying one hue. */}
      <section className="mt-28 border-t border-line pt-16">
        <h2 className="text-h1 sm:text-display">{t.about.valuesTitle}</h2>

        <dl className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {values.map(({ title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="border-t-2 pt-6"
              style={{ borderColor: `rgb(var(--hue-${toneAt(i)}-rgb))` }}
            >
              <dt className={`text-h2 font-display font-semibold leading-snug ${TONE[toneAt(i)].text}`}>{title}</dt>
              <dd className="mt-3 text-base text-ink-2">{body}</dd>
            </motion.div>
          ))}
        </dl>
      </section>
    </PageShell>
  )
}
