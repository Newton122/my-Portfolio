"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Tag, Eyebrow, PageShell, PageHeader } from '@/components/ui'
import { BLOG_POSTS } from '@/lib/blog'
import { useLanguage } from '@/context/LanguageContext'

export default function BlogPage() {
  const { t, language } = useLanguage()
  const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))]
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === active)

  const lead =
    language === 'fr'
      ? "Notes sur ce que j'apprends, concepts d'ingénierie que je trouve intéressants, et réflexions honnêtes sur la construction de logiciels en tant qu'étudiant."
      : "Notes on what I'm learning, engineering concepts I find interesting, and honest reflections from building software as a student."

  return (
    <PageShell width="reading" header={<PageHeader eyebrow={language === 'fr' ? 'Écrits' : 'Writing'} title={t.blog.title} lead={lead} />}>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={`data-mono rounded-md border px-3 py-1.5 transition-colors duration-200 ${
                isActive
                  ? 'border-signal-solid bg-signal-solid text-signal-on'
                  : 'border-line text-ink-2 hover:border-signal-edge hover:text-signal'
              }`}
            >
              {cat === 'All' ? (language === 'fr' ? 'Tout' : 'All') : cat}
            </button>
          )
        })}
        <span className="data-mono ml-auto text-ink-3">
          {filtered.length} {language === 'fr' ? 'articles' : filtered.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      <div className="divide-y divide-line border-y border-line">
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="flex flex-col gap-4 py-7 sm:flex-row sm:justify-between">
              {post.image && (
                <div className="relative order-2 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md border border-line bg-surface-2 sm:order-none sm:w-44">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Eyebrow>{post.category}</Eyebrow>
                  <span className="data-mono text-ink-3">
                    · {post.readTime} · {post.date}
                  </span>
                </div>
                <h2 className="text-h3 leading-snug transition-colors group-hover:text-signal">{post.title}</h2>
                <p className="mt-2 max-w-prose text-base leading-relaxed text-ink-2">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>
              <ArrowUpRight
                size={17}
                className="shrink-0 text-ink-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
              />
            </Link>
          </motion.article>
        ))}
      </div>
    </PageShell>
  )
}
