'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Dict, Lang, Profile, SiteContent } from '@/lib/site-types'

export type { Dict, Lang, Profile, SiteContent }

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: Dict
  profile: Profile
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'jv-lang'

export function LanguageProvider({
  children,
  content,
}: {
  children: ReactNode
  content: SiteContent
}) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === 'en' || stored === 'es') {
      setLangState(stored)
    } else if (navigator.language.toLowerCase().startsWith('es')) {
      setLangState('es')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  const toggle = () => setLang(lang === 'en' ? 'es' : 'en')

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        toggle,
        t: content[lang],
        profile: content.profile,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within a LanguageProvider')
  }
  return ctx
}
