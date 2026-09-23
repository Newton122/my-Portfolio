"use client"

import { Github, Linkedin, Mail, FileDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const GITHUB_URL = 'https://github.com/Newton122'
const LINKEDIN_URL = 'https://www.linkedin.com/in/brighton-matikiti-1a48b2365'
const EMAIL = 'matikitibrighton6@gmail.com'

const LINKS = [
  { href: `mailto:${EMAIL}`, icon: Mail, label: 'Email me', labelFr: "M'écrire", primary: true },
  { href: GITHUB_URL, icon: Github, label: 'GitHub', labelFr: 'GitHub', external: true },
  { href: LINKEDIN_URL, icon: Linkedin, label: 'LinkedIn', labelFr: 'LinkedIn', external: true },
  { href: '/resume.pdf', icon: FileDown, label: 'Resume', labelFr: 'CV', external: true },
]

const SHELL = 'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200'

/**
 * Fixed vertical contact rail. Only from xl up, where the page gutter
 * is wide enough that it sits beside the 6xl column instead of on top
 * of it.
 *
 * The four buttons live inside one small opaque card rather than
 * hovering as four separate chips: the card is the thing that sits on
 * the page, so it can carry a single shadow and read as attached
 * furniture. It can straddle the seam where a dark steel band ends and
 * the canvas begins, so it uses `--surface`, which works on either.
 */
export default function ContactRail() {
  const { language } = useLanguage()

  return (
    <div className="rail-in pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      <nav
        aria-label={language === 'fr' ? 'Me contacter' : 'Get in touch'}
        className="rail-card pointer-events-auto flex flex-col items-center gap-0.5 rounded-xl p-1.5"
      >
        {LINKS.map(({ href, icon: Icon, label, labelFr, primary, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={language === 'fr' ? labelFr : label}
            className="group relative block"
          >
            {/* The email button carries the signal fill so the card has
                one obvious primary; the rest are quiet until hovered. */}
            <span className={`${SHELL} ${primary ? 'btn-signal' : 'rail-chip'}`}>
              <Icon size={15} strokeWidth={1.9} />
            </span>

            {/* Name slides out of the button on hover. */}
            <span
              aria-hidden
              className="label-mono pointer-events-none absolute left-full top-1/2 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-md border border-line bg-surface px-2 py-1.5 text-ink-2 opacity-0 shadow-md transition duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            >
              {language === 'fr' ? labelFr : label}
            </span>
          </a>
        ))}
      </nav>

      <span
        aria-hidden
        className="label-mono select-none rotate-180 text-ink-3 [writing-mode:vertical-rl]"
      >
        {language === 'fr' ? 'Me contacter' : 'Get in touch'}
      </span>
    </div>
  )
}
