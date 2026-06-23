'use client'

import { motion } from 'motion/react'
import { ArrowRight, Zap, Download } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero() {
  const { t, lang } = useI18n()
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24"
    >
      {/* background grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_30%,transparent_75%)]" />
      {/* glow orbs */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/3 size-[34rem] -translate-x-1/2 rounded-full bg-blue/20 blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute right-[15%] top-1/4 size-72 rounded-full bg-violet/20 blur-[110px]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div
          variants={item}
          className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[0.7rem] tracking-widest text-muted-foreground backdrop-blur-sm"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          AVAILABLE FOR REMOTE WORK
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-7 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl"
        >
          <span className="text-gradient">JULIAN</span>
          <br />
          <span className="text-gradient">VELANDIA</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 font-mono text-sm text-muted-foreground sm:text-base"
        >
          Frontend Developer{' '}
          <span className="text-cyan">·</span> React{' '}
          <span className="text-cyan">·</span> Next.js{' '}
          <span className="text-cyan">·</span> TypeScript
          <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-cyan" />
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 max-w-md text-lg text-foreground/80 text-pretty"
        >
          {'"I build fast, scalable interfaces that convert."'}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-blue to-violet px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Zap className="size-4" />
            See my work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
          >
            Contact me
          </a>
          <a
            href={lang === 'en' ? '/julian-velandia-cv-en.pdf' : '/julian-velandia-cv.pdf'}
            download="Julian-Velandia-CV.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-cyan/60 hover:text-cyan"
          >
            <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
            Download CV
          </a>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground">
          SCROLL
        </span>
        <span className="flex h-7 w-4 justify-center rounded-full border border-border pt-1.5">
          <span className="size-1 rounded-full bg-cyan animate-scroll-dot" />
        </span>
      </motion.div>
    </section>
  )
}
