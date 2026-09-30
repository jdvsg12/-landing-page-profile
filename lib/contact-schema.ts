import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  lang: z.enum(['en', 'es']).default('es'),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactField = 'name' | 'email' | 'message' | 'consent'

export function contactFieldErrors(error: z.ZodError): ContactField[] {
  const fields = new Set<ContactField>()
  for (const issue of error.issues) {
    const field = issue.path[0]
    if (
      field === 'name' ||
      field === 'email' ||
      field === 'message' ||
      field === 'consent'
    ) {
      fields.add(field)
    }
  }
  return [...fields]
}
