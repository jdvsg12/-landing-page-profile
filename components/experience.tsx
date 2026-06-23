'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import { useI18n } from '@/lib/i18n'

export function Experience() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 80%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="04" label={t.experience.label} />

        <Reveal>
          <h2 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.experience.titlePre}{' '}
            <span className="text-gradient">{t.experience.titleHighlight}</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-14 pl-10">
          {/* track */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          {/* progress fill */}
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-cyan via-blue to-violet"
          />

          <div className="flex flex-col gap-6">
            {t.experience.jobs.map((job, i) => (
              <Reveal key={job.role} delay={i * 0.05}>
                <div className="relative">
                  {/* node */}
                  <span className="absolute -left-[2.35rem] top-6 grid size-4 place-items-center">
                    <span className="size-4 rounded-full border-2 border-blue bg-background" />
                    <span className="absolute size-2 rounded-full bg-cyan" />
                  </span>

                  <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {job.role}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-primary">
                      {job.period}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[0.7rem] text-foreground/75"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      <span className="text-cyan">▹</span> {job.highlight}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
