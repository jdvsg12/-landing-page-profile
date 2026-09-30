import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieValue,
  getAdminPassword,
  passwordsMatch,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  const password = getAdminPassword()
  if (!password) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD no está configurada' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const input =
    typeof body === 'object' &&
    body !== null &&
    'password' in body &&
    typeof body.password === 'string'
      ? body.password
      : ''

  if (!passwordsMatch(input, password)) {
    return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, adminCookieValue(password), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  return response
}
