'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Download } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { LanguageToggle } from '@/components/language-toggle'

export function Navbar() {
  const { t, lang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.contact, href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border-border bg-card/70 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 font-mono text-sm">
          <span className="grid size-7 place-items-center rounded-md border border-primary/40 text-[0.7rem] font-bold text-primary">
            JV
          </span>
          <span className="font-semibold tracking-tight text-foreground">
            julian.dev
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:flex" layoutId="lang-pill-desktop" />
          <a
            href={lang === 'en' ? '/julian-velandia-cv-en.pdf' : '/julian-velandia-cv.pdf'}
            download="Julian-Velandia-CV.pdf"
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-cyan/60 hover:text-cyan sm:inline-flex"
          >
            <Download className="size-3.5" />
            {t.nav.cv}
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-cyan via-blue to-violet px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 sm:inline-block"
          >
            {t.nav.hireMe}
          </a>
          <LanguageToggle className="sm:hidden" layoutId="lang-pill-mobile" />
          <button
            type="button"
            aria-label={t.nav.toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label={t.nav.toggleMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-border bg-card/90 p-4 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={lang === 'en' ? '/julian-velandia-cv-en.pdf' : '/julian-velandia-cv.pdf'}
                  download="Julian-Velandia-CV.pdf"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-center text-sm font-medium text-foreground"
                >
                  <Download className="size-4" />
                  {t.nav.downloadCv}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-lg bg-gradient-to-r from-cyan via-blue to-violet px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  {t.nav.hireMe}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
