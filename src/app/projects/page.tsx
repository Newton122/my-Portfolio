"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { Tag, Eyebrow, PageShell, PageHeader, TONE, toneAt } from '@/components/ui'
import { localizeProjects, type Project } from '@/lib/projects'
import { useLanguage } from '@/context/LanguageContext'

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const projectsData = localizeProjects(language === 'fr' ? t.projects.data : null)
  const selectedIndex = projectsData.findIndex((p) => p.slug === selectedSlug)
  const selected: Project | null = selectedIndex >= 0 ? projectsData[selectedIndex] : null
  const setSelected = (p: Project | null) => setSelectedSlug(p?.slug ?? null)

  const lead =
    language === 'fr'
      ? 'Des projets construits pendant mes études — data, IA et web.'
      : 'Things I have built while studying — data, AI and web.'

  return (
    <PageShell width="wide" header={
        selected ? (
          <PageHeader eyebrow={selected.tagline} title={selected.title} tone={toneAt(selectedIndex + 1)} />
        ) : (
          <PageHeader eyebrow={language === 'fr' ? 'Travaux' : 'Work'} title={t.projects.title} lead={lead} tone="violet" />
        )
      }>
      {selected ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <button
            onClick={() => setSelected(null)}
            className="group mb-10 flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-signal"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            {language === 'fr' ? 'Retour aux projets' : 'Back to projects'}
          </button>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="lg:sticky lg:top-24">
              <figure className="panel overflow-hidden p-0">
                <div className="relative aspect-[4/3] bg-surface-2">
                  {selected.image ? (
                    <Image src={selected.image} alt={selected.imageAlt} fill className="object-cover" />
                  ) : (
                    <div className="bg-steel absolute inset-0 flex flex-col justify-end p-8">
                      <p className={`label-mono ${TONE[toneAt(selectedIndex + 1)].glow}`}>{selected.tagline}</p>
                      <p className="mt-3 font-display text-h1 font-semibold text-white">{selected.title}</p>
                    </div>
                  )}
                </div>
              </figure>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selected.tech.map((tech) => (
                  <Tag key={tech} label={tech} tone={toneAt(selectedIndex + 1)} />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-signal flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                >
                  <Github size={15} /> {language === 'fr' ? 'Voir sur GitHub' : 'View source'}
                </a>
                {selected.demo && (
                  <a
                    href={selected.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                  >
                    <ExternalLink size={15} /> {language === 'fr' ? 'Démo en direct' : 'Live demo'}
                  </a>
                )}
              </div>
            </div>

            <div>
              {/* Case-study structure: problem, solution, what broke,
                  what it taught. The order is the story, so the labels
                  carry it rather than decoration. */}
              <div className="divide-y divide-line border-t border-line">
                {[
                  { label: language === 'fr' ? 'Aperçu' : 'Overview', text: selected.description },
                  { label: language === 'fr' ? 'Réalisation' : 'What I built', text: selected.built },
                  { label: language === 'fr' ? 'Ce que j’ai appris' : 'What I learned', text: selected.learned },
                ]
                  .filter((section) => section.text)
                  .map((section, i) => (
                  <motion.div
                    key={section.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                    className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-8"
                  >
                    <Eyebrow tone={toneAt(selectedIndex + 1 + i)} className="sm:pt-1">{section.label}</Eyebrow>
                    <p className="max-w-prose text-lead text-ink-2">{section.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>

          <div className="divide-y divide-line border-y border-line">
            {projectsData.map((p, i) => (
              <motion.button
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => setSelected(p)}
                className="group w-full py-10 text-left"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <Eyebrow tone={toneAt(i + 1)} className="mb-3">{p.tagline}</Eyebrow>
                    <h2 className="text-h2 text-ink transition-colors group-hover:text-signal">{p.title}</h2>
                    <p className="mt-3 max-w-prose text-base text-ink-2">{p.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tech.map((tech) => (
                        <Tag key={tech} label={tech} tone={toneAt(i + 1)} />
                      ))}
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 self-start text-sm font-medium text-ink-3 transition-colors group-hover:text-signal">
                    {language === 'fr' ? 'Étude de cas' : 'Case study'}
                    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}
