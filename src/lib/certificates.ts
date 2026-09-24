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
  {
    slug: 'ai-essentials-certificate',
    title: 'AI Essentials',
    subtitle: 'Artificial intelligence fundamentals',
    description: 'A certificate focused on core artificial intelligence concepts and the foundations behind modern AI systems.',
    previewType: 'pdf',
    preview: '/AI Essentials.pdf',
    previewLabel: 'AI Essentials certificate',
    logo: '/half.png',
    date: '2026',
    externalUrl: '/AI Essentials.pdf',
    file: '/AI Essentials.pdf',
  },
  {
    slug: 'ai-and-machine-learning-certificate',
    title: 'AI & Machine Learning',
    subtitle: 'AI and machine learning coursework',
    description: 'Coursework covering artificial intelligence and machine learning concepts, methods, and practical applications.',
    previewType: 'pdf',
    preview: '/AI&ML.pdf',
    previewLabel: 'AI and Machine Learning certificate',
    logo: '/half.png',
    date: '2026',
    externalUrl: '/AI&ML.pdf',
    file: '/AI&ML.pdf',
  },
  {
    slug: 'nextjs-certificate',
    title: 'Next.js Certificate',
    subtitle: 'Web development certification',
    description: 'A certificate focused on building modern web applications with Next.js and the React ecosystem.',
    previewType: 'pdf',
    preview: '/Next.js.pdf',
    previewLabel: 'Next.js certificate',
    logo: '/half.png',
    date: '2026',
    externalUrl: '/Next.js.pdf',
    file: '/Next.js.pdf',
  },
]
