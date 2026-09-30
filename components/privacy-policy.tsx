'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LanguageToggle } from '@/components/language-toggle'
import { useI18n } from '@/lib/i18n'

export function PrivacyPolicy() {
  const { t, profile, lang } = useI18n()
  const policy = t.privacy

  return (
    <main id="main" className="px-4 py-16 sm:py-24">
      <article className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> {policy.back}
            </Link>
            <LanguageToggle layoutId="privacy-lang-pill" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {policy.title}
          </h1>
          <p className="text-sm text-muted-foreground">{policy.updated}</p>
          <p className="leading-relaxed text-foreground/85">{policy.intro}</p>
        </header>

        <section className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="font-heading text-lg font-semibold">
            {lang === 'es' ? 'Responsable del tratamiento' : 'Data controller'}
          </h2>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
            <dt className="text-muted-foreground">
              {lang === 'es' ? 'Nombre' : 'Name'}
            </dt>
            <dd>{profile.name}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a
                href={`mailto:${profile.email}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {profile.email}
              </a>
            </dd>
            <dt className="text-muted-foreground">
              {lang === 'es' ? 'País' : 'Country'}
            </dt>
            <dd>Colombia</dd>
          </dl>
        </section>

        {policy.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">
              {section.title}
            </h2>
            {section.body.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-foreground/85">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )
}
