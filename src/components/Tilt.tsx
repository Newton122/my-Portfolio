"use client"

import { useRef } from 'react'
import { animate } from 'animejs'

/* ------ Tilt ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   Wraps a block so it leans toward the pointer and lifts slightly off
   the page. Deliberately understated --- around six degrees. Past about
   ten it stops reading as a solid object catching the light and starts
   reading as a gimmick.

   `perspective` lives on the wrapper, not the child, so several tilted
   cards on one page each get their own vanishing point instead of
   sharing one and shearing at the edges. */

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Tilt({
  children,
  className = '',
  max = 6,
  lift = 1.02,
}: {
  children: React.ReactNode
  className?: string
  max?: number
  lift?: number
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)

  const track = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced() || !hostRef.current || !plateRef.current) return
    const r = hostRef.current.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5
    animate(plateRef.current, {
      rotateY: dx * max * 2,
      rotateX: -dy * max * 2,
      scale: lift,
      duration: 420,
      ease: 'outQuad',
    })
  }

  const reset = () => {
    if (reduced() || !plateRef.current) return
    animate(plateRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 780,
      ease: 'outQuart',
    })
  }

  return (
    <div
      ref={hostRef}
      onPointerMove={track}
      onPointerLeave={reset}
      style={{ perspective: '1100px' }}
      className={className}
    >
      <div
        ref={plateRef}
        className="h-full w-full will-change-transform [transform-style:preserve-3d]"
      >
        {children}
      </div>
    </div>
  )
}
