'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function Projects() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)
  const [pinned, setPinned] = useState(false)
  const total = String(t.projects.items.length).padStart(2, '0')

  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    )
    const update = () => setPinned(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track || !pinned) return

      const distance = () => Math.max(track.scrollWidth - window.innerWidth + 48, 0)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const count = t.projects.items.length
            const current = Math.min(
              count,
              Math.max(1, Math.ceil(self.progress * count || 1)),
            )
            if (indexRef.current) {
              indexRef.current.textContent = `${String(current).padStart(2, '0')} / ${total}`
            }
          },
        },
      })
      ScrollTrigger.sort()
      ScrollTrigger.refresh()

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        ScrollTrigger.refresh()
      }
    },
    { scope: sectionRef, dependencies: [pinned, t.projects.items.length, total] },
  )

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-x-clip">
      <div className="flex min-h-screen min-w-0 flex-col justify-center overflow-hidden px-4 py-24 md:px-10 md:py-16">
        <div className="mx-auto w-full max-w-[90rem]">
          <SectionLabel index="02" label={t.projects.label} />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {t.projects.titlePre}{' '}
                <span className="text-gradient">{t.projects.titleHighlight}</span>
              </h2>
            </Reveal>
            <p className="max-w-sm text-sm text-muted-foreground">{t.projects.intro}</p>
          </div>
        </div>

        <div
          ref={trackRef}
          className={
            pinned
              ? 'mt-10 flex w-max gap-5 pr-[12vw]'
              : 'mx-auto mt-10 grid w-full max-w-5xl gap-5 md:grid-cols-3'
          }
        >
          {t.projects.items.map((project, index) => (
            <a
              key={`${project.title}-${index}`}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-transform duration-300 hover:-translate-y-1.5 hover:border-primary/50 ${
                pinned ? 'w-[min(78vw,30rem)] shrink-0' : ''
              }`}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-primary">
                  {project.tag}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-8 font-heading text-2xl font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{project.subtitle}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-xs text-muted-foreground">{project.domain}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  {t.projects.viewProject}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div
          className={`mx-auto mt-8 w-full max-w-[90rem] items-center justify-between font-mono text-xs tracking-[0.2em] text-muted-foreground ${
            pinned ? 'flex' : 'hidden'
          }`}
        >
          <span ref={indexRef}>01 / {total}</span>
          <span>{t.projects.next}</span>
        </div>
      </div>
    </section>
  )
}
