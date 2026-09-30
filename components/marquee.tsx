'use client'

import { useI18n } from '@/lib/i18n'

export function Marquee() {
  const { t } = useI18n()
  const words = t.skills.groups.flatMap((group) => group.skills)
  const loop = [...words, ...words]

  return (
    <div className="overflow-hidden border-y border-border py-4" aria-hidden="true">
      <div className="animate-marquee flex w-max items-center gap-8">
        {loop.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8">
            <span className="font-heading text-sm font-semibold tracking-[0.28em] text-foreground/80">
              {word.toUpperCase()}
            </span>
            <span className="size-1.5 rounded-full bg-cyan" />
          </span>
        ))}
      </div>
    </div>
  )
}
