'use client'

import Link from 'next/link'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t, profile } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-start">
          <p>
            {profile.name} © {year} · {t.footer.builtWith}{' '}
            <span className="text-primary">Next.js</span>
          </p>
          <Link
            href="/privacidad"
            className="text-xs underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            {t.footer.privacy}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <LinkedinIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
