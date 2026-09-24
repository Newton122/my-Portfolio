"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Eyebrow } from '@/components/ui'
import { useLanguage } from '@/context/LanguageContext'

const GITHUB_URL = 'https://github.com/Newton122'
const LINKEDIN_URL = 'https://www.linkedin.com/in/brighton-matikiti-1a48b2365'
const EMAIL = 'matikitibrighton6@gmail.com'

const PAGES = [
  { label: 'Home', href: '/', labelFr: 'Accueil' },
  { label: 'About', href: '/about', labelFr: '�- propos' },
  { label: 'Projects', href: '/projects', labelFr: 'Projets' },
  { label: 'Skills', href: '/skills', labelFr: 'Compétences' },
  { label: 'Blog', href: '/blog', labelFr: 'Blog' },
]

const MORE = [
  { label: 'Experience', href: '/experience', labelFr: 'Expérience' },
  { label: 'Education', href: '/education', labelFr: 'Éducation' },
  { label: 'Certificates', href: '/testimonials', labelFr: 'Certificats' },
  { label: 'Now', href: '/now', labelFr: 'Maintenant' },
  { label: 'Contact', href: '/contact', labelFr: 'Contact' },
]

export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <Image src="/logo.png" alt="Brighton Matikiti" width={100} height={32} className="mb-4 h-7 w-auto" />
            <p className="max-w-xs text-sm leading-relaxed text-ink-2">{t.footer.description}</p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: GITHUB_URL, Icon: Github, label: 'GitHub' },
                { href: LINKEDIN_URL, Icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${EMAIL}`, Icon: Mail, label: 'Email' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-2 transition-colors duration-200 hover:border-signal-edge hover:text-signal"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: language === 'fr' ? 'Pages' : 'Pages', items: PAGES },
            { title: language === 'fr' ? 'Plus' : 'More', items: MORE },
          ].map(({ title, items }) => (
            <nav key={title} aria-label={title}>
              <Eyebrow className="mb-4">{title}</Eyebrow>
              <ul className="flex flex-col gap-2.5">
                {items.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="link-quiet text-sm">
                      {language === 'fr' ? p.labelFr : p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <Eyebrow className="mb-4">{language === 'fr' ? 'Disponibilité' : 'Availability'}</Eyebrow>
            <div className="panel p-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                <span className="label-mono text-positive">
                  {language === 'fr' ? 'Ouvert aux stages' : 'Open to internships'}
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-2">
                {language === 'fr'
                  ? 'Data, IA et développement full-stack.'
                  : 'Data, AI and full-stack roles.'}
              </p>
              <Link href="/contact" className="link-quiet mt-3 inline-block text-sm font-medium">
                {language === 'fr' ? 'Me contacter' : 'Get in touch'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="data-mono text-ink-3">
            © {new Date().getFullYear()} Brighton Matikiti ·{' '}
            {language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}
          </p>
          <p className="data-mono text-ink-3">
            {language === 'fr' ? 'Construit avec Next.js et Tailwind' : 'Built with Next.js & Tailwind'}
          </p>
        </div>
      </div>
    </footer>
  )
}
