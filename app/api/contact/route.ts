import { NextResponse } from 'next/server'
import { readSiteContent } from '@/lib/site-content'
import { emailTemplate } from './email-template'

export async function POST(request: Request) {
  try {
    const { name, email, message, consent, lang } = await request.json()

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      )
    }

    if (consent !== true) {
      return NextResponse.json(
        { error: 'Data processing authorization is required' },
        { status: 400 },
      )
    }

    const content = await readSiteContent()
    const policy = content[lang === 'en' ? 'en' : 'es'].privacy
    const acceptedAt = new Date()

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'jdvs_g12@hotmail.com',
      subject: `Contact from ${name}`,
      html: emailTemplate({
        name,
        email,
        message,
        consent: {
          acceptedAt: acceptedAt.toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            dateStyle: 'long',
            timeStyle: 'medium',
          }),
          acceptedAtIso: acceptedAt.toISOString(),
          policy: `${policy.title} (${policy.updated})`,
        },
      }),
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
