'use client'

import { Code2, Globe, Heart } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'

const stats = [
  { value: '4+', label: 'Years of experience' },
  { value: '10+', label: 'Projects delivered' },
  { value: '100%', label: 'Remote ready' },
  { value: 'Code', label: 'Passion for code', icon: Heart },
]

const stack = ['React', 'Next.js', 'TypeScript', 'NestJS', 'PostgreSQL']

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="01" label="ABOUT" />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Crafting digital{' '}
                <span className="text-gradient">experiences</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                4 years building end-to-end web products that combine clean
                architecture with measurable performance. Based in Colombia,
                working remotely with clients worldwide.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Specialized in React, Next.js, and TypeScript ecosystems. My
                focus is on performance optimization, clean scalable
                architecture, and conversion-driven interfaces that deliver real
                business results.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm text-primary">
                <Globe className="size-4" />
                <span>Open to freelance</span>
                <span className="text-cyan">·</span>
                <span>Remote</span>
                <span className="text-cyan">·</span>
                <span>Full-time</span>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            <RevealGroup className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <RevealItem
                  key={s.label}
                  className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50"
                >
                  {s.icon ? (
                    <s.icon className="size-7 text-cyan transition-transform group-hover:scale-110" />
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
                  // STACK
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
