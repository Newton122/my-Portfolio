export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  /** Optional case-study notes — one or two sentences each. */
  built?: string
  learned?: string
  tech: string[]
  github: string
  demo: string | null
  /** Screenshot in /public. Optional — a title card is shown without one. */
  image?: string
  imageAlt: string
}

/* To add a project: copy the template at the bottom of this list,
   put a screenshot in /public, and fill it in. The French page reuses
   these entries automatically — add a translation in
   translations/fr.ts (same slug) only if you want one. */
export const PROJECTS: Project[] = [
  {
    slug: 'careerlens',
    title: 'CareerLens AI',
    tagline: 'AI career intelligence platform',
    description:
      'Analyzes a CV against a job description with LLMs and semantic embeddings to find skill matches, gaps and areas to improve.',
    built:
      'Upload a CV and a job description: Gemini extracts the key information, Sentence Transformers embeddings match the CV to the job, and a FastAPI + PostgreSQL backend stores users, jobs, CVs and results.',
    tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Google Gemini', 'Sentence Transformers', 'Python'],
    github: 'https://github.com/Newton122',
    demo: 'https://career-lens-taupe.vercel.app/',
    image: '/careerlens.png',
    imageAlt: 'CareerLens AI landing page',
  },
  {
    slug: 'newguard-ai',
    title: 'NewGuard AI',
    tagline: 'Fake news detection with BERT',
    description:
      'Paste an article or a link and it tells you if the news is likely real or fake, how confident it is, and why.',
    built:
      'A fine-tuned BERT model combined with source credibility checks and writing-style analysis, served by FastAPI. Every result lists the warning signs it found, is saved to PostgreSQL, and can be exported as a PDF report.',
    tech: ['Next.js', 'FastAPI', 'PyTorch', 'Hugging Face Transformers', 'BERT', 'PostgreSQL', 'Python'],
    github: 'https://github.com/Newton122/NewGuard-AI',
    demo: null,
    imageAlt: 'NewGuard AI',
  },
  {
    slug: 'unitrans',
    title: 'Unitrans',
    tagline: 'University transport platform',
    description:
      'A transport management system for the university, with separate views for managers, drivers and students.',
    built:
      'A PostgreSQL backend with a manager dashboard for routes and schedules, plus simple views for drivers and students.',
    learned: 'A clean database schema makes everything after it easier.',
    tech: ['Next.js', 'Django', 'PostgreSQL'],
    github: 'https://github.com/Newton122',
    demo: null,
    image: '/managerdash.png',
    imageAlt: 'Unitrans manager dashboard',
  },
  {
    slug: 'smart-task-tracker',
    title: 'Smart Task Tracker',
    tagline: 'Full-stack task manager',
    description: 'A MERN task manager with login, drag-and-drop boards and saved progress.',
    built: 'React frontend, Node/Express API, MongoDB and JWT authentication.',
    learned: 'Keeping the UI and the server in sync when things move fast.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'],
    github: 'https://github.com/Newton122',
    demo: 'https://full-stack-task-tracker-app-fronten.vercel.app/',
    image: '/SmartTask.png',
    imageAlt: 'Smart Task Tracker board',
  },
  {
    slug: 'bookverse',
    title: 'BookVerse',
    tagline: 'Book library interface',
    description: 'A frontend for browsing books, filtering collections and keeping a reading list.',
    built: 'React and Tailwind CSS, with fast search and filters.',
    learned: 'Small details — empty states, loading states — matter a lot.',
    tech: ['React', 'Tailwind CSS'],
    github: 'https://github.com/Newton122',
    demo: 'https://book-library-system-frontend.vercel.app/',
    image: '/Bookverse.png',
    imageAlt: 'BookVerse library interface',
  },
  {
    slug: 'portfolio-site',
    title: 'This portfolio',
    tagline: 'Personal website',
    description: 'The site you are on — built with Next.js, TypeScript and Tailwind CSS.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/Newton122',
    demo: null,
    image: '/img.jpg',
    imageAlt: 'Portfolio preview',
  },

  // ── Template ─────────────────────────────────────────────
  // {
  //   slug: 'my-new-project',
  //   title: 'Project name',
  //   tagline: 'What it is, in a few words',
  //   description: 'One sentence about what it does.',
  //   built: 'How you built it.',            // optional
  //   learned: 'What you learned.',          // optional
  //   tech: ['Python', 'Pandas', 'scikit-learn'],
  //   github: 'https://github.com/Newton122/repo',
  //   demo: null,                            // or a live URL
  //   image: '/my-screenshot.png',
  //   imageAlt: 'Short description of the screenshot',
  // },
]

/** Projects in the current language. French entries override the
 *  English ones by slug; anything without a translation stays English. */
export function localizeProjects(overrides?: Partial<Project>[] | null): Project[] {
  if (!overrides) return PROJECTS
  return PROJECTS.map((p) => ({ ...p, ...(overrides.find((o) => o.slug === p.slug) ?? {}) }))
}
