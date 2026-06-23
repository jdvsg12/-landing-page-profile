'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'es'

type Project = {
  tag: string
  title: string
  subtitle: string
  description: string
  domain: string
  href: string
}

type Job = {
  role: string
  period: string
  tags: string[]
  highlight: string
}

type Dict = {
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
    stats: { value: string; label: string }[]
  }
  projects: {
    label: string
    titlePre: string
    titleHighlight: string
    intro: string
    viewProject: string
    items: Project[]
  }
  skills: {
    label: string
    titlePre: string
    titleHighlight: string
    intro: string
    groups: { title: string; skills: string[] }[]
    proficiency: string
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
  }
  footer: {
    builtWith: string
  }
}

const en: Dict = {
  nav: {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Experience',
    contact: 'Contact',
    cv: 'CV',
    downloadCv: 'Download CV',
    hireMe: 'Hire me',
    toggleMenu: 'Toggle menu',
  },
  hero: {
    available: 'AVAILABLE FOR REMOTE WORK',
    role: 'Frontend Developer',
    tagline: '"I build fast, scalable interfaces that convert."',
    seeWork: 'See my work',
    contactMe: 'Contact me',
    downloadCv: 'Download CV',
    scroll: 'SCROLL',
  },
  about: {
    label: 'ABOUT',
    titlePre: 'Crafting digital',
    titleHighlight: 'experiences',
    p1: '4 years building end-to-end web products that combine clean architecture with measurable performance. Based in Colombia, working remotely with clients worldwide.',
    p2: 'Specialized in React, Next.js, and TypeScript ecosystems. My focus is on performance optimization, clean scalable architecture, and conversion-driven interfaces that deliver real business results.',
    freelance: 'Open to freelance',
    remote: 'Remote',
    fulltime: 'Full-time',
    stackLabel: '// STACK',
    stats: [
      { value: '4+', label: 'Years of experience' },
      { value: '10+', label: 'Projects delivered' },
      { value: '100%', label: 'Remote ready' },
      { value: 'Code', label: 'Passion for code' },
    ],
  },
  projects: {
    label: 'PROJECTS',
    titlePre: 'Selected',
    titleHighlight: 'work',
    intro:
      'Real projects, real impact. Each one built with performance and user experience at the core.',
    viewProject: 'View project',
    items: [
      {
        tag: 'Next.js',
        title: 'Eduardo Montenegro',
        subtitle: 'Professional Website · Next.js',
        description:
          'Landing page for a psychologist / psychoanalyst. Clean, minimalist design with multilingual support, contact forms and WhatsApp integration.',
        domain: 'eduardomontenegro.com',
        href: 'https://eduardomontenegro.com',
      },
      {
        tag: 'SaaS',
        title: 'ALUVE Windows App',
        subtitle: 'Web Application · Next.js · TypeScript',
        description:
          'SaaS tool for aluminum window manufacturers. Features: project management, window dimension calculator, cut optimization and professional PDF quote generation.',
        domain: 'windows-app-lx87.vercel.app',
        href: 'https://windows-app-lx87.vercel.app',
      },
      {
        tag: 'WordPress',
        title: 'Bretaña Colombia',
        subtitle: 'Informational Website · WordPress · Elementor',
        description:
          'Maintenance and optimization of an informational corporate site built with WordPress and Elementor. Performance improvements, bug fixing and Core Web Vitals tuning.',
        domain: 'bretana.com.co',
        href: 'https://bretana.com.co',
      },
    ],
  },
  skills: {
    label: 'SKILLS',
    titlePre: 'Tech',
    titleHighlight: 'stack',
    intro:
      'Tools and technologies I use to build modern, scalable web applications.',
    groups: [
      {
        title: 'Frontend',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'ShadCN'],
      },
      {
        title: 'Backend',
        skills: ['NestJS', 'Node.js', 'PostgreSQL', 'REST APIs', 'TypeORM'],
      },
      {
        title: 'Cloud & DevOps',
        skills: ['GCP', 'Azure', 'Docker', 'GitHub Actions CI/CD'],
      },
      {
        title: 'Tools',
        skills: ['Git', 'Webpack', 'Supabase', 'Headless CMS'],
      },
    ],
    proficiency: '// PROFICIENCY',
  },
  experience: {
    label: 'EXPERIENCE',
    titlePre: 'My',
    titleHighlight: 'journey',
    jobs: [
      {
        role: 'Fullstack Developer — Valere',
        period: 'Jul 2025 – Present | Remote',
        tags: ['NestJS', 'PostgreSQL', 'GCP', 'Azure Functions', 'Python'],
        highlight:
          'Architecture design, RESTful APIs, automated data pipelines, landing pages with Next.js.',
      },
      {
        role: 'Frontend Developer — Flare BBDO',
        period: 'Oct 2022 – May 2025 | Bogotá',
        tags: ['Next.js', 'React', 'Tailwind CSS', 'ShadCN', 'Headless CMS'],
        highlight:
          'Email platform automation (-50% delivery time), reusable component library, accessible UI.',
      },
      {
        role: 'Frontend Developer — Ariatel SARL',
        period: 'Jul 2021 – Jul 2022 | Bogotá',
        tags: ['React', 'TypeScript', 'Webpack'],
        highlight:
          'Class to functional component migration, microfrontend optimization (+30% performance).',
      },
    ],
  },
  contact: {
    label: 'CONTACT',
    titlePre: "Let's build something",
    titleHighlight: 'together',
    intro: 'Open to freelance projects, remote full-time, and collaborations.',
    name: 'Your Name',
    email: 'Your Email',
    message: 'Your Message',
    send: 'Send Message',
    sending: 'Sent!',
    subject: 'Contact from',
    error: 'Failed to send',
  },
  footer: {
    builtWith: 'Frontend Developer · Built with',
  },
}

