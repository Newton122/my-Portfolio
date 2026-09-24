"use client"

import { useRef } from 'react'
import { animate, stagger } from 'animejs'

/* ------ HeroName ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   The name, set in the signature face and treated as an object rather
   than as text: it sits on a plate that tips toward the pointer, and
   swells when you touch it.

   Both lines are animated whole, never letter by letter. A script face
   joins its glyphs, and transforming them individually tears those
   joins apart --- the one thing you must not do to cursive. */

const LINES = ['Brighton', 'Matikiti'] as const

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function HeroName() {
  const hostRef = useRef<HTMLHeadingElement>(null)
  const plateRef = useRef<HTMLSpanElement>(null)

  const lines = () =>
    Array.from(hostRef.current?.querySelectorAll<HTMLElement>('[data-line]') ?? [])

  const enter = () => {
    if (reduced()) return
    animate(lines(), {
      scale: 1.11,
      duration: 620,
      ease: 'outElastic(1, 0.72)',
      delay: stagger(70),
    })
  }

  const leave = () => {
    if (reduced()) return
    animate(lines(), { scale: 1, duration: 700, ease: 'outQuart', delay: stagger(50) })
    animate(plateRef.current!, {
      rotateX: 0,
      rotateY: 0,
      duration: 900,
      ease: 'outQuart',
    })
  }

  // The plate tips away from the cursor, so the type reads as a solid
  // object catching the light rather than a picture of one.
  const track = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced() || !hostRef.current || !plateRef.current) return
    const r = hostRef.current.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5
    animate(plateRef.current, {
      rotateY: dx * 18,
      rotateX: -dy * 15,
      duration: 480,
      ease: 'outQuad',
    })
  }

  return (
    <h1
      ref={hostRef}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerMove={track}
      style={{ perspective: '1000px' }}
      className="mt-4 cursor-default select-none pb-3 lg:mt-5"
    >
      <span
        ref={plateRef}
        className="block will-change-transform [transform-style:preserve-3d]"
      >
        {LINES.map((line, i) => (
          <span
            key={line}
            data-line
            className={`block origin-left font-script text-[clamp(3.5rem,12vw,8.5rem)] font-normal leading-[0.92] will-change-transform ${
              i === 0 ? 'text-white' : 'pl-[0.6em] text-hollow-script'
            }`}
          >
            {line}
          </span>
        ))}
      </span>
    </h1>
  )
}
