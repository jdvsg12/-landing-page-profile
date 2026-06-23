'use client'

import { Code2, Globe, Heart } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import { useI18n } from '@/lib/i18n'

const stack = ['React', 'Next.js', 'TypeScript', 'NestJS', 'PostgreSQL']

export function About() {
  const { t } = useI18n()

  return (
    <section id="about" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="01" label={t.about.label} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {t.about.titlePre}{' '}
                <span className="text-gradient">{t.about.titleHighlight}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                {t.about.p1}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {t.about.p2}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-primary">
                <Globe className="size-4" />
                <span>{t.about.freelance}</span>
                <span className="text-cyan">·</span>
                <span>{t.about.remote}</span>
                <span className="text-cyan">·</span>
                <span>{t.about.fulltime}</span>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            <RevealGroup className="grid grid-cols-2 gap-4">
              {t.about.stats.map((s, i) => (
                <RevealItem
                  key={s.label}
                  className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50"
                >
                  {i === 3 ? (
                    <Heart className="size-7 text-cyan transition-transform group-hover:scale-110" />
                  ) : (
                    <p className="font-heading text-3xl font-bold text-gradient">
                      {s.value}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary">
                  <Code2 className="size-3.5" />
                  {t.about.stackLabel}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs text-foreground/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
