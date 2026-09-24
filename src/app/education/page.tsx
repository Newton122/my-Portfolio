"use client"

import { motion } from 'framer-motion'
import { Star, BookOpen } from 'lucide-react'
import { Tag, PageShell, PageHeader, Eyebrow, TONE } from '@/components/ui'
import { COURSEWORK } from '@/lib/experience'
import { useLanguage } from '@/context/LanguageContext'

export default function EducationPage() {
  const { t, language } = useLanguage()

  return (
    <PageShell width="reading" header={<PageHeader
        eyebrow={language === 'fr' ? 'Formation' : 'Academics'}
        tone="blue"
        title={t.education.title}
        lead={t.education.subtitle}
      />}>

      {/* The degree, given the weight it deserves on a student CV. */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="panel p-7 sm:p-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Eyebrow tone="violet" className="mb-3">{t.education.degreeType}</Eyebrow>
            <h2 className="text-h1">{t.education.degree}</h2>
            <p className="data-mono mt-3 text-ink-3">
              USTHB · 2024 - {language === 'fr' ? 'Présent' : 'Present'}
            </p>
          </div>

          <div className="shrink-0">
            <span className="label-mono inline-flex items-center gap-1.5 rounded-full border border-positive/30 bg-positive-wash px-2.5 py-1.5 text-positive">
              <span className="h-1 w-1 rounded-full bg-positive" />
              {t.education.status}
            </span>
          </div>
        </div>

        <div className="mt-9 border-t border-line pt-8">
          <Eyebrow tone="teal" className="mb-4">{t.education.coursework}</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {COURSEWORK.map((c) => (
              <Tag key={c} label={c} tone="teal" />
            ))}
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line-strong bg-line-strong sm:grid-cols-2">
        {[
          { icon: BookOpen, title: t.education.interests.title1, text: t.education.interests.text1, tone: TONE.green },
          { icon: Star, title: t.education.interests.title2, text: t.education.interests.text2, tone: TONE.amber },
        ].map(({ icon: Icon, title, text, tone }, idx) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="bg-surface p-8"
          >
            <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-lg ${tone.chip}`}>
              <Icon size={16} />
            </div>
            <h3 className="text-h3">{title}</h3>
            <p className="mt-2 text-base text-ink-2">{text}</p>
          </motion.article>
        ))}
      </div>
    </PageShell>
  )
}
