"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, MessageCircle, RotateCcw, Trash2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Source = { title: string; url: string };
type Message = {
  role: "user" | "ai";
  content: string;
  sources?: Source[];
  error?: boolean;
};

/** Fire this from anywhere to open the chat, optionally with a question. */
export const OPEN_CHAT_EVENT = "open-portfolio-chat";
export function openPortfolioChat(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { question } }));
}

const STORAGE_KEY = "portfolio-chat-v1";

const COPY = {
  en: {
    launcher: "Ask my AI",
    title: "Brighton's assistant",
    status: "Answers from this site",
    hello: "Hi! I can tell you about Brighton's projects, skills, studies and how to reach him.",
    placeholder: "Ask a question…",
    hint: "Enter to send · Shift+Enter for a new line",
    retry: "Try again",
    clear: "Clear chat",
    close: "Close chat",
    seeMore: "See",
    starters: [
      "What has he built?",
      "What's his tech stack?",
      "Is he open to internships?",
      "How can I contact him?",
    ],
    failed: "Sorry, I couldn't answer that. Please try again.",
  },
  fr: {
    launcher: "Demandez à mon IA",
    title: "L'assistant de Brighton",
    status: "Répond à partir de ce site",
    hello: "Bonjour ! Je peux vous parler des projets, compétences et études de Brighton, et comment le contacter.",
    placeholder: "Posez une question…",
    hint: "Entrée pour envoyer · Maj+Entrée pour une ligne",
    retry: "Réessayer",
    clear: "Effacer",
    close: "Fermer",
    seeMore: "Voir",
    starters: [
      "Qu'a-t-il construit ?",
      "Quelles technologies utilise-t-il ?",
      "Cherche-t-il un stage ?",
      "Comment le contacter ?",
    ],
    failed: "Désolé, je n'ai pas pu répondre. Veuillez réessayer.",
  },
};

const STARTER_TONES = [
  "border-hue-violet/30 text-hue-violet hover:bg-hue-violet/[0.08]",
  "border-hue-blue/30 text-hue-blue hover:bg-hue-blue/[0.08]",
  "border-hue-green/30 text-hue-green hover:bg-hue-green/[0.08]",
  "border-hue-amber/30 text-hue-amber hover:bg-hue-amber/[0.08]",
];

const PAGE_NAMES: Record<string, string> = {
  "/about": "About",
  "/projects": "Projects",
  "/skills": "Skills",
  "/experience": "Experience",
  "/education": "Education",
  "/testimonials": "Certificates",
  "/now": "Now",
  "/blog": "Blog",
  "/contact": "Contact",
};

/* ── Tiny formatter: **bold**, "- " bullets, links, emails, /pages ── */

