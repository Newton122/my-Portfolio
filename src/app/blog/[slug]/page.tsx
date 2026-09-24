import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Tag } from '@/components/ui'
import { BLOG_POSTS } from '@/lib/blog'
import DotsField from '@/components/DotsField'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  return { title: post ? post.title : 'Blog' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return notFound()

  const paragraphs = post.body.split('\n\n')

  return (
    <div className="bg-canvas pb-24">
      {/* The post opens on the same steel band as every other route, so
          the floating navbar always has something dark behind it. */}
      <div className="bg-steel relative isolate overflow-hidden">
        <DotsField />
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-2xl px-6 pb-14 pt-32 sm:pb-16 sm:pt-36">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-signal-bright"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to blog
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="label-mono text-signal-bright">{post.category}</span>
            <span className="data-mono text-white/40">
              · {post.readTime} · {post.date}
            </span>
          </div>
          <h1 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
            {post.title}
          </h1>
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-6 pt-14 sm:pt-16">
        {post.image && (
          <figure className="mb-12 overflow-hidden rounded-lg border border-line bg-surface-2">
            <div className="relative aspect-[16/10]">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                sizes="(min-width: 672px) 624px, calc(100vw - 3rem)"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-line px-4 py-3 text-sm text-ink-3">
              Representing OpenMinds at a job summit
            </figcaption>
          </figure>
        )}

        {/* Body copy at 17px - this is the one place on the site
            people actually read at length. */}
        <div className="mt-10 space-y-6">
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return (
                <h2 key={i} className="pt-6 text-h2">
                  {para.replace(/\*\*/g, '')}
                </h2>
              )
            }
            const parts = para.split(/(\*\*[^*]+\*\*)/g)
            return (
              <p key={i} className="text-lead leading-[1.75] text-ink-2">
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={j} className="font-semibold text-ink">
                      {part.replace(/\*\*/g, '')}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            )
          })}
        </div>

        <footer className="mt-14 border-t border-line pt-8">
          <div className="mb-8 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-signal"
          >
            <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            More articles
          </Link>
        </footer>
      </article>
    </div>
  )
}
