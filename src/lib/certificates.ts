export type Certificate = {
  slug: string
  title: string
  subtitle: string
  description: string
  previewType: 'image' | 'pdf'
  preview: string
  previewLabel?: string
  logo: string
  date: string
  externalUrl: string
  file?: string
}

export const CERTIFICATES: Certificate[] = [
  {
    slug: 'sql-certificate',
    title: 'SQL Certification',
    subtitle: 'Professional certification',
    description: 'A complete SQL certification with practical use cases, query optimization, and database design best practices.',
    previewType: 'image',
    preview: '/SQL_cert.png',
    previewLabel: 'SQL certification badge',
    logo: '/half.png',
    date: 'June 2026',
    externalUrl: 'https://www.coursera.org/account/accomplishments/verify/5X3FCFK9TNJJ',
  },
  {
    slug: 'ai-school-training',
    title: 'AI School Training',
    subtitle: 'Advanced AI coursework',
    description: 'A focused AI training certificate covering machine learning concepts, model development, and practical applications.',
    previewType: 'image',
    preview: '/MATIKITI_Brighton.png',
    logo: '/half.png',
    date: 'Feb 2026',
    externalUrl: 'https://www.linkedin.com/in/brighton-matikiti',
  },
  {
    slug: 'aspire-leadership-program',
    title: 'Aspire Leadership Certificate',
    subtitle: 'Organizational leadership program',
    description: 'Certificate awarded for completing the Aspire leadership program, focused on collaboration, planning, and team leadership.',
    previewType: 'image',
    preview: '/aspire.png',
    previewLabel: 'Aspire certificate badge',
    logo: '/half.png',
    date: 'Dec 2025',
    externalUrl: 'https://www.linkedin.com/in/brighton-matikiti',
  },
]
