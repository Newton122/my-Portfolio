"use client"

import { useEffect, useRef } from 'react'

/* The dot field's palette. The steel bands are dark in both themes,
   so these are constants rather than theme-reactive --- there is no
   light-mode variant of the ground they sit on. */
const OPTIONS = {
  mouseControls: true,
  touchControls: false,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  scale: 1,
  scaleMobile: 1,
  color: 0x3ee0d0, // --signal-bright
  color2: 0x2b7abe, // the cold blue already in the steel gradients
  backgroundAlpha: 0, // transparent: .bg-steel stays the ground
  size: 2.2,
  spacing: 32,
  // The lines option draws a rotating wireframe sphere over the field.
  // Off by default --- the dots alone are the quieter, less templated read.
  showLines: false,
}

/**
 * Vanta DOTS --- a receding grid of points with a slow wave running
 * through it, replacing the drifting gradient pools that used to light
 * these bands.
 *
 * Fills its nearest positioned ancestor, so it goes inside a
 * `bg-steel --¦ relative isolate overflow-hidden` band and paints behind
 * everything declared after it.
 *
 * three.js and vanta are both imported lazily and only once the gates
 * below pass, so neither reaches the bundle of a visitor who will
 * never see the effect. Vanta's dist reads `window.THREE` when it is
 * evaluated rather than from its own options, so the assignment has to
 * happen before that import --- hence the two awaits in order.
 */
export default function DotsField({ className = '' }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip for anyone who asked for less motion, and on narrow screens,
    // where a second WebGL context costs more than the effect returns.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 768) return

    let cancelled = false
    let effect: { destroy(): void } | null = null

    ;(async () => {
      const THREE = await import('three')
      ;(window as unknown as { THREE: unknown }).THREE = THREE
      const { default: DOTS } = await import('vanta/dist/vanta.dots.min')
      if (cancelled || !holder.current) return
      effect = DOTS({ el: holder.current, THREE, ...OPTIONS })
    })()

    return () => {
      cancelled = true
      effect?.destroy()
    }
  }, [])

  return (
    <div
      ref={holder}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  )
}
