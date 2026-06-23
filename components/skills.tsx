'use client'

import { Cloud, Server, Wrench, Zap } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'

const groups = [
  {
    icon: Zap,
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'ShadCN'],
  },
  {
    icon: Server,
    title: 'Backend',
    skills: ['NestJS', 'Node.js', 'PostgreSQL', 'REST APIs', 'TypeORM'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    skills: ['GCP', 'Azure', 'Docker', 'GitHub Actions CI/CD'],
  },
  {
    icon: Wrench,
    title: 'Tools',
    skills: ['Git', 'Webpack', 'Supabase', 'Headless CMS'],
  },
]

export function Skills() {
  return (
    <section id="skills" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="03" label="SKILLS" />

        <Reveal>
          <h2 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Tech <span className="text-gradient">stack</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted-foreground">
            Tools and technologies I use to build modern, scalable web
            applications.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <RevealItem
              key={g.title}
              className="group rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-border bg-secondary/50 text-cyan transition-transform group-hover:scale-110">
                  <g.icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {g.title}
                </h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 font-mono text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mt-4 rounded-2xl border border-border bg-gradient-to-r from-card/60 to-card/30 p-6">
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-primary">
              // PROFICIENCY
            </div>
            <p className="mt-2 font-mono text-sm text-foreground/80">
              React / Next.js
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
