"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { animate, createTimeline, stagger } from 'animejs'

/* ── Preloader ────────────────────────────────────────────────────────
   A single-shot curtain over the landing page. It borrows the hero's
   own materials — the flat steel ground and grain — so the reveal
   reads as the page assembling itself rather than a splash screen
   getting out of the way.

   Sequence: the name rolls up out of its own baseline, a hairline rail
   fills left to right, a mono counter runs 000→100, and the whole
   sheet lifts off the top edge with a lit seam trailing behind it.

   It is mounted from the root layout rather than from the page, on
   purpose: `ClientProviders` is loaded with `ssr: false`, so the page
   tree only exists after hydration. Rendered from the layout the
   curtain ships in the server HTML and paints on the first frame,
   covering exactly the gap it is there to cover.

   It runs on `/` only, on every load, never for readers who ask for
   reduced motion, and it will not lift before `window.load` — so the
   count is tracking something real, not just a timer. The run is
   deliberately unhurried: a curtain that is gone before you have
   focused on it is worse than no curtain. */

const NAME = ['Brighton', 'Matikiti'] as const

// What the counter is nominally doing. Keyed to the percentage it
// crosses, so the readout and the number never disagree.
const PHASES: [number, string][] = [
  [0, 'initialising'],
  [24, 'loading assets'],
  [52, 'resolving type'],
  [78, 'painting'],
  [99, 'ready'],
]

/* Both module-scoped, deliberately outside the component, and both
   reset by a full page load — which is exactly the scope we want. The
   curtain plays on every real load of `/` and is deliberately NOT
   remembered across refreshes: a session flag made it invisible after
   the first view, which is not what an intro is for.

   `sequenceStarted` — React StrictMode mounts effects twice in
   development against the *same* DOM nodes, and the sequence must be
   built exactly once, or the second pass restarts a timeline that is
   already mid-flight.

   `curtainDone` — once it has lifted, a client-side trip back to `/`
   must not raise it again. Checked at render, so the remount produces
   no markup at all. */
let sequenceStarted = false
let curtainDone = false

