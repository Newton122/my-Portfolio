"use client"

import { ArrowUpRight, Sparkles } from 'lucide-react'
import { openPortfolioChat } from '@/components/PortfolioChat'
import { useLanguage } from '@/context/LanguageContext'

const QUESTIONS = {
  en: ['What is he learning now?', 'Is he open to internships?'],
  fr: ["Qu'apprend-il en ce moment ?", 'Cherche-t-il un stage ?'],
}

/** Sits on the dark Stack band and hands a question to the chat widget.
 *  Not a card: it is the last row of the stack list, so it hangs off the
 *  same rule that divides the groups above it. */
export default function ChatTeaser() {
  const { language } = useLanguage()
  const fr = language === 'fr'

  return (
    <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="label-mono flex items-center gap-2 text-white/45">
          <Sparkles size={13} /> {fr ? 'Assistant IA' : 'AI assistant'}
        </p>
        <p className="mt-3 font-display text-h3 font-semibold text-white">
          {fr ? 'Une question ? Demandez à mon assistant.' : 'Got a question? Ask my assistant.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:max-w-[22rem] sm:justify-end">
        {QUESTIONS[fr ? 'fr' : 'en'].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => openPortfolioChat(q)}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-glow-teal/60 hover:text-glow-teal"
          >
            {q} <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
    </div>
  )
}
