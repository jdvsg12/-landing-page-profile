'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { Dict, Lang, Profile, SiteContent } from '@/lib/site-types'

const emptyProject = {
  tag: '',
  title: '',
  subtitle: '',
  description: '',
  domain: '',
  href: 'https://',
}

const emptyJob = {
  role: '',
  period: '',
  tags: [] as string[],
  highlight: '',
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
}) {
  const className =
    'w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  return (
    <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
      {label}
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
          className={`${className} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  )
}

function Chips({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function add() {
    const next = draft.trim()
    if (!next) return
    onChange([...values, next])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
      <span>{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[0.7rem] text-foreground"
          >
            {item} ×
          </button>
        ))}
      </div>
      <input
        value={draft}
        placeholder="Escribe y pulsa Enter"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            add()
          }
        }}
        className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <details open className="rounded-2xl border border-border bg-card/50">
      <summary className="cursor-pointer px-5 py-4 font-heading text-lg font-semibold">
        {title}
      </summary>
      <div className="flex flex-col gap-4 px-5 pb-5">{children}</div>
    </details>
  )
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction
  if (next < 0 || next >= items.length) return items
  const copy = [...items]
  const current = copy[index]
  const target = copy[next]
  if (current === undefined || target === undefined) return items
  copy[index] = target
  copy[next] = current
  return copy
}

export function AdminPanel() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [devFallback, setDevFallback] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [content, setContent] = useState<SiteContent | null>(null)
  const [lang, setLang] = useState<Lang>('es')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const session = await fetch('/api/admin/session').then((response) => response.json())
      if (!active) return
      setDevFallback(Boolean(session.devFallback))
      if (!session.ok) {
        setReady(true)
        return
      }
      const data = await fetch('/api/admin/content')
      if (!active) return
      if (data.ok) {
        setContent((await data.json()) as SiteContent)
        setAuthed(true)
      }
      setReady(true)
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setLoginError('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setLoginError(body?.error ?? 'No se pudo entrar')
      return
    }
    const data = await fetch('/api/admin/content')
    if (!data.ok) {
      setLoginError('Sesión creada, pero no se pudo leer el contenido')
      return
    }
    setContent((await data.json()) as SiteContent)
    setAuthed(true)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthed(false)
    setContent(null)
  }

  async function save() {
    if (!content) return
    setSaving(true)
    setStatus('')
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setSaving(false)
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null
      setStatus(body?.error ?? 'No se pudo guardar')
      return
    }
    setStatus('Guardado en content/site.json. Recarga el inicio para verlo.')
  }

  async function translate() {
    if (!content) return
    const from = lang
    const to: Lang = lang === 'es' ? 'en' : 'es'
    const target = to === 'en' ? 'inglés' : 'español'
    if (!window.confirm(`Esto reemplaza todo el contenido en ${target} con la traducción. ¿Continuar?`)) {
      return
    }
    setTranslating(true)
    setStatus('')
    const response = await fetch('/api/admin/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, dict: content[from] }),
    }).catch(() => null)
    setTranslating(false)
    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as { error?: string } | null
      setStatus(body?.error ?? 'No se pudo traducir')
      return
    }
    const { dict: translated } = (await response.json()) as { dict: Dict }
    setContent((current) => (current ? { ...current, [to]: translated } : current))
    setLang(to)
    setStatus(`Traducido a ${target}. Revisa los textos y pulsa Guardar para aplicarlo.`)
  }

  function patchProfile(patch: Partial<Profile>) {
    setContent((current) =>
      current ? { ...current, profile: { ...current.profile, ...patch } } : current,
    )
  }

  function patchDict(patch: Partial<Dict> | ((dict: Dict) => Dict)) {
    setContent((current) => {
      if (!current) return current
      const dict = current[lang]
      const next = typeof patch === 'function' ? patch(dict) : { ...dict, ...patch }
      return { ...current, [lang]: next }
    })
  }

  if (!ready) {
    return <p className="px-4 py-16 text-sm text-muted-foreground">Cargando panel…</p>
  }

  if (!authed || !content) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <p className="font-mono text-xs tracking-[0.25em] text-primary">ADMIN</p>
        <h1 className="mt-3 font-heading text-4xl font-bold">Actualizar sitio</h1>
        <form onSubmit={login} className="mt-8 flex flex-col gap-3">
          <Field label="Clave" type="password" value={password} onChange={setPassword} />
          {devFallback ? (
            <p className="text-xs text-muted-foreground">
              En local, sin ADMIN_PASSWORD, la clave es dev-admin.
            </p>
          ) : null}
          {loginError ? <p className="text-sm text-destructive">{loginError}</p> : null}
          <button
            type="submit"
            className="brand-gradient rounded-lg px-4 py-3 text-sm font-medium text-primary-foreground"
          >
            Entrar
          </button>
        </form>
      </main>
    )
  }

  const dict = content[lang]
  const profile = content.profile

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-primary">ADMIN</p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Contenido del sitio</h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm">
            Ver sitio
          </a>
          <button type="button" onClick={logout} className="text-sm text-muted-foreground">
            Salir
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex rounded-full border border-border p-0.5 font-mono text-xs">
          {(['es', 'en'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLang(option)}
              className={`rounded-full px-3 py-1 ${lang === option ? 'brand-gradient text-primary-foreground' : 'text-muted-foreground'}`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={translate}
            disabled={translating || saving}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-cyan/60 hover:text-cyan disabled:opacity-50"
          >
            {translating
              ? 'Traduciendo…'
              : lang === 'es'
                ? 'Traducir a inglés'
                : 'Traducir a español'}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || translating}
            className="brand-gradient rounded-full px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
      {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
      <p className="mt-3 text-xs text-muted-foreground">
        El perfil es compartido. El resto se edita en el idioma seleccionado. En producción hay que
        desplegar content/site.json para que el cambio quede publicado.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Section title="Perfil">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nombre visible" value={profile.name} onChange={(value) => patchProfile({ name: value })} />
            <Field label="Nombre en hero" value={profile.firstName} onChange={(value) => patchProfile({ firstName: value })} />
            <Field label="Apellido" value={profile.lastName} onChange={(value) => patchProfile({ lastName: value })} />
            <Field label="Marca" value={profile.mark} onChange={(value) => patchProfile({ mark: value })} />
            <Field label="Etiqueta del sitio" value={profile.siteLabel} onChange={(value) => patchProfile({ siteLabel: value })} />
            <Field label="Email" value={profile.email} onChange={(value) => patchProfile({ email: value })} />
            <Field label="Teléfono" value={profile.phone} onChange={(value) => patchProfile({ phone: value })} />
            <Field label="Enlace teléfono" value={profile.phoneHref} onChange={(value) => patchProfile({ phoneHref: value })} />
            <Field label="GitHub" value={profile.github} onChange={(value) => patchProfile({ github: value })} />
            <Field label="Etiqueta GitHub" value={profile.githubLabel} onChange={(value) => patchProfile({ githubLabel: value })} />
            <Field label="LinkedIn" value={profile.linkedin} onChange={(value) => patchProfile({ linkedin: value })} />
            <Field label="Etiqueta LinkedIn" value={profile.linkedinLabel} onChange={(value) => patchProfile({ linkedinLabel: value })} />
            <Field label="CV inglés" value={profile.cvEn} onChange={(value) => patchProfile({ cvEn: value })} />
            <Field label="CV español" value={profile.cvEs} onChange={(value) => patchProfile({ cvEs: value })} />
          </div>
        </Section>

        <Section title="Navegación">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['about', 'Sobre mí'],
                ['projects', 'Proyectos'],
                ['skills', 'Habilidades'],
                ['experience', 'Experiencia'],
                ['contact', 'Contacto'],
                ['cv', 'CV'],
                ['downloadCv', 'Descargar CV'],
                ['hireMe', 'Contrátame'],
                ['toggleMenu', 'Menú'],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={dict.nav[key]}
                onChange={(value) =>
                  patchDict((current) => ({
                    ...current,
                    nav: { ...current.nav, [key]: value },
                  }))
                }
              />
            ))}
          </div>
        </Section>

        <Section title="Hero">
          <Field label="Disponibilidad" value={dict.hero.available} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, available: value } }))} />
          <Field label="Rol" value={dict.hero.role} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, role: value } }))} />
          <Chips label="Herramientas" values={dict.hero.tools} onChange={(tools) => patchDict((current) => ({ ...current, hero: { ...current.hero, tools } }))} />
          <Field label="Frase" value={dict.hero.tagline} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, tagline: value } }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Ver trabajo" value={dict.hero.seeWork} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, seeWork: value } }))} />
            <Field label="Contacto" value={dict.hero.contactMe} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, contactMe: value } }))} />
            <Field label="Descargar CV" value={dict.hero.downloadCv} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, downloadCv: value } }))} />
            <Field label="Scroll" value={dict.hero.scroll} onChange={(value) => patchDict((current) => ({ ...current, hero: { ...current.hero, scroll: value } }))} />
          </div>
        </Section>

        <Section title="Sobre mí">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Etiqueta" value={dict.about.label} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, label: value } }))} />
            <Field label="Stack" value={dict.about.stackLabel} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, stackLabel: value } }))} />
            <Field label="Título" value={dict.about.titlePre} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, titlePre: value } }))} />
            <Field label="Título destacado" value={dict.about.titleHighlight} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, titleHighlight: value } }))} />
          </div>
          <Field multiline label="Párrafo 1" value={dict.about.p1} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, p1: value } }))} />
          <Field multiline label="Párrafo 2" value={dict.about.p2} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, p2: value } }))} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Freelance" value={dict.about.freelance} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, freelance: value } }))} />
            <Field label="Remoto" value={dict.about.remote} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, remote: value } }))} />
            <Field label="Tiempo completo" value={dict.about.fulltime} onChange={(value) => patchDict((current) => ({ ...current, about: { ...current.about, fulltime: value } }))} />
          </div>
          <Chips label="Stack" values={dict.about.stack} onChange={(stack) => patchDict((current) => ({ ...current, about: { ...current.about, stack } }))} />
          {dict.about.stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="grid gap-3 sm:grid-cols-2">
              <Field
                label={`Dato ${index + 1}`}
                value={stat.value}
                onChange={(value) =>
                  patchDict((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      stats: current.about.stats.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value } : item,
                      ),
                    },
                  }))
                }
              />
              <Field
                label="Etiqueta"
                value={stat.label}
                onChange={(value) =>
                  patchDict((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      stats: current.about.stats.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, label: value } : item,
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
        </Section>

        <Section title="Proyectos">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Etiqueta" value={dict.projects.label} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, label: value } }))} />
            <Field label="Siguiente" value={dict.projects.next} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, next: value } }))} />
            <Field label="Título" value={dict.projects.titlePre} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, titlePre: value } }))} />
            <Field label="Título destacado" value={dict.projects.titleHighlight} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, titleHighlight: value } }))} />
          </div>
          <Field multiline label="Intro" value={dict.projects.intro} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, intro: value } }))} />
          <Field label="Ver proyecto" value={dict.projects.viewProject} onChange={(value) => patchDict((current) => ({ ...current, projects: { ...current.projects, viewProject: value } }))} />
          {dict.projects.items.map((project, index) => (
            <div key={`${project.title}-${index}`} className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-primary">0{index + 1}</p>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={() => patchDict((current) => ({ ...current, projects: { ...current.projects, items: moveItem(current.projects.items, index, -1) } }))}>Subir</button>
                  <button type="button" onClick={() => patchDict((current) => ({ ...current, projects: { ...current.projects, items: moveItem(current.projects.items, index, 1) } }))}>Bajar</button>
                  <button type="button" className="text-destructive" onClick={() => patchDict((current) => ({ ...current, projects: { ...current.projects, items: current.projects.items.filter((_, itemIndex) => itemIndex !== index) } }))}>Quitar</button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['tag', 'title', 'subtitle', 'domain', 'href'] as const).map((key) => (
                  <Field
                    key={key}
                    label={key}
                    value={project[key]}
                    onChange={(value) =>
                      patchDict((current) => ({
                        ...current,
                        projects: {
                          ...current.projects,
                          items: current.projects.items.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, [key]: value } : item,
                          ),
                        },
                      }))
                    }
                  />
                ))}
              </div>
              <Field
                multiline
                label="description"
                value={project.description}
                onChange={(value) =>
                  patchDict((current) => ({
                    ...current,
                    projects: {
                      ...current.projects,
                      items: current.projects.items.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: value } : item,
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patchDict((current) => ({
                ...current,
                projects: { ...current.projects, items: [...current.projects.items, emptyProject] },
              }))
            }
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Añadir proyecto
          </button>
        </Section>

        <Section title="Habilidades">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Etiqueta" value={dict.skills.label} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, label: value } }))} />
            <Field label="Foco" value={dict.skills.focus} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, focus: value } }))} />
            <Field label="Título" value={dict.skills.titlePre} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, titlePre: value } }))} />
            <Field label="Título destacado" value={dict.skills.titleHighlight} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, titleHighlight: value } }))} />
          </div>
          <Field multiline label="Intro" value={dict.skills.intro} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, intro: value } }))} />
          <Field label="Dominio" value={dict.skills.proficiency} onChange={(value) => patchDict((current) => ({ ...current, skills: { ...current.skills, proficiency: value } }))} />
          {dict.skills.groups.map((group, index) => (
            <div key={`${group.title}-${index}`} className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-destructive"
                  onClick={() =>
                    patchDict((current) => ({
                      ...current,
                      skills: {
                        ...current.skills,
                        groups: current.skills.groups.filter((_, itemIndex) => itemIndex !== index),
                      },
                    }))
                  }
                >
                  Quitar grupo
                </button>
              </div>
              <Field
                label="Grupo"
                value={group.title}
                onChange={(value) =>
                  patchDict((current) => ({
                    ...current,
                    skills: {
                      ...current.skills,
                      groups: current.skills.groups.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, title: value } : item,
                      ),
                    },
                  }))
                }
              />
              <Chips
                label="Skills"
                values={group.skills}
                onChange={(skills) =>
                  patchDict((current) => ({
                    ...current,
                    skills: {
                      ...current.skills,
                      groups: current.skills.groups.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, skills } : item,
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patchDict((current) => ({
                ...current,
                skills: {
                  ...current.skills,
                  groups: [...current.skills.groups, { title: 'Nuevo', skills: [] }],
                },
              }))
            }
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Añadir grupo
          </button>
        </Section>

        <Section title="Experiencia">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Etiqueta" value={dict.experience.label} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, label: value } }))} />
            <Field label="Título" value={dict.experience.titlePre} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, titlePre: value } }))} />
            <Field label="Título destacado" value={dict.experience.titleHighlight} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, titleHighlight: value } }))} />
          </div>
          {dict.experience.jobs.map((job, index) => (
            <div key={`${job.role}-${index}`} className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: moveItem(current.experience.jobs, index, -1) } }))}>Subir</button>
                <button type="button" onClick={() => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: moveItem(current.experience.jobs, index, 1) } }))}>Bajar</button>
                <button type="button" className="text-destructive" onClick={() => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: current.experience.jobs.filter((_, itemIndex) => itemIndex !== index) } }))}>Quitar</button>
              </div>
              <Field label="Rol" value={job.role} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: current.experience.jobs.map((item, itemIndex) => itemIndex === index ? { ...item, role: value } : item) } }))} />
              <Field label="Periodo" value={job.period} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: current.experience.jobs.map((item, itemIndex) => itemIndex === index ? { ...item, period: value } : item) } }))} />
              <Chips label="Tags" values={job.tags} onChange={(tags) => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: current.experience.jobs.map((item, itemIndex) => itemIndex === index ? { ...item, tags } : item) } }))} />
              <Field multiline label="Logro" value={job.highlight} onChange={(value) => patchDict((current) => ({ ...current, experience: { ...current.experience, jobs: current.experience.jobs.map((item, itemIndex) => itemIndex === index ? { ...item, highlight: value } : item) } }))} />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patchDict((current) => ({
                ...current,
                experience: { ...current.experience, jobs: [...current.experience.jobs, emptyJob] },
              }))
            }
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Añadir experiencia
          </button>
        </Section>

        <Section title="Contacto y pie">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Etiqueta" value={dict.contact.label} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, label: value } }))} />
            <Field label="Pie" value={dict.footer.builtWith} onChange={(value) => patchDict((current) => ({ ...current, footer: { ...current.footer, builtWith: value } }))} />
            <Field label="Título" value={dict.contact.titlePre} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, titlePre: value } }))} />
            <Field label="Título destacado" value={dict.contact.titleHighlight} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, titleHighlight: value } }))} />
          </div>
          <Field multiline label="Intro" value={dict.contact.intro} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, intro: value } }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nombre" value={dict.contact.name} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, name: value } }))} />
            <Field label="Email" value={dict.contact.email} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, email: value } }))} />
            <Field label="Mensaje" value={dict.contact.message} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, message: value } }))} />
            <Field label="Enviar" value={dict.contact.send} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, send: value } }))} />
            <Field label="Enviado" value={dict.contact.sending} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, sending: value } }))} />
            <Field label="Error" value={dict.contact.error} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, error: value } }))} />
            <Field label="Asunto" value={dict.contact.subject} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, subject: value } }))} />
          </div>
          <Field multiline label="Texto de autorización (checkbox)" value={dict.contact.consent} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, consent: value } }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Enlace a la política" value={dict.contact.consentLink} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, consentLink: value } }))} />
            <Field label="Enlace en el pie" value={dict.footer.privacy} onChange={(value) => patchDict((current) => ({ ...current, footer: { ...current.footer, privacy: value } }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['name', 'Error: nombre'],
                ['email', 'Error: correo'],
                ['message', 'Error: mensaje'],
                ['consent', 'Error: autorización'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label} value={dict.contact.errors[key]} onChange={(value) => patchDict((current) => ({ ...current, contact: { ...current.contact, errors: { ...current.contact.errors, [key]: value } } }))} />
            ))}
          </div>
        </Section>

        <Section title="Privacidad">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Título" value={dict.privacy.title} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, title: value } }))} />
            <Field label="Vigencia" value={dict.privacy.updated} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, updated: value } }))} />
            <Field label="Volver" value={dict.privacy.back} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, back: value } }))} />
          </div>
          <Field multiline label="Introducción" value={dict.privacy.intro} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, intro: value } }))} />
          {dict.privacy.sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => patchDict((current) => ({ ...current, privacy: { ...current.privacy, sections: moveItem(current.privacy.sections, index, -1) } }))}>Subir</button>
                <button type="button" onClick={() => patchDict((current) => ({ ...current, privacy: { ...current.privacy, sections: moveItem(current.privacy.sections, index, 1) } }))}>Bajar</button>
                <button type="button" className="text-destructive" onClick={() => patchDict((current) => ({ ...current, privacy: { ...current.privacy, sections: current.privacy.sections.filter((_, itemIndex) => itemIndex !== index) } }))}>Quitar</button>
              </div>
              <Field label="Título de sección" value={section.title} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, sections: current.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) } }))} />
              <Field multiline label="Texto" value={section.body} onChange={(value) => patchDict((current) => ({ ...current, privacy: { ...current.privacy, sections: current.privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, body: value } : item) } }))} />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patchDict((current) => ({
                ...current,
                privacy: {
                  ...current.privacy,
                  sections: [...current.privacy.sections, { title: 'Nueva sección', body: '' }],
                },
              }))
            }
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            Añadir sección
          </button>
        </Section>
      </div>
    </main>
  )
}
