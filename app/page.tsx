import { SiteShell } from '@/components/site-shell'
import { readSiteContent } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const content = await readSiteContent()
  return <SiteShell content={content} />
}
