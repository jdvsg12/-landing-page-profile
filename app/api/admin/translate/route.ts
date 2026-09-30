import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { isDict } from '@/lib/site-content'
import { TranslateError, translateDict } from '@/lib/translate'

export const maxDuration = 60

function isLang(value: unknown): value is 'en' | 'es' {
  return value === 'en' || value === 'es'
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { from, to, dict } = (body ?? {}) as Record<string, unknown>
  if (!isLang(from) || !isLang(to) || from === to || !isDict(dict)) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  try {
    const translated = await translateDict(dict, from, to)
    return NextResponse.json({ dict: translated })
  } catch (error) {
    if (error instanceof TranslateError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'No se pudo traducir' }, { status: 500 })
  }
}
