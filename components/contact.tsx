'use client'

import { useState } from 'react'
import { Mail, Phone, Send, Check } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { SectionLabel } from '@/components/section-label'
import {
  contactFieldErrors,
  contactSchema,
  type ContactField,
} from '@/lib/contact-schema'
import { useI18n } from '@/lib/i18n'

const inputClass =
  'rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary aria-invalid:border-destructive aria-invalid:focus:ring-destructive'

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="-mt-2 text-xs text-destructive">
      {message}
    </p>
  )
}

export function Contact() {
  const { t, profile, lang } = useI18n()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<ContactField[]>([])
  const hasError = (field: ContactField) => fieldErrors.includes(field)
  const contacts = [
    {
      icon: Mail,
      label: profile.email,
      href: `mailto:${profile.email}`,
    },
    { icon: Phone, label: profile.phone, href: profile.phoneHref },
    {
      icon: LinkedinIcon,
      label: profile.linkedinLabel,
      href: profile.linkedin,
    },
    {
      icon: GithubIcon,
      label: profile.githubLabel,
      href: profile.github,
    },
  ]

  function clearFieldError(field: ContactField) {
    setFieldErrors((current) => current.filter((item) => item !== field))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    const form = e.currentTarget
    const data = new FormData(form)
    const result = contactSchema.safeParse({
      name: data.get('name') ?? '',
      email: data.get('email') ?? '',
      message: data.get('message') ?? '',
      consent: data.get('consent') === 'on',
      lang,
    })

    if (!result.success) {
      const fields = contactFieldErrors(result.error)
      setFieldErrors(fields)
      form.querySelector<HTMLElement>(`[name="${fields[0]}"]`)?.focus()
      return
    }

    setFieldErrors([])
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null)
        if (
          body &&
          typeof body === 'object' &&
          'fields' in body &&
          Array.isArray(body.fields) &&
          body.fields.length > 0
        ) {
          setFieldErrors(body.fields as ContactField[])
          return
        }
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
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-6"
            >
              <label className="sr-only" htmlFor="contact-name">{t.contact.name}</label>
              <input
                id="contact-name"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder={t.contact.name}
                aria-invalid={hasError('name') || undefined}
                aria-describedby={hasError('name') ? 'contact-name-error' : undefined}
                onChange={() => clearFieldError('name')}
                className={inputClass}
              />
              {hasError('name') && (
                <FieldError id="contact-name-error" message={t.contact.errors.name} />
              )}
              <label className="sr-only" htmlFor="contact-email">{t.contact.email}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder={t.contact.email}
                aria-invalid={hasError('email') || undefined}
                aria-describedby={hasError('email') ? 'contact-email-error' : undefined}
                onChange={() => clearFieldError('email')}
                className={inputClass}
              />
              {hasError('email') && (
                <FieldError id="contact-email-error" message={t.contact.errors.email} />
              )}
              <label className="sr-only" htmlFor="contact-message">{t.contact.message}</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                maxLength={5000}
                placeholder={t.contact.message}
                aria-invalid={hasError('message') || undefined}
                aria-describedby={hasError('message') ? 'contact-message-error' : undefined}
                onChange={() => clearFieldError('message')}
                className={`resize-none ${inputClass}`}
              />
              {hasError('message') && (
                <FieldError id="contact-message-error" message={t.contact.errors.message} />
              )}
              <label
                htmlFor="contact-consent"
                className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground"
              >
                <input
                  id="contact-consent"
                  name="consent"
                  type="checkbox"
                  required
                  aria-invalid={hasError('consent') || undefined}
                  aria-describedby={hasError('consent') ? 'contact-consent-error' : undefined}
                  onChange={() => clearFieldError('consent')}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>
                  {t.contact.consent}{' '}
                  <a
                    href="/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-foreground"
                  >
                    {t.contact.consentLink}
                  </a>
                  .
                </span>
              </label>
              {hasError('consent') && (
                <FieldError id="contact-consent-error" message={t.contact.errors.consent} />
              )}
              <div role="status" aria-live="polite" className="sr-only">
                {sent ? t.contact.sending : error ? t.contact.error : ''}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="brand-gradient inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
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
