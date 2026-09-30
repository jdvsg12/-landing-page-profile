import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { get, put } from '@vercel/blob'
import type { Dict, Profile, SiteContent } from '@/lib/site-types'

const filePath = join(process.cwd(), 'content', 'site.json')
const BLOB_PATHNAME = 'site-content.json'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

function hasStrings(record: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => isString(record[key]))
}

export function isDict(value: unknown): value is Dict {
  if (!isRecord(value)) return false
  const nav = value.nav
  const hero = value.hero
  const about = value.about
  const projects = value.projects
  const skills = value.skills
  const experience = value.experience
  const contact = value.contact
  const footer = value.footer
  const privacy = value.privacy
  if (
    !isRecord(nav) ||
    !isRecord(hero) ||
    !isRecord(about) ||
    !isRecord(projects) ||
    !isRecord(skills) ||
    !isRecord(experience) ||
    !isRecord(contact) ||
    !isRecord(footer) ||
    !isRecord(privacy)
  ) {
    return false
  }

  if (
    !hasStrings(nav, [
      'about',
      'projects',
      'skills',
      'experience',
      'contact',
      'cv',
      'downloadCv',
      'hireMe',
      'toggleMenu',
    ]) ||
    !hasStrings(hero, [
      'available',
      'role',
      'tagline',
      'seeWork',
      'contactMe',
      'downloadCv',
      'scroll',
    ]) ||
    !isStringArray(hero.tools) ||
    !hasStrings(about, [
      'label',
      'titlePre',
      'titleHighlight',
      'p1',
      'p2',
      'freelance',
      'remote',
      'fulltime',
      'stackLabel',
    ]) ||
    !isStringArray(about.stack) ||
    !Array.isArray(about.stats) ||
    !about.stats.every(
      (stat) => isRecord(stat) && isString(stat.value) && isString(stat.label),
    ) ||
    !hasStrings(projects, [
      'label',
      'titlePre',
      'titleHighlight',
      'intro',
      'viewProject',
      'next',
    ]) ||
    !Array.isArray(projects.items) ||
    !projects.items.every(
      (item) =>
        isRecord(item) &&
        hasStrings(item, [
          'tag',
          'title',
          'subtitle',
          'description',
          'domain',
          'href',
        ]),
    ) ||
    !hasStrings(skills, [
      'label',
      'titlePre',
      'titleHighlight',
      'intro',
      'proficiency',
      'focus',
    ]) ||
    !Array.isArray(skills.groups) ||
    !skills.groups.every(
      (group) =>
        isRecord(group) && isString(group.title) && isStringArray(group.skills),
    ) ||
    !hasStrings(experience, ['label', 'titlePre', 'titleHighlight']) ||
    !Array.isArray(experience.jobs) ||
    !experience.jobs.every(
      (job) =>
        isRecord(job) &&
        hasStrings(job, ['role', 'period', 'highlight']) &&
        isStringArray(job.tags),
    ) ||
    !hasStrings(contact, [
      'label',
      'titlePre',
      'titleHighlight',
      'intro',
      'name',
      'email',
      'message',
      'send',
      'sending',
      'subject',
      'error',
      'consent',
      'consentLink',
    ]) ||
    !isRecord(contact.errors) ||
    !hasStrings(contact.errors, ['name', 'email', 'message', 'consent']) ||
    !hasStrings(footer, ['builtWith', 'privacy']) ||
    !hasStrings(privacy, ['title', 'updated', 'intro', 'back']) ||
    !Array.isArray(privacy.sections) ||
    !privacy.sections.every(
      (section) =>
        isRecord(section) && isString(section.title) && isString(section.body),
    )
  ) {
    return false
  }

  return true
}

function isProfile(value: unknown): value is Profile {
  return (
    isRecord(value) &&
    hasStrings(value, [
      'name',
      'firstName',
      'lastName',
      'mark',
      'siteLabel',
      'email',
      'phone',
      'phoneHref',
      'github',
      'githubLabel',
      'linkedin',
      'linkedinLabel',
      'cvEn',
      'cvEs',
    ])
  )
}

export function isSiteContent(value: unknown): value is SiteContent {
  return (
    isRecord(value) &&
    isProfile(value.profile) &&
    isDict(value.en) &&
    isDict(value.es)
  )
}

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function fillMissing(stored: unknown, defaults: unknown): unknown {
  if (stored === undefined) return defaults
  if (!isRecord(stored) || !isRecord(defaults)) return stored
  const merged: Record<string, unknown> = { ...stored }
  for (const [key, value] of Object.entries(defaults)) {
    merged[key] = fillMissing(stored[key], value)
  }
  return merged
}

function parseContent(
  raw: string,
  source: string,
  defaults?: SiteContent,
): SiteContent {
  const json: unknown = JSON.parse(raw)
  const parsed = defaults ? fillMissing(json, defaults) : json
  if (!isSiteContent(parsed)) {
    throw new Error(`${source} no tiene la estructura esperada`)
  }
  return parsed
}

function readFileContent(): SiteContent {
  return parseContent(readFileSync(filePath, 'utf8'), 'content/site.json')
}

async function readBlobContent(): Promise<SiteContent | null> {
  const result = await get(BLOB_PATHNAME, { access: 'private', useCache: false })
  if (!result || result.statusCode !== 200) return null
  const raw = await new Response(result.stream).text()
  return parseContent(raw, BLOB_PATHNAME, readFileContent())
}

export async function readSiteContent(): Promise<SiteContent> {
  if (blobEnabled()) {
    try {
      const stored = await readBlobContent()
      if (stored) return stored
    } catch (error) {
      console.error('No se pudo leer el contenido desde Blob', error)
    }
  }
  return readFileContent()
}

export async function writeSiteContent(content: SiteContent) {
  const json = `${JSON.stringify(content, null, 2)}\n`
  if (blobEnabled()) {
    await put(BLOB_PATHNAME, json, {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
    return
  }
  writeFileSync(filePath, json, 'utf8')
}
