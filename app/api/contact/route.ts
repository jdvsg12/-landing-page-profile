import { NextResponse } from 'next/server'
import { contactFieldErrors, contactSchema } from '@/lib/contact-schema'
import { readSiteContent } from '@/lib/site-content'
import { emailTemplate } from './email-template'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid form data', fields: contactFieldErrors(result.error) },
      { status: 400 },
    )
  }

  const { name, email, message, lang } = result.data

  try {
    const content = await readSiteContent()
    const policy = content[lang].privacy
    const acceptedAt = new Date()

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
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
    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }
}
