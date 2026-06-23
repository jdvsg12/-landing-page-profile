'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'

const projects = [
  {
    tag: 'Next.js',
    title: 'Eduardo Montenegro',
    subtitle: 'Professional Website · Next.js',
    description:
      'Landing page for a psychologist / psychoanalyst. Clean, minimalist design with multilingual support, contact forms and WhatsApp integration.',
    domain: 'eduardomontenegro.com',
    href: 'https://eduardomontenegro.com',
  },
  {
    tag: 'SaaS',
    title: 'ALUVE Windows App',
    subtitle: 'Web Application · Next.js · TypeScript',
    description:
      'SaaS tool for aluminum window manufacturers. Features: project management, window dimension calculator, cut optimization and professional PDF quote generation.',
    domain: 'windows-app-lx87.vercel.app',
    href: 'https://windows-app-lx87.vercel.app',
  },
  {
    tag: 'E-commerce',
    title: 'Bretaña Colombia',
    subtitle: 'E-commerce Fix & Optimization · Next.js',
    description:
      'Performance and bug fixing on a Colombian retail e-commerce platform. Core Web Vitals optimization and load-time improvements.',
    domain: 'bretana.com.co',
    href: 'https://bretana.com.co',
  },
]

export function Projects() {
  return (
    <section id="projects" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="02" label="PROJECTS" />

        <Reveal>
          <h2 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Selected <span className="text-gradient">work</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted-foreground">
            Real projects, real impact. Each one built with performance and user
            experience at the core.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <RevealItem key={p.title}>
              <motion.a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-primary">
                    {p.tag}
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>

                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {p.subtitle}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.domain}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    View project
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </motion.a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
