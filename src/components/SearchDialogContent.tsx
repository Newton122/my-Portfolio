"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { PROJECTS } from '@/lib/projects'
import { useLanguage } from '@/context/LanguageContext'

interface SearchResult {
  type: 'page' | 'blog' | 'project'
  title: string
  href: string
  excerpt?: string
}

const PAGES_EN = [
  { label: 'Home', href: '/', excerpt: 'Data & AI engineering student portfolio' },
  { label: 'About', href: '/about', excerpt: 'About Brighton Matikiti' },
  { label: 'Projects', href: '/projects', excerpt: 'Software projects built while studying' },
  { label: 'Skills', href: '/skills', excerpt: 'Technologies I use and am learning' },
  { label: 'Experience', href: '/experience', excerpt: 'Academic work and personal projects' },
  { label: 'Education', href: '/education', excerpt: 'AI Engineering at USTHB' },
  { label: 'Blog', href: '/blog', excerpt: 'Notes on engineering and learning' },
  { label: 'Now', href: '/now', excerpt: 'What I am doing now' },
  { label: 'Contact', href: '/contact', excerpt: 'Get in touch' },
]

const PAGES_FR = [
  { label: 'Accueil', href: '/', excerpt: 'Portfolio d\'étudiant en ingénierie Data & IA' },
  { label: '�- propos', href: '/about', excerpt: '�- propos de Brighton Matikiti' },
  { label: 'Projets', href: '/projects', excerpt: 'Projets logiciels réalisés pendant mes études' },
  { label: 'Compétences', href: '/skills', excerpt: 'Technologies que j\'utilise et j\'apprends' },
  { label: 'Expérience', href: '/experience', excerpt: 'Travail académique et projets personnels' },
  { label: 'Éducation', href: '/education', excerpt: 'Ingénierie IA à l\'USTHB' },
  { label: 'Blog', href: '/blog', excerpt: 'Notes sur l\'ingénierie et l\'apprentissage' },
  { label: 'Maintenant', href: '/now', excerpt: 'Ce que je fais actuellement' },
  { label: 'Contact', href: '/contact', excerpt: 'Me contacter' },
]

export default function SearchDialogContent({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { language } = useLanguage()
  const PAGES = language === 'fr' ? PAGES_FR : PAGES_EN
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        document.getElementById('search-input')?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const allResults: SearchResult[] = [
    ...PAGES.map((p) => ({ type: 'page' as const, title: p.label, href: p.href, excerpt: p.excerpt })),
    ...BLOG_POSTS.map((p) => ({ type: 'blog' as const, title: p.title, href: `/blog/${p.slug}`, excerpt: p.excerpt })),
    ...PROJECTS.map((p) => ({ type: 'project' as const, title: p.title, href: `/projects/${p.slug}`, excerpt: p.description })),
  ]

  const results = query.trim()
    ? allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          (r.excerpt && r.excerpt.toLowerCase().includes(query.toLowerCase()))
      )
    : allResults

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0b0e13]/80 px-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search size={17} className="shrink-0 text-ink-3" />
              <input
                id="search-input"
                type="text"
                placeholder={language === 'fr' ? 'Rechercher des pages, articles, projets...' : 'Search pages, blog posts, projects...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base text-ink placeholder-ink-3 focus:outline-none"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={14} />
              </motion.button>
            </div>

             <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-10 text-center text-base text-ink-2">
                  {language === 'fr' ? `Aucun résultat pour "${query}"` : `No results found for "${query}"`}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="py-2"
                >
                  {query && (
                    <div className="label-mono px-4 py-2.5 text-ink-3">
                      {language === 'fr' ? `${results.length} résultats` : `${results.length} results`}
                    </div>
                  )}
                  {results.slice(0, 8).map((result, i) => (
                    <motion.div
                      key={`${result.type}-${result.href}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                                          >
                      <Link
                        href={result.href}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3.5 transition-colors hover:bg-surface-2"
                      >
                        <div className="flex items-start gap-3">
                           <span
                             className={`label-mono mt-1 shrink-0 rounded border px-1.5 py-1 ${
                               result.type === 'page'
                                 ? 'border-line bg-surface-2 text-ink-3'
                                 : result.type === 'blog'
                                 ? 'border-signal-edge bg-signal-wash text-signal'
                                 : 'border-positive/30 bg-positive-wash text-positive'
                             }`}
                           >
                             {language === 'fr' ? (result.type === 'page' ? 'Page' : result.type === 'blog' ? 'Blog' : 'Projet') : result.type}
                           </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-ink">
                              {result.title}
                            </div>
                            {result.excerpt && (
                              <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-ink-2">
                                {result.excerpt}
                              </p>
                            )}
                            <div className="data-mono mt-1.5 truncate text-ink-3">
                              {result.href}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-3">
              <div className="data-mono text-ink-3">
                {query ? (language === 'fr' ? `${results.length} résultats trouvés` : `${results.length} results found`) : (language === 'fr' ? 'Toutes les pages' : 'All pages')}
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <span className="label-mono rounded border border-line bg-surface-2 px-2 py-1.5 text-ink-3">
                    {language === 'fr' ? 'Ctrl+K' : 'Ctrl+K'}
                  </span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <span className="label-mono rounded border border-line bg-surface-2 px-2 py-1.5 text-ink-3">
                    ESC
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
