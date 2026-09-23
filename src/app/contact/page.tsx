"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Github, Linkedin, MessageCircle, Check } from 'lucide-react'
import { PageShell, PageHeader, Eyebrow } from '@/components/ui'
import { useLanguage } from '@/context/LanguageContext'

const GITHUB_URL = 'https://github.com/Newton122'
const LINKEDIN_URL = 'https://www.linkedin.com/in/brighton-matikiti-1a48b2365'
const EMAIL = 'matikitibrighton6@gmail.com'
const WHATSAPP_URL = 'https://wa.me/213791938758'

const labelClass = 'label-mono mb-2 block text-ink-3'
const fieldClass = 'field px-3.5 py-2.5 text-base'

export default function ContactPage() {
  const { t, language } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.subject ? `Subject: ${form.subject}\n\n${form.message}` : form.message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <PageShell width="reading" header={<PageHeader
        eyebrow="Contact"
        tone="amber"
        title={t.contact.title}
        lead={t.contact.subtitle}
      />}>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel border-positive/30 bg-positive-wash p-8 text-center"
              >
                <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-positive text-white">
                  <Check size={18} />
                </span>
                <h2 className="text-h3">{t.contact.form.sent}</h2>
                <p className="mt-2 text-base text-ink-2">{t.contact.form.sentMsg}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handle}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      {t.contact.form.name}
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={fieldClass}
                      placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      {t.contact.form.email}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={fieldClass}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    {t.contact.form.subject}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={fieldClass}
                    placeholder={t.contact.form.internship}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder={t.contact.form.placeholder}
                  />
                </div>

                {status === 'error' && (
                  <p role="alert" className="text-sm text-negative">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-signal group flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:opacity-60"
                >
                  {status === 'sending' ? t.contact.form.sending : t.contact.form.send}
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-8">
          <div>
            <Eyebrow className="mb-4">{t.contact.contactDetails}</Eyebrow>
            <div className="flex flex-col gap-3">
              {[
                { icon: Mail, label: EMAIL, href: `mailto:${EMAIL}` },
                { icon: MessageCircle, label: '+213 791 938 758', href: WHATSAPP_URL },
                { icon: MapPin, label: t.contact.location, href: null },
              ].map(({ icon: Icon, label, href }) => {
                const inner = (
                  <>
                    <Icon size={15} className="shrink-0 text-ink-3" />
                    <span className="data-mono truncate">{label}</span>
                  </>
                )
                return href ? (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-2.5 text-ink-2 transition-colors hover:text-signal"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={label} className="flex items-center gap-2.5 text-ink-2">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Eyebrow className="mb-4">{t.contact.social}</Eyebrow>
            <div className="flex flex-col gap-3">
              {[
                { href: GITHUB_URL, Icon: Github, label: 'GitHub' },
                { href: LINKEDIN_URL, Icon: Linkedin, label: 'LinkedIn' },
                { href: WHATSAPP_URL, Icon: MessageCircle, label: 'WhatsApp' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-ink-2 transition-colors hover:text-signal"
                >
                  <Icon size={15} className="shrink-0 text-ink-3" />
                  <span className="data-mono">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-positive" />
              <span className="label-mono text-positive">
                {language === 'fr' ? 'Disponible pour des stages' : 'Available for internships'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {language === 'fr'
                ? 'Stages en data, IA et développement full-stack.'
                : 'Internships in data, AI and full-stack development.'}
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
