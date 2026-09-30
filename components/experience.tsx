'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Reveal } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function Experience() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const line = lineRef.current
      const container = ref.current
      if (!line || !container) return
      const nodes = gsap.utils.toArray<HTMLElement>('[data-node]', container)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(line, { scaleY: 1 })
        nodes.forEach((node) => node.setAttribute('data-active', 'true'))
        return
      }

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: true,
          },
        },
      )

      nodes.forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: 'center 60%',
          onEnter: () => node.setAttribute('data-active', 'true'),
          onLeaveBack: () => node.removeAttribute('data-active'),
        })
      })
    },
    { scope: ref, dependencies: [t.experience.jobs.length] },
  )

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
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
          <div
            ref={lineRef}
            className="brand-gradient absolute bottom-2 left-[7px] top-2 w-px origin-top scale-y-0"
          />

          <div className="flex flex-col gap-6">
            {t.experience.jobs.map((job, i) => (
              <Reveal key={`${job.role}-${i}`} delay={i * 0.05}>
                <div className="relative">
                  <span
                    data-node
                    className="timeline-node group/node absolute -left-[2.35rem] top-6 grid size-4 place-items-center"
                  >
                    <span className="timeline-node-ring size-4 rounded-full border-2 border-border bg-background transition-all duration-500" />
                    <span className="timeline-node-core absolute size-2 scale-50 rounded-full bg-muted-foreground/40 transition-all duration-500" />
                  </span>

                  <div className="group rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {job.role}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-primary">{job.period}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[0.7rem] text-foreground/75"
                        >
                          {tag}
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
