import { isDict } from '@/lib/site-content'
import type { Dict, Lang } from '@/lib/site-types'

const languageNames: Record<Lang, string> = {
  en: 'English',
  es: 'Spanish (Latin America, Colombia)',
}

function sameShape(a: unknown, b: unknown): boolean {
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every((item, i) => sameShape(item, b[i]))
  }
  if (typeof a === 'object' && a !== null) {
    if (typeof b !== 'object' || b === null || Array.isArray(b)) return false
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    return (
      keysA.length === keysB.length &&
      keysA.every((key) =>
        sameShape((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
      )
    )
  }
  return typeof a === typeof b
}

export class TranslateError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function translateDict(source: Dict, from: Lang, to: Lang): Promise<Dict> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new TranslateError('GEMINI_API_KEY no está configurada', 503)
  }
  const models = [
    ...new Set([
      process.env.GEMINI_MODEL || 'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
    ]),
  ]

  const prompt = [
    `Translate the JSON below from ${languageNames[from]} to ${languageNames[to]}.`,
    'It is the copy of a personal portfolio website for a software developer.',
    'Rules:',
    '- Return only JSON with exactly the same keys, nesting and array lengths.',
    '- Translate only the string values. Never translate keys.',
    '- Keep technology, framework, company and product names unchanged (React, Next.js, NestJS, SARD, Valere, etc.).',
    '- Keep URLs, domains, emails, numbers, percentages, symbols like "//", "▹", "·", "—" and uppercase styling as in the source.',
    '- Use a natural, concise, professional tone.',
    '',
    JSON.stringify(source),
  ].join('\n')

  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  })

  const deadline = Date.now() + 50_000
  let response: Response | null = null
  const failures: string[] = []
  for (const model of models) {
    const remaining = deadline - Date.now()
    if (remaining < 5_000) break
    try {
      const attempt = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body,
          signal: AbortSignal.timeout(Math.min(remaining, 30_000)),
        },
      )
      if (attempt.ok) {
        response = attempt
        break
      }
      failures.push(`${model}: ${attempt.status}`)
      if (![404, 429, 500, 503].includes(attempt.status)) break
    } catch {
      failures.push(`${model}: sin respuesta`)
    }
  }

  if (!response) {
    throw new TranslateError(
      `Gemini no está disponible (${failures.join(', ')}). Intenta de nuevo en unos segundos.`,
      502,
    )
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('')
  if (!text) {
    throw new TranslateError('Gemini no devolvió texto', 502)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new TranslateError('Gemini devolvió un JSON inválido', 502)
  }

  if (!isDict(parsed) || !sameShape(source, parsed)) {
    throw new TranslateError('La traducción no conserva la estructura original, intenta de nuevo', 502)
  }

  return parsed
}
