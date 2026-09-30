'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element || prefersReducedMotion()) return
      gsap.from(element, {
        y: 28,
        autoAlpha: 0,
        duration: 0.75,
        delay,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: ref, dependencies: [delay] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function RevealGroup({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element || prefersReducedMotion()) return
      const items = element.querySelectorAll(':scope > [data-reveal-item]')
      gsap.from(items, {
        y: 32,
        autoAlpha: 0,
        duration: 0.7,
        stagger,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: element,
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: ref, dependencies: [stagger] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div data-reveal-item className={className}>
      {children}
    </div>
  )
}
