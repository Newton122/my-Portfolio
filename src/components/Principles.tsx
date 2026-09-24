"use client"

import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { animate } from 'animejs'

/* ------ Principles ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
   The four habits, collapsed to their headings. Opening one is a real
   height animation rather than a class toggle, so the list below is
   pushed down instead of jumping --- and the panel tips up out of the
   fold on its own axis, which is what makes it read as unfolding
   rather than merely appearing.

   One open at a time. Four expanded panels is the wall of text the
   collapse was there to avoid. */

export type Principle = { key: string; title: string; body: string }

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Principles({
  items,
  readMore,
}: {
  items: Principle[]
  readMore: string
}) {
  const [open, setOpen] = useState<string | null>(null)
  const panels = useRef<Record<string, HTMLElement | null>>({})

  const collapse = (key: string) => {
    const el = panels.current[key]
    if (!el) return
    if (reduced()) {
      el.style.height = '0px'
      return
    }
    animate(el, {
      height: [el.scrollHeight, 0],
      opacity: [1, 0],
      duration: 380,
      ease: 'inOutQuad',
    })
    animate(el.firstElementChild as HTMLElement, {
      rotateX: [0, -6],
      y: [0, -8],
      duration: 380,
      ease: 'inQuad',
    })
  }

  const expand = (key: string) => {
    const el = panels.current[key]
    if (!el) return
    const inner = el.firstElementChild as HTMLElement
    if (reduced()) {
      el.style.height = 'auto'
      el.style.opacity = '1'
      return
    }
    animate(el, {
      height: [0, el.scrollHeight],
      opacity: [0, 1],
      duration: 520,
      ease: 'outExpo',
      // Released to auto so a resize or a font swap cannot leave the
      // panel clipped at a height measured for a different layout.
      onComplete: () => {
        el.style.height = 'auto'
      },
    })
    animate(inner, {
      rotateX: [-14, 0],
      y: [-14, 0],
      opacity: [0, 1],
      duration: 640,
      ease: 'outExpo',
    })
  }

  const toggle = (key: string) => {
    if (open === key) {
      collapse(key)
      setOpen(null)
      return
    }
    if (open) collapse(open)
    setOpen(key)
    // Next frame: the panel must be measurable before it is animated.
    requestAnimationFrame(() => expand(key))
  }

  return (
    <dl className="border-t border-line">
      {items.map((p) => {
        const isOpen = open === p.key
        return (
          <div
            key={p.key}
            className={`group relative border-b border-line transition-colors duration-300 ${
              isOpen ? 'bg-surface-2/40' : 'hover:bg-surface-2/20'
            }`}
          >
            {/* The open item gets a lit rule down its left edge --- the
                only colour in the list, so the eye never loses which
                one is expanded. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-full w-px origin-top bg-signal transition-transform duration-500 ${
                isOpen ? 'scale-y-100' : 'scale-y-0'
              }`}
            />

            <dt>
              <button
                type="button"
                onClick={() => toggle(p.key)}
                aria-expanded={isOpen}
                aria-controls={`principle-${p.key}`}
                className="flex w-full items-start gap-5 px-4 py-7 text-left sm:gap-8 sm:px-6"
              >
                <span
                  className={`label-mono w-[7.5rem] shrink-0 pt-1.5 transition-colors duration-300 ${
                    isOpen ? 'text-signal' : 'text-ink-3 group-hover:text-signal'
                  }`}
                >
                  {p.key}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-h2 leading-snug text-ink">{p.title}</span>
                  <span
                    className={`data-mono mt-2 block uppercase tracking-[0.14em] transition-all duration-300 ${
                      isOpen ? 'max-h-0 opacity-0' : 'max-h-6 text-ink-3 opacity-100'
                    }`}
                  >
                    {readMore}
                  </span>
                </span>

                <span
                  className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                    isOpen
                      ? 'rotate-[135deg] border-signal bg-signal-wash text-signal'
                      : 'border-line-strong text-ink-3 group-hover:border-signal group-hover:text-signal'
                  }`}
                >
                  <Plus size={15} />
                </span>
              </button>
            </dt>

            <dd
              id={`principle-${p.key}`}
              ref={(el) => {
                panels.current[p.key] = el
              }}
              style={{ height: 0, opacity: 0 }}
              className="overflow-hidden [perspective:800px]"
            >
              <div className="origin-top pb-8 pl-4 pr-4 sm:pl-[10.5rem] sm:pr-16">
                <p className="max-w-prose text-lead leading-relaxed text-ink-2">{p.body}</p>
              </div>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
