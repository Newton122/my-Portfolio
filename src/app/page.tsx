"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, ArrowUpRight, Github, Linkedin, MessageCircle } from 'lucide-react'
import { localizeProjects } from '@/lib/projects'
import { SKILLS } from '@/lib/skills'
import { BLOG_POSTS } from '@/lib/blog'
import { useLanguage } from '@/context/LanguageContext'
import HeroName from '@/components/HeroName'
import { Eyebrow, TONE, toneAt, type Tone } from '@/components/ui'
import DotsField from '@/components/DotsField'
import ChatTeaser from '@/components/ChatTeaser'

const ROLES_EN = ['machine learning', 'data pipelines', 'data analysis', 'full-stack apps']
const ROLES_FR = ['machine learning', 'pipelines de donnÃ©es', 'analyse de donnÃ©es', 'applications full-stack']

/* The three roles in the hero, each in its own hue. */
const ROLE_TONES: Tone[] = ['violet', 'teal', 'green']

/** The hero readout. A cursor that types through the things Brighton
 *  is working toward --- mono, because it is a field value, not a slogan. */
function Typewriter() {
  const { language } = useLanguage()
  const words = language === 'fr' ? ROLES_FR : ROLES_EN
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    if (!erasing && text === word) {
      const hold = setTimeout(() => setErasing(true), 1800)
      return () => clearTimeout(hold)
    }
    if (erasing && text === '') {
      const beat = setTimeout(() => {
        setErasing(false)
        setIndex((i) => (i + 1) % words.length)
      }, 260)
      return () => clearTimeout(beat)
    }
    const step = setTimeout(
      () => setText(erasing ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      erasing ? 34 : 68,
    )
    return () => clearTimeout(step)
  }, [text, erasing, index, words])

  return (
    <span className="text-signal-bright">
      {text}
      <span className="ml-px inline-block w-[0.5ch] animate-[caret_1.1s_steps(1)_infinite] bg-signal-bright align-middle text-transparent">
        &nbsp;
      </span>
    </span>
  )
}

