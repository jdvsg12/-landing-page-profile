import type { Metadata } from 'next'
import { PrivacyPolicy } from '@/components/privacy-policy'
import { LanguageProvider } from '@/lib/i18n'
import { readSiteContent } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Política de privacidad | Julian Velandia',
  description:
    'Política de tratamiento de datos personales del formulario de contacto (Ley 1581 de 2012).',
  alternates: { canonical: '/privacidad' },
}

export default async function PrivacyPage() {
  const content = await readSiteContent()
  return (
    <LanguageProvider content={content}>
      <PrivacyPolicy />
    </LanguageProvider>
  )
}
