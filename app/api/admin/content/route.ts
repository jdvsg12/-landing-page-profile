import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import {
  isSiteContent,
  readSiteContent,
  writeSiteContent,
} from '@/lib/site-content'

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return NextResponse.json(readSiteContent())
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const raw = await request.text()
  if (raw.length > 300_000) {
    return NextResponse.json({ error: 'El contenido es demasiado grande' }, { status: 413 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!isSiteContent(parsed)) {
    return NextResponse.json(
      { error: 'Faltan campos o la estructura no coincide' },
      { status: 400 },
    )
  }

  try {
    writeSiteContent(parsed)
  } catch {
    return NextResponse.json(
      {
        error:
          'No se pudo escribir content/site.json. En Vercel el disco es de solo lectura: guarda en local y despliega el archivo.',
      },
      { status: 500 },
    )
  }

  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
