import { SiteShell } from '@/components/site-shell'
import { readSiteContent } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default function Page() {
  const content = readSiteContent()
  return <SiteShell content={content} />
}
