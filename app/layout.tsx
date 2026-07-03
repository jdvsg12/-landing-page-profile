import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://landing-page-portfolio-julian-velandia.vercel.app';

export const metadata: Metadata = {
  title: 'Julian Velandia | Senior Frontend Developer',
  description: 'Portfolio of Julian Velandia, Frontend Specialist based in Bogotá. Expert in building high-performance web interfaces using React.js, Next.js, TypeScript and Tailwind CSS, with backend development knowledge.',
  generator: 'v0.app',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Julian Velandia | Senior Frontend Developer',
    description: 'Frontend Specialist (React.js, Next.js, TypeScript) with backend knowledge. Explore my projects and experience in web development.',
    url: siteUrl,
    siteName: 'Julian Velandia Portfolio',
    images: [
      {
        url: `${siteUrl}/og-image.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Julian Velandia - Senior Frontend Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julian Velandia | Senior Frontend Developer',
    description: 'Frontend Specialist (React.js, Next.js, TypeScript) with backend knowledge.',
    images: [`${siteUrl}/og-image.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon-dark-32x32.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '//icon-dark-32x32.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
