'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Download, Zap } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const { t, lang, profile } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const cvHref = lang === 'en' ? profile.cvEn : profile.cvEs

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.from('[data-hero-item]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.1,
        delay: 0.15,
        ease: 'power3.out',
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      timeline
        .to('[data-hero-copy]', { y: 70, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('[data-hero-title]', { yPercent: -18, scale: 0.9, ease: 'none' }, 0)
        .to('[data-hero-orbit]', { rotation: 70, yPercent: 12, ease: 'none' }, 0)
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_30%,transparent_75%)]" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div data-hero-orbit className="size-[min(92vw,46rem)]">
          <svg viewBox="0 0 400 400" className="size-full text-violet/50">
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="108" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <circle cx="318" cy="150" r="7" fill="var(--cyan)" />
          </svg>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-orb pointer-events-none absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 rounded-full bg-blue/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="animate-orb pointer-events-none absolute right-[15%] top-1/4 size-72 rounded-full bg-violet/20 blur-[110px] [animation-delay:1s]"
      />

      <div
        data-hero-copy
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <div
          data-hero-item
          className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[0.7rem] tracking-widest text-muted-foreground backdrop-blur-sm"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          {t.hero.available}
        </div>

        <h1
          data-hero-item
          data-hero-title
          className="mt-7 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl"
        >
          <span className="text-gradient">{profile.firstName}</span>
          <br />
          <span className="text-gradient">{profile.lastName}</span>
        </h1>

        <p
          data-hero-item
          className="mt-6 font-mono text-sm tracking-[0.18em] text-muted-foreground sm:text-base"
        >
          {t.hero.role}
          {t.hero.tools.map((tool) => (
            <span key={tool}>
              {' '}
              <span className="text-cyan">·</span> {tool}
            </span>
          ))}
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-cyan" />
        </p>

        <p data-hero-item className="mt-5 max-w-md text-lg text-foreground/80 text-pretty">
          {t.hero.tagline}
        </p>

        <div data-hero-item className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#projects"
            className="brand-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Zap className="size-4" />
            {t.hero.seeWork}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
          >
            {t.hero.contactMe}
          </a>
          <a
            href={cvHref}
            download="Julian-Velandia-CV.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-cyan/60 hover:text-cyan"
          >
            <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
            {t.hero.downloadCv}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          {t.hero.scroll}
        </span>
        <span className="flex h-7 w-4 justify-center rounded-full border border-border pt-1.5">
          <span className="size-1 animate-scroll-dot rounded-full bg-cyan" />
        </span>
      </div>
    </section>
  )
}