const es: Dict = {
  nav: {
    about: 'Sobre mí',
    projects: 'Proyectos',
    skills: 'Habilidades',
    experience: 'Experiencia',
    contact: 'Contacto',
    cv: 'CV',
    downloadCv: 'Descargar CV',
    hireMe: 'Contrátame',
    toggleMenu: 'Abrir menú',
  },
  hero: {
    available: 'DISPONIBLE PARA TRABAJO REMOTO',
    role: 'Desarrollador Frontend',
    tagline: '"Construyo interfaces rápidas y escalables que convierten."',
    seeWork: 'Ver mi trabajo',
    contactMe: 'Contáctame',
    downloadCv: 'Descargar CV',
    scroll: 'DESLIZA',
  },
  about: {
    label: 'SOBRE MÍ',
    titlePre: 'Creando experiencias',
    titleHighlight: 'digitales',
    p1: '4 años construyendo productos web de extremo a extremo que combinan una arquitectura limpia con un rendimiento medible. Radicado en Colombia, trabajando de forma remota con clientes de todo el mundo.',
    p2: 'Especializado en los ecosistemas de React, Next.js y TypeScript. Mi enfoque está en la optimización del rendimiento, una arquitectura limpia y escalable, e interfaces orientadas a la conversión que generan resultados reales de negocio.',
    freelance: 'Disponible para freelance',
    remote: 'Remoto',
    fulltime: 'Tiempo completo',
    stackLabel: '// STACK',
    stats: [
      { value: '4+', label: 'Años de experiencia' },
      { value: '10+', label: 'Proyectos entregados' },
      { value: '100%', label: 'Listo para remoto' },
      { value: 'Code', label: 'Pasión por el código' },
    ],
  },
  projects: {
    label: 'PROYECTOS',
    titlePre: 'Trabajo',
    titleHighlight: 'seleccionado',
    intro:
      'Proyectos reales, impacto real. Cada uno construido con el rendimiento y la experiencia de usuario como prioridad.',
    viewProject: 'Ver proyecto',
    items: [
      {
        tag: 'Next.js',
        title: 'Eduardo Montenegro',
        subtitle: 'Sitio web profesional · Next.js',
        description:
          'Landing page para un psicólogo / psicoanalista. Diseño limpio y minimalista con soporte multilenguaje, formularios de contacto e integración con WhatsApp.',
        domain: 'eduardomontenegro.com',
        href: 'https://eduardomontenegro.com',
      },
      {
        tag: 'SaaS',
        title: 'ALUVE Windows App',
        subtitle: 'Aplicación web · Next.js · TypeScript',
        description:
          'Herramienta SaaS para fabricantes de ventanas de aluminio. Funcionalidades: gestión de proyectos, calculadora de dimensiones, optimización de cortes y generación de cotizaciones profesionales en PDF.',
        domain: 'windows-app-lx87.vercel.app',
        href: 'https://windows-app-lx87.vercel.app',
      },
      {
        tag: 'WordPress',
        title: 'Bretaña Colombia',
        subtitle: 'Sitio web informativo · WordPress · Elementor',
        description:
          'Mantenimiento y optimización de un sitio corporativo informativo construido con WordPress y Elementor. Mejoras de rendimiento, corrección de errores y optimización de Core Web Vitals.',
        domain: 'bretana.com.co',
        href: 'https://bretana.com.co',
      },
    ],
  },
  skills: {
    label: 'HABILIDADES',
    titlePre: 'Stack',
    titleHighlight: 'tecnológico',
    intro:
      'Herramientas y tecnologías que uso para construir aplicaciones web modernas y escalables.',
    groups: [
      {
        title: 'Frontend',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'ShadCN'],
      },
      {
        title: 'Backend',
        skills: ['NestJS', 'Node.js', 'PostgreSQL', 'REST APIs', 'TypeORM'],
      },
      {
        title: 'Cloud & DevOps',
        skills: ['GCP', 'Azure', 'Docker', 'GitHub Actions CI/CD'],
      },
      {
        title: 'Herramientas',
        skills: ['Git', 'Webpack', 'Supabase', 'Headless CMS'],
      },
    ],
    proficiency: '// DOMINIO',
  },
  experience: {
    label: 'EXPERIENCIA',
    titlePre: 'Mi',
    titleHighlight: 'trayectoria',
    jobs: [
      {
        role: 'Desarrollador Fullstack — Valere',
        period: 'Jul 2025 – Presente | Remoto',
        tags: ['NestJS', 'PostgreSQL', 'GCP', 'Azure Functions', 'Python'],
        highlight:
          'Diseño de arquitectura, APIs RESTful, pipelines de datos automatizados, landing pages con Next.js.',
      },
      {
        role: 'Desarrollador Frontend — Flare BBDO',
        period: 'Oct 2022 – May 2025 | Bogotá',
        tags: ['Next.js', 'React', 'Tailwind CSS', 'ShadCN', 'Headless CMS'],
        highlight:
          'Automatización de plataforma de emails (-50% en tiempo de entrega), librería de componentes reutilizables, UI accesible.',
      },
      {
        role: 'Desarrollador Frontend — Ariatel SARL',
        period: 'Jul 2021 – Jul 2022 | Bogotá',
        tags: ['React', 'TypeScript', 'Webpack'],
        highlight:
          'Migración de componentes de clase a funcionales, optimización de microfrontend (+30% de rendimiento).',
      },
    ],
  },
  contact: {
    label: 'CONTACTO',
    titlePre: 'Construyamos algo',
    titleHighlight: 'juntos',
    intro:
      'Disponible para proyectos freelance, tiempo completo remoto y colaboraciones.',
    name: 'Tu nombre',
    email: 'Tu correo',
    message: 'Tu mensaje',
    send: 'Enviar mensaje',
    sending: '¡Enviado!',
    subject: 'Contacto de',
    error: 'Error al enviar',
  },
  footer: {
    builtWith: 'Desarrollador Frontend · Hecho con',
  },
}

const dictionaries: Record<Lang, Dict> = { en, es }

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: Dict
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'jv-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null
    if (stored === 'en' || stored === 'es') {
      setLangState(stored)
    } else if (navigator.language.toLowerCase().startsWith('es')) {
      setLangState('es')
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  const toggle = () => setLang(lang === 'en' ? 'es' : 'en')

  return (
    <I18nContext.Provider
      value={{ lang, setLang, toggle, t: dictionaries[lang] }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within a LanguageProvider')
  }
  return ctx
}
