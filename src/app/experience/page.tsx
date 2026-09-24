"use client"

import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, Code2 } from 'lucide-react'
import { Tag, PageShell, PageHeader } from '@/components/ui'
import { EXPERIENCE_TIMELINE, type TimelineItem } from '@/lib/experience'
import { useLanguage } from '@/context/LanguageContext'

// Entry type drives the marker --- the only place an icon carries
// information rather than decoration on this page.
const TYPE_META = {
  education: { Icon: GraduationCap, tint: 'text-hue-violet border-hue-violet/30 bg-hue-violet/10', text: 'text-hue-violet' },
  learning: { Icon: BookOpen, tint: 'text-hue-amber border-hue-amber/30 bg-hue-amber/10', text: 'text-hue-amber' },
  default: { Icon: Code2, tint: 'text-hue-blue border-hue-blue/30 bg-hue-blue/10', text: 'text-hue-blue' },
} as const

export default function ExperiencePage() {
  const { t, language } = useLanguage()
  const timeline = language === 'fr' ? (t.experience.timeline as TimelineItem[]) : EXPERIENCE_TIMELINE

  return (
    <PageShell width="reading" header={<PageHeader
        eyebrow={language === 'fr' ? 'Parcours' : 'Journey'}
        tone="amber"
        title={t.experience.title}
        lead={t.experience.subtitle}
      />}>

      {/* A true sequence, so the timeline rail earns its place. */}
      <div className="relative">
        <div className="absolute bottom-2 left-[15px] top-2 w-[2px] bg-line" aria-hidden />

        <div className="space-y-14">
          {timeline.map((item, i) => {
            const meta = TYPE_META[(item.type as keyof typeof TYPE_META) in TYPE_META ? (item.type as 'education' | 'learning') : 'default']
            const { Icon, tint, text } = meta
            return (
              <motion.article
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative pl-14"
              >
                <span
                  className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-canvas ${tint}`}
                >
                  <Icon size={14} />
                </span>

                <div className="data-mono mb-1.5 text-ink-3">{item.period}</div>
                <h2 className="text-h3">{item.title}</h2>
                <div className={`mt-1 text-sm font-semibold ${text}`}>{item.org}</div>
                <p className="mt-2.5 max-w-prose text-base leading-relaxed text-ink-2">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </PageShell>
  )
}
