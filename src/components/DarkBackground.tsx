"use client"

import { motion } from 'framer-motion'

export default function DarkBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <style jsx>{`
         @keyframes twinkle {
           0%, 100% { opacity: 0.2; transform: scale(0.8); }
           50% { opacity: 0.7; transform: scale(1); }
         }
         @keyframes float-cloud {
           0% { transform: translateX(-5px) translateY(-3px) scale(1); opacity: 0.04; }
           50% { transform: translateX(25px) translateY(5px) scale(1.08); opacity: 0.07; }
           100% { transform: translateX(-5px) translateY(-3px) scale(1); opacity: 0.04; }
         }
         @keyframes move-shape {
           0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 0.15; }
           25% { transform: translateX(30px) translateY(-20px) rotate(90deg); opacity: 0.25; }
           50% { transform: translateX(15px) translateY(-40px) rotate(180deg); opacity: 0.2; }
           75% { transform: translateX(-10px) translateY(-15px) rotate(270deg); opacity: 0.25; }
           100% { transform: translateX(0) translateY(0) rotate(360deg); opacity: 0.15; }
         }

         .star {
           animation: twinkle 6s infinite ease-in-out;
         }
         .cloud {
           animation: float-cloud 30s infinite ease-in-out;
         }
         .shape {
           animation: move-shape 20s infinite ease-in-out;
         }
       `}</style>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="starGlowLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EAB308" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="starGlowDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EAB308" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cloudGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAB308" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#EAB308" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="cloudGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {Array.from({ length: 100 }).map((_, i) => {
          const x = (i * 1.137 + (i * 31) % 100) % 100
          const y = (i * 3.71 + (i * 17) % 100) % 100
          const size = 1 + (i % 3)
          const delay = (i * 0.083) % 6
          const duration = 4 + (i % 8)
          return (
            <g key={`star-light-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={size * 0.18}
                fill="url(#starGlowLight)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="star"
              />
            </g>
          )
        })}

        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 1.37 + (i * 37) % 100) % 100
          const y = (i * 7.1 + (i * 13) % 100) % 100
          const size = 1 + (i % 3)
          const delay = (i * 0.1) % 5
          const duration = 3 + (i % 6)
          return (
            <g key={`star-dark-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={size * 0.2}
                fill="url(#starGlowDark)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="star"
              />
            </g>
          )
        })}

        {Array.from({ length: 6 }).map((_, i) => {
          const delay = (i * -5) % 10
          const duration = 25 + (i % 3) * 5
          const cx = 15 + i * 18
          const cy = 20 + (i % 2 === 0 ? 10 : 30)
          return (
            <g key={`cloud-light-${i}`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={10 + i * 2}
                ry={3 + i}
                fill="url(#cloudGradLight)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="cloud"
              />
            </g>
          )
        })}

        {Array.from({ length: 5 }).map((_, i) => {
          const delay = (i * -6) % 12
          const duration = 28 + (i % 3) * 6
          const cx = 10 + i * 22
          const cy = 50 + (i % 2 === 0 ? 15 : 35)
          return (
            <g key={`cloud-dark-${i}`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={14 + i * 2}
                ry={4 + i}
                fill="url(#cloudGradDark)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="cloud"
              />
            </g>
          )
        })}

        {Array.from({ length: 8 }).map((_, i) => {
          const cx = 10 + (i * 14) % 95
          const cy = 10 + (i * 11) % 85
          const size = 2 + (i % 3)
          const delay = (i * 0.5) % 8
          const duration = 15 + (i % 5) * 3
          return (
            <g key={`shape-${i}`}>
              <polygon
                points={`${cx},${cy - size} ${cx + size},${cy + size} ${cx - size},${cy + size}`}
                fill="url(#starGlowLight)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="shape"
              />
            </g>
          )
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const cx = 5 + (i * 8) % 95
          const cy = 60 + (i * 7) % 35
          const size = 1 + (i % 2)
          const delay = (i * 0.4) % 6
          const duration = 12 + (i % 4) * 2
          return (
            <g key={`circle-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={size * 0.3}
                fill="url(#starGlowLight)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="shape"
              />
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}
