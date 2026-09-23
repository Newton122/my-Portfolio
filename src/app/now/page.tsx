"use client"

import { motion } from 'framer-motion'
import { Cpu, Database, Cloud, BookOpen } from 'lucide-react'
import { PageShell, PageHeader, Eyebrow, TONE, type Tone } from '@/components/ui'
import { useLanguage } from '@/context/LanguageContext'

const ICONS = { Cpu, Database, Cloud } as const
const LEARNING_TONES: Tone[] = ['violet', 'teal', 'blue']

/** Every block on this page is the same shape: a mono label in the
 *  left column, the current state of things in the right. */
function NowBlock({ label, tone, children }: { label: string; tone: Tone; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-[9rem_1fr] sm:gap-8"
    >
      <Eyebrow tone={tone} className="sm:pt-1">{label}</Eyebrow>
      <div className="max-w-prose">{children}</div>
    </motion.section>
  )
}

export default function NowPage() {
  const { t, language } = useLanguage()
  const fr = language === 'fr'

  return (
    <PageShell width="narrow" header={<PageHeader
        eyebrow={fr ? 'Maintenant' : 'Now'}
        tone="teal"
        title={t.now.subtitle}
      />}>

      <p className="data-mono mb-4 text-ink-3">
        {t.now.lastUpdated}
      </p>

      <div className="divide-y divide-line border-y border-line">
        <NowBlock label={t.now.learning} tone="violet">
          <ul className="space-y-6">
            {t.now.learningData.map(({ topic, detail, icon }, i) => {
              const Icon = ICONS[icon as keyof typeof ICONS] ?? Cpu
              return (
              <li key={topic} className="flex items-start gap-4">
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TONE[LEARNING_TONES[i % 3]].chip}`}>
                  <Icon size={16} />
                </span>
                <div>
                  <div className="font-medium text-ink">{topic}</div>
                  <div className="mt-0.5 text-base text-ink-2">{detail}</div>
                </div>
              </li>
              )
            })}
          </ul>
        </NowBlock>

        <NowBlock label={t.now.building} tone="blue">
          <p className="text-base text-ink-2">
            {fr
              ? 'De nouveaux projets data et IA — bientôt sur la page Projets.'
              : 'New data and AI projects — coming soon to the Projects page.'}
          </p>
        </NowBlock>

        <NowBlock label={t.now.reading} tone="green">
          <ul className="space-y-3">
            {t.now.readingData.map(({ title, author }) => (
              <li key={title} className="flex items-start gap-3">
                <BookOpen size={15} className="mt-1 shrink-0 text-ink-3" />
                <span className="text-base text-ink-2">
                  <span className="font-medium text-ink">{title}</span> — {author}
                </span>
              </li>
            ))}
          </ul>
        </NowBlock>

        <NowBlock label={fr ? 'Recherche' : 'Looking for'} tone="amber">
          <p className="text-base text-ink-2">{t.now.lookingFor}</p>
        </NowBlock>
      </div>
    </PageShell>
  )
}
