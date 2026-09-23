"use client"

import { useEffect, useRef, useState } from 'react'

/**
 * A signal ring that trails a small dot. Deliberately minimal — the
 * cursor is furniture, not an effect.
 *
 * Position is written straight to the DOM inside one rAF loop rather
 * than through React state, so moving the mouse doesn't re-render the
 * page. It disables itself for touch input and for anyone who has
 * asked for reduced motion, and globals.css keeps the native caret
 * over inputs so forms still feel like forms.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    setEnabled(true)
    document.body.classList.add('custom-cursor')

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
      const el = e.target as HTMLElement | null
      const interactive = !!el?.closest?.('a, button, [role="button"], input, textarea, select')
      ringRef.current?.classList.toggle('is-active', interactive)
    }
    const onLeave = () => ringRef.current?.style.setProperty('opacity', '0')
    const onEnter = () => ringRef.current?.style.setProperty('opacity', '1')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    let frame = 0
    const tick = () => {
      // Dot is exact; ring eases toward it for a little weight.
      ring.current.x += (target.current.x - ring.current.x) * 0.18
      ring.current.y += (target.current.y - ring.current.y) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove('custom-cursor')
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-solid will-change-transform"
        style={{ marginLeft: '-3px', marginTop: '-3px' }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-7 w-7 rounded-full border border-signal-solid/50 will-change-transform"
        style={{ marginLeft: '-14px', marginTop: '-14px', transition: 'width .2s, height .2s, margin .2s, opacity .2s, background-color .2s' }}
      />
    </>
  )
}