const INLINE = /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|(?<![\w/])\/(?:about|projects|skills|experience|education|testimonials|now|blog|contact)\b)/g;
const LINK = "font-medium text-signal underline decoration-signal/30 underline-offset-2 hover:decoration-signal";

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (md) {
      const [, label, href] = md;
      return href.startsWith("/") ? (
        <Link key={i} href={href} className={LINK}>{label}</Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={LINK}>{label}</a>
      );
    }
    if (part.startsWith("**")) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    if (part.startsWith("http")) {
      const clean = part.replace(/[.,]$/, "");
      return (
        <Fragment key={i}>
          <a href={clean} target="_blank" rel="noopener noreferrer" className={`${LINK} break-all`}>
            {clean.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    if (part.includes("@")) {
      const clean = part.replace(/\.$/, "");
      return (
        <Fragment key={i}>
          <a href={`mailto:${clean}`} className={`${LINK} break-all`}>{clean}</a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    if (part.startsWith("/")) return <Link key={i} href={part} className={LINK}>{part}</Link>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Formatted({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={blocks.length} className="space-y-1 pl-1">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-signal-solid" aria-hidden />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 overflow-hidden rounded-full border border-line-strong bg-surface-2"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/half.png" alt="" className="h-full w-full scale-[1.9] object-cover object-[50%_12%]" style={{ transformOrigin: "50% 8%" }} />
    </span>
  );
}

export default function PortfolioChat() {
  const { language } = useLanguage();
  const t = language === "fr" ? COPY.fr : COPY.en;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Keep the conversation while the visitor moves between pages.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Auto-grow the textarea up to ~5 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input]);

  const send = useCallback(
    async (text: string, previous: Message[] = messagesRef.current) => {
      const question = text.trim();
      if (!question || loading) return;

      const history = previous.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
      setMessages([...previous, { role: "user", content: question }]);
      setInput("");
      setLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question, history }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || t.failed);

        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.reply || t.failed, sources: data.sources ?? [] },
        ]);
      } catch (error) {
        console.warn("Chat request failed:", error);
        setMessages((prev) => [
          ...prev,
          { role: "ai", error: true, content: error instanceof Error ? error.message : t.failed },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, t.failed],
  );

  // Other parts of the site can open the chat (and ask something) via openPortfolioChat().
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (q) send(q);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [send]);

  function retry() {
    const lastUser = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUser === -1) return;
    const idx = messages.length - 1 - lastUser;
    send(messages[idx].content, messages.slice(0, idx));
  }

  return (
    <>
      {/* ── Launcher ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-label={t.launcher}
            className="btn-signal group fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 !rounded-full py-1.5 pl-1.5 pr-1.5 shadow-lg sm:bottom-6 sm:right-6 sm:pr-5"
          >
            <span className="relative">
              <Avatar size={38} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-signal-solid bg-glow-green" />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{t.launcher}</span>
            <MessageCircle size={18} className="mr-1.5 sm:hidden" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={t.title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-3 top-20 z-[60] flex flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-lg sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(620px,calc(100vh-7rem))] sm:w-[400px]"
          >
            {/* Spectrum strip — the site's five hues. */}
            <div className="flex h-1 shrink-0" aria-hidden>
              <span className="flex-1 bg-hue-violet" />
              <span className="flex-1 bg-hue-blue" />
              <span className="flex-1 bg-hue-teal" />
              <span className="flex-1 bg-hue-green" />
              <span className="flex-1 bg-hue-amber" />
            </div>

            {/* Header */}
            <header className="flex shrink-0 items-center gap-3 border-b border-line px-4 py-3.5">
              <span className="relative">
                <Avatar size={40} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-signal-solid" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[0.95rem] font-semibold leading-tight text-ink">{t.title}</p>
                <p className="label-mono mt-1.5 text-signal">{t.status}</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  aria-label={t.clear}
                  title={t.clear}
                  className="rounded-md p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="rounded-md p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={18} />
              </button>
            </header>

            {/* Conversation */}
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto overscroll-contain bg-canvas/60 px-4 py-5" aria-live="polite">
              {/* Greeting */}
              <div className="flex gap-2.5">
                <Avatar size={28} />
                <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-2 shadow-sm">
                  {t.hello}
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-[38px]">
                  {t.starters.map((q, i) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      className={`rounded-full border bg-surface px-3 py-1.5 text-sm font-medium transition-colors ${STARTER_TONES[i % STARTER_TONES.length]}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-signal-solid px-3.5 py-2.5 text-sm font-medium text-signal-on shadow-sm">
                      {m.content}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                    <Avatar size={28} />
                    <div className="min-w-0 max-w-[85%]">
                      <div
                        className={`rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-sm shadow-sm ${
                          m.error ? "border-negative/40 bg-surface text-negative" : "border-line bg-surface text-ink-2"
                        }`}
                      >
                        <Formatted text={m.content} />
                      </div>
                      {!m.error && <SourceLinks sources={m.sources} label={t.seeMore} />}
                      {m.error && i === messages.length - 1 && (
                        <button
                          type="button"
                          onClick={retry}
                          className="label-mono mt-2 inline-flex items-center gap-1.5 text-ink-3 transition-colors hover:text-signal"
                        >
                          <RotateCcw size={12} /> {t.retry}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ),
              )}

              {loading && (
                <div className="flex gap-2.5">
                  <Avatar size={28} />
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3.5 shadow-sm">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-signal-solid"
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="shrink-0 border-t border-line bg-surface px-3 pb-3 pt-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-line-strong bg-canvas px-3 py-2 transition-colors focus-within:border-signal-solid">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={1000}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  className="max-h-[132px] flex-1 resize-none bg-transparent py-1 text-sm text-ink placeholder:text-ink-3 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                  className="btn-signal flex h-8 w-8 shrink-0 items-center justify-center !rounded-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <ArrowUp size={16} strokeWidth={2.4} />
                </button>
              </div>
              <p className="mt-2 hidden text-center text-micro text-ink-3 sm:block">{t.hint}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function SourceLinks({ sources, label }: { sources?: Source[]; label: string }) {
  const urls = [...new Set((sources ?? []).map((s) => s.url))].filter((u) => PAGE_NAMES[u]).slice(0, 2);
  if (!urls.length) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="label-mono text-ink-3">{label}</span>
      {urls.map((url) => (
        <Link
          key={url}
          href={url}
          className="data-mono inline-flex items-center gap-0.5 rounded-md border border-line bg-surface px-2 py-0.5 text-ink-2 transition-colors hover:border-signal-edge hover:text-signal"
        >
          {PAGE_NAMES[url]} <ArrowUpRight size={11} />
        </Link>
      ))}
    </div>
  );
}
