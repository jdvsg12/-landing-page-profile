export type Lang = 'en' | 'es'

export type Project = {
  tag: string
  title: string
  subtitle: string
  description: string
  domain: string
  href: string
}

export type Job = {
  role: string
  period: string
  tags: string[]
  highlight: string
}

export type Dict = {
  nav: {
    about: string
    projects: string
    skills: string
    experience: string
    contact: string
    cv: string
    downloadCv: string
    hireMe: string
    toggleMenu: string
  }
  hero: {
    available: string
    role: string
    tools: string[]
    tagline: string
    seeWork: string
    contactMe: string
    downloadCv: string
    scroll: string
  }
  about: {
    label: string
    titlePre: string
    titleHighlight: string
    p1: string
    p2: string
    freelance: string
    remote: string
    fulltime: string
    stackLabel: string
    stack: string[]
    stats: { value: string; label: string }[]
  }
  projects: {
    label: string
    titlePre: string
    titleHighlight: string
    intro: string
    viewProject: string
    next: string
    items: Project[]
  }
  skills: {
    label: string
    titlePre: string
    titleHighlight: string
    intro: string
    groups: { title: string; skills: string[] }[]
    proficiency: string
    focus: string
  }
  experience: {
    label: string
    titlePre: string
    titleHighlight: string
    jobs: Job[]
  }
  contact: {
    label: string
    titlePre: string
    titleHighlight: string
    intro: string
    name: string
    email: string
    message: string
    send: string
    sending: string
    subject: string
    error: string
    consent: string
    consentLink: string
    errors: {
      name: string
      email: string
      message: string
      consent: string
    }
  }
  footer: {
    builtWith: string
    privacy: string
  }
  privacy: {
    title: string
    updated: string
    intro: string
    sections: { title: string; body: string }[]
    back: string
  }
}

export type Profile = {
  name: string
  firstName: string
  lastName: string
  mark: string
  siteLabel: string
  email: string
  phone: string
  phoneHref: string
  github: string
  githubLabel: string
  linkedin: string
  linkedinLabel: string
  cvEn: string
  cvEs: string
}

export type SiteContent = {
  profile: Profile
  en: Dict
  es: Dict
}