export default function Preloader() {
  // Landing page only. Read at render, not in an effect, so the curtain
  // is simply absent from the prerendered HTML of every other route
  // instead of flashing and then removing itself.
  const isHome = usePathname() === '/'

  // Always true on the first render so the server and client agree;
  // the session check below retracts it before paint if needed.
  const [mounted, setMounted] = useState(true)

  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const seamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isHome) return
    const root = rootRef.current
    if (!root) return
    const lines = Array.from(nameRef.current?.querySelectorAll('[data-line]') ?? [])

    // Taken out through the DOM rather than through state: setting
    // state synchronously in an effect body costs a second render pass
    // for a node that should simply never have been shown.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.hidden = true
      return
    }

    // Hold the page still underneath the curtain. Safe to re-apply on a
    // StrictMode remount, so it sits above the once-only guard.
    document.body.style.overflow = 'hidden'
    const unlock = () => {
      document.body.style.overflow = ''
    }

    // Second StrictMode pass: the sequence from the first pass is still
    // running against these same nodes. Leave it alone.
    if (sequenceStarted) return unlock
    sequenceStarted = true

    let phase = -1
    const setPhase = (pct: number) => {
      let next = 0
      for (let i = 0; i < PHASES.length; i++) if (pct >= PHASES[i][0]) next = i
      if (next === phase || !phaseRef.current) return
      phase = next
      const el = phaseRef.current
      el.textContent = PHASES[next][1]
      animate(el, { opacity: [0, 1], y: [6, 0], duration: 320, ease: 'outQuad' })
    }

    const progress = { value: 0 }
    const rail = railRef.current!

    const readout = () => {
      const pct = Math.round(progress.value)
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, '0')
      setPhase(pct)
    }

    const tl = createTimeline({
      defaults: { ease: 'outExpo' },
      autoplay: false,
    })

    tl
      // The name develops rather than assembles — each line resolves
      // out of blur as a whole. A script joins its glyphs, so it can
      // never be animated letter by letter without tearing them apart.
      .add(
        lines,
        {
          opacity: [0, 1],
          filter: ['blur(14px)', 'blur(0px)'],
          scale: [0.94, 1],
          duration: 1600,
          delay: stagger(320),
        },
        200,
      )
      // The rail measures the same thing the number does, so the two
      // move on one clock — and both stop short of full. The last
      // eight percent belong to `window.load`, not to a duration.
      .add(rail, { scaleX: [0, 0.92], duration: 3200, ease: 'inOutQuad' }, 420)
      .add(
        progress,
        { value: 92, duration: 3200, ease: 'inOutQuad', onUpdate: readout },
        420,
      )

    // The page is genuinely ready: close the last eight percent fast,
    // let it sit on 100 for a beat, then lift.
    const finish = () => {
      if (!root.isConnected) return unlock()
      const close = createTimeline({
        defaults: { ease: 'outExpo', duration: 480 },
        onComplete: () => window.setTimeout(exit, 240),
      })
      close
        .add(rail, { scaleX: 1 }, 0)
        .add(progress, { value: 100, onUpdate: readout }, 0)
    }

    const exit = () => {
      // The reader navigated away mid-sequence; nothing left to uncover.
      if (!root.isConnected) return unlock()
      const out = createTimeline({
        defaults: { ease: 'inOutQuint' },
        onComplete: () => {
          curtainDone = true
          unlock()
          setMounted(false)
        },
      })

      out
        .add(contentRef.current!, { opacity: [1, 0], y: [0, -30], duration: 480, ease: 'inQuad' }, 0)
        .add(seamRef.current!, { opacity: [0, 1], duration: 200, ease: 'linear' }, 180)
        // The sheet itself leaves upward; the lit seam is its bottom
        // edge, so the reveal has a visible leading line.
        .add(root, { y: ['0%', '-100%'], duration: 1050 }, 340)
    }

    // The run to 92 ends; the last stretch waits on the real page —
    // capped, so a stalled asset can never trap the reader.
    tl.then(() => {
      if (document.readyState === 'complete') return finish()
      let fired = false
      const go = () => {
        if (fired) return
        fired = true
        window.removeEventListener('load', go)
        finish()
      }
      window.addEventListener('load', go)
      window.setTimeout(go, 2000)
    })

    tl.play()

    return () => unlock()
  }, [isHome])

  if (!mounted || !isHome || curtainDone) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="bg-steel fixed inset-0 z-[300] isolate overflow-hidden"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div
        ref={contentRef}
        className="relative flex h-full w-full flex-col justify-between px-6 py-8 sm:px-10 sm:py-10"
      >
        <div className="data-mono mx-auto flex w-full max-w-6xl items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] text-white/35">
          <span className="flex items-center gap-2 text-signal-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-bright" />
            portfolio
          </span>
          <span>algiers, dz</span>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <h1
            ref={nameRef}
            className="pb-3 font-script text-[clamp(3.25rem,11vw,8rem)] font-normal leading-[0.92] text-white">
            {NAME.map((line, li) => (
              <span
                key={line}
                data-line
                className={`block origin-left will-change-transform ${
                  li === 1 ? 'pl-[0.6em] text-hollow-script' : ''
                }`}
                style={{ opacity: 0, filter: 'blur(14px)' }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-baseline justify-between gap-6">
            <span
              ref={phaseRef}
              className="data-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40"
            >
              initialising
            </span>
            <span
              ref={countRef}
              className="font-display text-3xl font-semibold tabular-nums tracking-tight text-white/80 sm:text-4xl"
            >
              000
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-white/10">
            <div
              ref={railRef}
              className="h-px w-full origin-left bg-signal-bright"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>

      {/* The leading edge of the wipe. */}
      <div
        ref={seamRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-signal-bright opacity-0"
      />
    </div>
  )
}
