"use client"

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function ThemeToggle({ onHero = false }: { onHero?: boolean }) {
  // Start undefined so the first render matches the server, then sync
  // from the class the pre-paint script in layout.tsx already set.
  const [dark, setDark] = useState<boolean | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-200 ${
        onHero
          ? 'border-white/15 text-white/70 hover:border-signal-solid/60 hover:text-white'
          : 'border-line text-ink-2 hover:border-signal-edge hover:text-signal'
      }`}
      aria-label={language === 'fr' ? 'Basculer le thème' : 'Toggle theme'}
      aria-pressed={dark ?? false}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