export default function HomePage() {
  const { t, language } = useLanguage()
  const fr = language === 'fr'
  const projects = localizeProjects(fr ? t.projects.data : null)

  const ticker = Object.values(SKILLS).flat()

  return (
    <div className="overflow-x-clip">
      {/* -•-• Hero -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          Asymmetric on purpose: the type block runs to the left gutter
          and the portrait bleeds off the right edge, so the composition
          has a direction instead of sitting in a centred box. */}
      <section className="bg-steel relative isolate min-h-[100svh] overflow-hidden">
        <DotsField />
        <div className="grain pointer-events-none absolute inset-0" />

        {/* Portrait --- a cut-out with no plate behind it, so the figure
            stands directly in the dot field. The steel duotone lives in
            the filter chain rather than in an overlay, because an overlay
            would paint the empty half of the frame too. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] max-w-[640px] lg:block">
          <div className="relative h-full w-full">
            <Image
              src="/half-cutout.png"
              alt="Brighton Matikiti"
              fill
              priority
              sizes="(min-width: 1400px) 640px, 46vw"
              className="object-contain object-bottom opacity-90 [filter:grayscale(1)_contrast(1.05)_sepia(0.4)_hue-rotate(140deg)_saturate(1.2)]"
            />
            {/* Fades the waist crop into the ground so it reads as a
                figure receding, not one sliced off. */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--steel)] to-transparent" />
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {/* The bleeding portrait is a desktop composition; on narrow
                screens it becomes a plate above the name instead. */}
            <div className="mt-7 lg:hidden">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-signal-bright/30 bg-white/5">
                <Image
                  src="/half-cutout.png"
                  alt="Brighton Matikiti"
                  fill
                  priority
                  sizes="64px"
                  className="scale-[1.4] object-cover object-top [filter:grayscale(1)]"
                />
              </div>
            </div>

            <HeroName />

            <div className="mt-10 max-w-3xl">
              {/* The bar travels with the role before it, so a wrapped
                  line never starts on a separator. */}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-display text-[clamp(1.05rem,1.9vw,1.3rem)] font-semibold tracking-[-0.01em]">
                {t.home.roles.map((role, i) => (
                  <span key={role} className="flex items-center gap-3">
                    <span className={TONE[ROLE_TONES[i % ROLE_TONES.length]].glow}>{role}</span>
                    {i < t.home.roles.length - 1 && <span className="text-white/25">|</span>}
                  </span>
                ))}
              </p>
              <p className="mt-4 font-mono text-sm text-white/40">
                <span className="select-none text-white/20">$ </span>
                {fr ? 'orientation' : 'focus'} ---&nbsp;
                <Typewriter />
              </p>
            </div>

            <p className="mt-8 max-w-lg text-lead text-white/65">{t.home.description}</p>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="btn-signal group flex items-center gap-2 px-6 py-3 text-sm font-medium"
              >
                {t.home.viewProjects}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition-colors duration-200 hover:border-signal-bright/50 hover:text-signal-bright"
              >
                <Download size={15} /> {t.home.downloadResume}
              </a>
              <div className="ml-1 flex items-center gap-4 pl-1">
                <a
                  href="https://github.com/Newton122"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-white/35 transition-colors hover:text-signal-bright"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/brighton-matikiti-1a48b2365"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/35 transition-colors hover:text-signal-bright"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* -•-• Ticker -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          A full-bleed moving strip. Breaks the stacked-section rhythm
          and puts the whole toolchain on screen without a tag cloud. */}
      <div className="marquee-host mask-fade-x relative overflow-hidden border-b border-line bg-surface-sunk py-4">
        <div className="marquee-track gap-10">
          {[...ticker, ...ticker].map((s, i) => (
            <span key={`${s}-${i}`} className="data-mono flex shrink-0 items-center gap-10 text-ink-3">
              {s}
              <span aria-hidden className="text-signal/60">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* -•-• Selected work -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          Cards, not screenshots: the screenshots were all different
          shapes and themes and fought each other. The cards share the
          section's surface so they sit in the page rather than on top
          of it --- their drawn edge is what makes them cards. Order
          follows lib/projects.ts. */}
      <section className="border-b border-line bg-surface py-section">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 flex flex-col items-center gap-4 border-b border-line pb-10 text-center">
            <Eyebrow tone="violet">{t.projects.title}</Eyebrow>
            <h2 className="text-h1 sm:text-display">{t.home.featuredTitle}</h2>
            <Link
              href="/projects"
              className="data-mono inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-signal"
            >
              {t.home.featuredAll} <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => {
              const tone = TONE[toneAt(i + 1)]
              return (
                <motion.article
                  key={p.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`panel panel-interactive flex flex-col border-t-[3px] p-7 ${tone.edge}`}
                >
                  <div className={`text-sm font-semibold ${tone.text}`}>{p.tagline}</div>
                  <h3 className="mt-3 text-h2 text-ink">{p.title}</h3>
                  <p className="mt-3 flex-1 text-base text-ink-2">{p.description}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.tech.map((tech) => (
                      <li key={tech} className={`data-mono rounded-md px-2 py-1 text-[0.72rem] ${tone.chip}`}>
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-line pt-5 text-sm font-medium">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
                    >
                      <Github size={15} /> {fr ? 'Code' : 'Code'}
                    </a>
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
                      >
                        {fr ? 'DÃ©mo' : 'Live demo'} <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* -•-• Stack -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          Set as a spec sheet: category on the left, values on the
          right. A centred cloud of chips hides which things group
          together, which is the only interesting part. */}
      <section className="bg-steel relative isolate overflow-hidden py-section">
        <DotsField />
        <div className="grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-14 flex flex-col items-center gap-4 border-b border-white/10 pb-10 text-center">
            <Eyebrow tone="blue" onDark>{t.skillsPage.title}</Eyebrow>
            <h2 className="text-h1 text-white sm:text-display">{t.home.skillsTitle}</h2>
            <Link
              href="/skills"
              className="data-mono inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-signal-bright"
            >
              {fr ? 'Toutes les compÃ©tences' : 'Full stack'} <ArrowUpRight size={14} />
            </Link>
          </div>

          <dl className="divide-y divide-white/10">
            {Object.entries(SKILLS).map(([group, items], i) => {
              const learning = group === 'Currently Learning'
              return (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="grid grid-cols-1 gap-3 py-7 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
                >
                  {/* One colour for the whole list; amber marks the one
                      group that means something different --- in progress. */}
                  <dt className={`eyebrow pt-0.5 ${learning ? 'text-glow-amber' : 'text-white/45'}`}>
                    {(t.skills.categories as Record<string, string>)[group] ?? group}
                  </dt>
                  <dd className="flex flex-wrap gap-x-7 gap-y-2.5">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="data-mono text-[0.8125rem] text-white/75 transition-colors duration-200 hover:text-white"
                      >
                        {fr ? t.skills.skills[s] ?? s : s}
                      </span>
                    ))}
                  </dd>
                </motion.div>
              )
            })}
          </dl>

          <ChatTeaser />
        </div>
      </section>
 
      {/* -•-• Writing -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          One lead post, two follow-ups. Three equal cards give every
          post the same weight, which is never true. */}
      <section className="border-b border-line bg-canvas py-section">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 flex flex-col items-center gap-4 border-b border-line pb-10 text-center">
            <Eyebrow tone="green">{t.blog.title}</Eyebrow>
            <h2 className="text-h1 sm:text-display">{t.home.blogTitle}</h2>
            <Link
              href="/blog"
              className="data-mono inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-signal"
            >
              {fr ? 'Tous les articles' : 'All posts'} <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
            {BLOG_POSTS.slice(0, 1).map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="data-mono flex items-center gap-3 text-ink-3">
                    <span className="text-hue-green">{post.category}</span>
                    <span aria-hidden>&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink transition-colors group-hover:text-signal">
                    {post.title}
                  </h3>
                  <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-2">{post.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-signal">
                    {fr ? 'Lire' : 'Read post'}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}

            <div className="divide-y divide-line border-t border-line">
              {BLOG_POSTS.slice(1, 4).map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block py-5">
                    <div className="data-mono flex items-center gap-3 text-ink-3">
                      <span>{post.date}</span>
                      <span aria-hidden>&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-2 text-h3 leading-snug text-ink transition-colors group-hover:text-signal">
                      {post.title}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -•-• Close -•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•-•
          Ranged left against a dark band, with the address set as the
          largest thing on screen --- it is the actual call to action. */}
      <section className="bg-steel relative isolate overflow-hidden py-section">
        <DotsField />
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6">
          <Eyebrow tone="amber" onDark>{t.contact.title}</Eyebrow>
          <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            {t.cta.title}
          </h2>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-white/55">{t.cta.description}</p>

          <a
            href="mailto:brightonmatic4@gmail.com"
            className="group mt-10 inline-flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(1.1rem,2.4vw,1.5rem)] font-medium tracking-[-0.01em] text-white transition-colors hover:text-signal-bright"
          >
            {/* The rule under the address is the underline of the link
                itself, so it marks something instead of decorating. */}
            <span className="underline decoration-white/25 decoration-1 underline-offset-[10px] transition-colors duration-200 group-hover:decoration-signal-bright">
              brightonmatic4@gmail.com
            </span>
            <ArrowUpRight
              className="h-[0.8em] w-[0.8em] shrink-0 text-signal-bright transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="btn-signal group flex items-center gap-2 px-6 py-3 text-sm font-medium"
            >
              {t.cta.getInTouch}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://www.linkedin.com/in/brighton-matikiti-1a48b2365"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:border-signal-bright/50 hover:text-signal-bright"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <motion.a
        href="https://wa.me/213791938758"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message Brighton on WhatsApp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[5.25rem] right-5 z-40 flex h-11 w-11 sm:bottom-24 sm:right-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1DA851]"
      >
        <MessageCircle size={19} />
      </motion.a>
    </div>
  )
}
