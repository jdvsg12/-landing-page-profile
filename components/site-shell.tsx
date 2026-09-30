'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Experience } from '@/components/experience'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { LanguageProvider, useI18n } from '@/lib/i18n'
import { Marquee } from '@/components/marquee'
import { Navbar } from '@/components/navbar'
import { Projects } from '@/components/projects'
import { ScrollProgress } from '@/components/scroll-progress'
import { Skills } from '@/components/skills'
import { SmoothScroll } from '@/components/smooth-scroll'
import type { SiteContent } from '@/lib/site-types'

function RefreshOnLang() {
  const { lang } = useI18n()

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [lang])

  return null
}

export function SiteShell({ content }: { content: SiteContent }) {
  return (
    <LanguageProvider content={content}>
      <SmoothScroll>
        <RefreshOnLang />
        <ScrollProgress />
        <main id="main-content" className="relative min-h-screen bg-background text-foreground">
          <Navbar />
          <Hero />
          <About />
          <Marquee />
          <Projects />
          <Skills />
          <Experience />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </LanguageProvider>
  )
}
