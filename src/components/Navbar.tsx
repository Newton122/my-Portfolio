"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Download, Menu, X, Search } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import SearchDialogContent from './SearchDialogContent'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/context/LanguageContext'

const LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'skills', href: '/skills' },
  { key: 'experience', href: '/experience' },
  { key: 'education', href: '/education' },
  { key: 'certificates', href: '/testimonials' },
  { key: 'blog', href: '/blog' },
  { key: 'now', href: '/now' },
  { key: 'contact', href: '/contact' },
]

const GITHUB_URL = 'https://github.com/Newton122'
const LINKEDIN_URL = 'https://www.linkedin.com/in/brighton-matikiti-1a48b2365'

const ICON_BASE =
  'flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-200'
const iconButton = `${ICON_BASE} border-line text-ink-2 hover:border-signal-edge hover:text-signal`
const iconButtonOnHero = `${ICON_BASE} border-white/15 text-white/70 hover:border-signal-solid/60 hover:text-white`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { t, language } = useLanguage()

  // The bar stays weightless over the hero and gains a hairline +
  // blur only once content passes beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Every route now opens on a dark steel band — the home hero, or the
  // PageShell header — so the bar floats over it in light-on-dark until
  // the page scrolls beneath it.
  const overHero = !scrolled && !menuOpen

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-line bg-canvas'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 transition-opacity duration-200 hover:opacity-70"
        >
          <Image src="/logo.png" alt="Brighton Matikiti — home" width={100} height={32} className="h-7 w-auto" priority />
        </Link>

        {/* Desktop nav — a rail of quiet labels with a signal underline
            marking position. No pills; the underline is enough. */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          {LINKS.map(({ key, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`relative px-2.5 py-2 text-[0.8125rem] font-semibold transition-colors duration-200 ${
                overHero
                  ? isActive(href)
                    ? 'text-white'
                    : 'text-white/55 hover:text-white'
                  : isActive(href)
                    ? 'text-ink'
                    : 'text-ink-3 hover:text-ink'
              }`}
            >
              {t.nav[key as keyof typeof t.nav]}
              {isActive(href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2.5 -bottom-px h-[2px] rounded-full bg-signal-solid"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => setSearchOpen(true)}
            className={overHero ? iconButtonOnHero : iconButton}
            aria-label={language === 'fr' ? 'Recherche (Ctrl+K)' : 'Search (Ctrl+K)'}
          >
            <Search size={15} />
          </button>
          <ThemeToggle onHero={overHero} />
          <LanguageSwitcher onHero={overHero} />

          {[
            { href: GITHUB_URL, Icon: Github, label: 'GitHub' },
            { href: LINKEDIN_URL, Icon: Linkedin, label: 'LinkedIn' },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`transition-colors duration-200 ${
                overHero ? 'text-white/60 hover:text-white' : 'text-ink-3 hover:text-signal'
              }`}
            >
              <Icon size={17} />
            </a>
          ))}

          <a
            href="/resume.pdf"
            download
            className="btn-signal ml-1 flex items-center gap-1.5 px-3.5 py-2 text-[0.8125rem] font-medium"
          >
            <Download size={13} />
            {language === 'fr' ? 'CV' : 'Resume'}
          </a>
        </div>

        <button
          className={`lg:hidden ${overHero ? 'text-white' : 'text-ink'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={language === 'fr' ? 'Basculer le menu' : 'Toggle menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
          >
            <nav className="mx-auto max-w-7xl px-6 py-4" aria-label="Primary mobile">
              {LINKS.map(({ key, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`flex items-center justify-between border-b border-line py-3 text-base font-semibold transition-colors ${
                    isActive(href) ? 'text-signal' : 'text-ink-2'
                  }`}
                >
                  {t.nav[key as keyof typeof t.nav]}
                  {isActive(href) && <span className="h-4 w-[3px] rounded-full bg-signal-solid" />}
                </Link>
              ))}

              <div className="flex flex-wrap items-center gap-3 pt-5">
                <ThemeToggle />
                <LanguageSwitcher />
                <button onClick={() => setSearchOpen(true)} className={iconButton} aria-label="Search">
                  <Search size={15} />
                </button>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label="GitHub">
                  <Github size={16} />
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
                <a
                  href="/resume.pdf"
                  download
                  className="btn-signal flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
                >
                  <Download size={14} /> {language === 'fr' ? 'CV' : 'Resume'}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialogContent open={searchOpen} setOpen={setSearchOpen} />
    </header>
  )
}
