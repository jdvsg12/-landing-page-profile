'use client'

import { motion } from 'motion/react'
import { useI18n, type Lang } from '@/lib/i18n'

const options: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()

  return (
    <div
      className={`relative flex items-center rounded-full border border-border bg-card/60 p-0.5 font-mono text-xs backdrop-blur-sm ${className}`}
      role="radiogroup"
      aria-label="Language switcher"
    >
      {options.map((o) => {
        const active = lang === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(o.value)}
            className={`relative z-10 rounded-full px-2.5 py-1 transition-colors ${
              active
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan via-blue to-violet"
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
