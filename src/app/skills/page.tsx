"use client"

import { motion } from 'framer-motion'
import { PageShell, PageHeader, TONE, toneAt } from '@/components/ui'
import { SKILLS } from '@/lib/skills'
import { useLanguage } from '@/context/LanguageContext'

export default function SkillsPage() {
  const { t, language } = useLanguage()

  const lead = t.skillsPage.subtitle

  return (
    <PageShell width="reading" header={<PageHeader eyebrow="Stack" title={t.skillsPage.title} lead={lead} tone="green" />}>

      {/* Category on the left, the stack itself on the right. Reads
          like a spec sheet, which is what it is. */}
      <div className="divide-y divide-line border-y border-line">
        {Object.entries(SKILLS).map(([category, items], i) => {
          const isLearning = category === 'Currently Learning'
          const tone = toneAt(i)
          return (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <div>
                <h2 className={`text-h3 ${TONE[tone].text}`}>
                  {(t.skills.categories as Record<string, string>)[category] ?? category}
                </h2>
                {isLearning && (
                  <span className="label-mono mt-2 inline-flex items-center gap-1.5 rounded-full bg-positive-wash px-2 py-1 text-positive">
                    <span className="h-1 w-1 rounded-full bg-positive" />
                    {language === 'fr' ? 'En cours' : 'In progress'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((skill) => {
                  const displaySkill = language === 'fr' ? t.skills.skills[skill] ?? skill : skill
                  return (
                    <span
                      key={skill}
                      className={`data-mono rounded-md px-3 py-2 text-[0.8125rem] ${TONE[tone].chip}`}
                    >
                      {displaySkill}
                    </span>
                  )
                })}
              </div>
            </motion.section>
          )
        })}
      </div>

    </PageShell>
  )
}
