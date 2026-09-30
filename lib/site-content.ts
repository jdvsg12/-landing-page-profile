import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Dict, Profile, SiteContent } from '@/lib/site-types'

const filePath = join(process.cwd(), 'content', 'site.json')

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
  if (
    !isRecord(nav) ||
    !isRecord(hero) ||
    !isRecord(about) ||
    !isRecord(projects) ||
    !isRecord(skills) ||
    !isRecord(experience) ||
    !isRecord(contact) ||
    !isRecord(footer)
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
    ]) ||
    !hasStrings(footer, ['builtWith'])
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

export function readSiteContent(): SiteContent {
  const raw = readFileSync(filePath, 'utf8')
  const parsed: unknown = JSON.parse(raw)
  if (!isSiteContent(parsed)) {
    throw new Error('content/site.json no tiene la estructura esperada')
  }
  return parsed
}

export function writeSiteContent(content: SiteContent) {
  writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
}
