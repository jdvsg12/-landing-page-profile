'use client'

import { useState } from 'react'
import { Mail, Phone, Send, Check } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'

const contacts = [
  {
    icon: Mail,
    label: 'jdvs_g12@hotmail.com',
    href: 'mailto:jdvs_g12@hotmail.com',
  },
  { icon: Phone, label: '+57 311 826 2053', href: 'tel:+573118262053' },
  {
    icon: LinkedinIcon,
    label: 'linkedin.com/in/julian-velandia-santafe',
    href: 'https://www.linkedin.com/in/julian-velandia-santafe/',
  },
  {
    icon: GithubIcon,
    label: 'github.com/jdvsg12',
    href: 'https://github.com/jdvsg12',
  },
]

export function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')
    const email = data.get('email')
    const message = data.get('message')
    window.location.href = `mailto:jdvs_g12@hotmail.com?subject=${encodeURIComponent(
      `Contact from ${name}`,
    )}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`
    setSent(true)
    form.reset()
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="05" label="CONTACT" />

        <Reveal>
          <h2 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Let&apos;s build something{' '}
            <span className="text-gradient">together</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted-foreground">
            Open to freelance projects, remote full-time, and collaborations.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <RevealGroup className="flex flex-col gap-4">
            {contacts.map((c) => (
              <RevealItem key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 px-5 py-4 transition-colors hover:border-primary/50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary/50 text-cyan transition-transform group-hover:scale-110">
                    <c.icon className="size-5" />
                  </span>
                  <span className="truncate text-sm text-foreground/85 group-hover:text-foreground">
                    {c.label}
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-6"
            >
              <input
                name="name"
                required
                placeholder="Your Name"
                className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Your Email"
                className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Your Message"
                className="resize-none rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan via-blue to-violet px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {sent ? (
                  <>
                    <Check className="size-4" /> Opening your email…
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
