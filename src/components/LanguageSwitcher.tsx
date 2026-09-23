"use client"

import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher({ onHero = false }: { onHero?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className={`label-mono flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-200 ${
        onHero
          ? 'border-white/15 text-white/70 hover:border-signal-solid/60 hover:text-white'
          : 'border-line text-ink-2 hover:border-signal-edge hover:text-signal'
      }`}
      aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      {language === 'en' ? 'EN' : 'FR'}
    </button>
  )
}
