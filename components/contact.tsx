'use client'

import { useState } from 'react'
import { Mail, Phone, Send, Check } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import { useI18n } from '@/lib/i18n'

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
  const { t } = useI18n()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name')
    const email = data.get('email')
    const message = data.get('message')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) {
        throw new Error('Failed')
      }

      setSent(true)
      form.reset()
      setTimeout(() => {
        setSent(false)
      }, 4000)
    } catch {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionLabel index="05" label={t.contact.label} />

        <Reveal>
          <h2 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t.contact.titlePre}{' '}
            <span className="text-gradient">{t.contact.titleHighlight}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted-foreground">
            {t.contact.intro}
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
              <label className="sr-only" htmlFor="contact-name">{t.contact.name}</label>
              <input
                id="contact-name"
                name="name"
                required
                placeholder={t.contact.name}
                className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <label className="sr-only" htmlFor="contact-email">{t.contact.email}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder={t.contact.email}
                className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <label className="sr-only" htmlFor="contact-message">{t.contact.message}</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder={t.contact.message}
                className="resize-none rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div role="status" aria-live="polite" className="sr-only">
                {sent ? t.contact.sending : error ? t.contact.error : ''}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan via-blue to-violet px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : sent ? (
                  <>
                    <Check className="size-4" /> {t.contact.sending}
                  </>
                ) : error ? (
                  <>
                    <Send className="size-4" /> {t.contact.error}
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> {t.contact.send}
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
