"use client"

import { motion } from 'framer-motion'
import DotsField from '@/components/DotsField'

/**
 * Shared design-system primitives.
 *
 * Sections open with an eyebrow in one of the accent hues above the
 * heading. The hue changes from section to section, so the colour
 * itself becomes the signpost.
 */

const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export type Tone = 'violet' | 'blue' | 'teal' | 'green' | 'amber'

/** Order used when cycling through a list (projects, skill groups--¦). */
export const TONE_ORDER: Tone[] = ['violet', 'blue', 'teal', 'green', 'amber']
export const toneAt = (i: number): Tone => TONE_ORDER[i % TONE_ORDER.length]

/* Full class strings, spelled out so Tailwind's scanner can find them. */
export const TONE: Record<
  Tone,
  { text: string; glow: string; bg: string; glowBg: string; chip: string; edge: string }
> = {
  violet: {
    text: 'text-hue-violet',
    glow: 'text-glow-violet',
    bg: 'bg-hue-violet',
    glowBg: 'bg-glow-violet',
    chip: 'bg-hue-violet/[0.12] text-hue-violet',
    edge: 'border-t-hue-violet',
  },
  blue: {
    text: 'text-hue-blue',
    glow: 'text-glow-blue',
    bg: 'bg-hue-blue',
    glowBg: 'bg-glow-blue',
    chip: 'bg-hue-blue/[0.12] text-hue-blue',
    edge: 'border-t-hue-blue',
  },
  teal: {
    text: 'text-hue-teal',
    glow: 'text-glow-teal',
    bg: 'bg-hue-teal',
    glowBg: 'bg-glow-teal',
    chip: 'bg-hue-teal/[0.12] text-hue-teal',
    edge: 'border-t-hue-teal',
  },
  green: {
    text: 'text-hue-green',
    glow: 'text-glow-green',
    bg: 'bg-hue-green',
    glowBg: 'bg-glow-green',
    chip: 'bg-hue-green/[0.12] text-hue-green',
    edge: 'border-t-hue-green',
  },
  amber: {
    text: 'text-hue-amber',
    glow: 'text-glow-amber',
    bg: 'bg-hue-amber',
    glowBg: 'bg-glow-amber',
    chip: 'bg-hue-amber/[0.12] text-hue-amber',
    edge: 'border-t-hue-amber',
  },
}

/** Section kicker. `onDark` picks the lifted hue for the steel bands. */
export function Eyebrow({
  children,
  className = '',
  tone = 'teal',
  onDark = false,
}: {
  children: React.ReactNode
  className?: string
  tone?: Tone
  onDark?: boolean
}) {
  return <div className={`eyebrow ${onDark ? TONE[tone].glow : TONE[tone].text} ${className}`}>{children}</div>
}

/** Technology / topic chip. A tinted fill, not an outline: at this size
 *  a 1px hairline is all anyone sees, and a grid of them reads as a form
 *  rather than a list of labels. Neutral by default, tinted with a tone. */
export function Tag({ label, tone }: { label: string; tone?: Tone }) {
  return (
    <span
      className={`data-mono inline-block rounded-md px-2.5 py-1.5 text-[0.75rem] leading-none transition-colors duration-200 ${
        tone ? TONE[tone].chip : 'bg-surface-2 text-ink-2 hover:text-signal'
      }`}
    >
      {label}
    </span>
  )
}

/** Top-of-page header. Rendered by PageShell inside the steel band,
 *  so everything here is set light-on-dark. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  tone = 'teal',
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  lead?: React.ReactNode
  tone?: Tone
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Eyebrow tone={tone} onDark>
        {eyebrow}
      </Eyebrow>
      <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white">
        {title}
      </h1>
      {lead && <p className="mt-6 max-w-[60ch] text-lead text-white/60">{lead}</p>}
    </motion.div>
  )
}

/**
 * Standard page shell.
 *
 * The header is a prop rather than a child because it is full-bleed: the
 * steel band has to span the viewport while the body below it stays inside
 * the max-w-6xl gutter shared with the navbar and footer. `width` narrows
 * the content measure inside that gutter rather than re-centring the page,
 * which is what keeps the vertical edge unbroken between routes.
 */
export function PageShell({
  children,
  width = 'wide',
  header,
}: {
  children: React.ReactNode
  width?: 'narrow' | 'reading' | 'wide'
  header?: React.ReactNode
}) {
  const measure =
    width === 'narrow' ? 'max-w-3xl' : width === 'reading' ? 'max-w-4xl' : ''
  return (
    <div className="bg-canvas pb-32">
      {header && (
        <header className="bg-steel relative isolate overflow-hidden">
          <DotsField />
          <div className="grain pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-36 sm:pb-20 sm:pt-44">
            <div className={measure}>{header}</div>
          </div>
        </header>
      )}
      <div className={`mx-auto max-w-6xl px-6 ${header ? 'pt-16 sm:pt-20' : 'pt-28 sm:pt-32'}`}>
        <div className={measure}>{children}</div>
      </div>
    </div>
  )
}

export { reveal }
