import { PROJECTS } from './projects'

const project = (slug: string) => PROJECTS.find((p) => p.slug === slug)!

export type TimelineType = 'education' | 'project' | 'learning'

export interface TimelineItem {
  type: TimelineType
  title: string
  org: string
  period: string
  description: string
  tags: string[]
}

export const EXPERIENCE_TIMELINE: TimelineItem[] = [
  {
    type: 'education',
    title: 'AI Engineering',
    org: 'USTHB',
    period: '2024 --- Present',
    description: 'Engineering degree focused on AI, data and computer science fundamentals.',
    tags: ['Academic', 'AI'],
  },
  {
    type: 'project',
    title: project('smart-task-tracker').title,
    org: 'Personal Project',
    period: '2024',
    description: project('smart-task-tracker').description,
    tags: project('smart-task-tracker').tech,
  },
  {
    type: 'project',
    title: project('bookverse').title,
    org: 'Personal Project',
    period: '2024',
    description: project('bookverse').description,
    tags: project('bookverse').tech,
  },
  {
    type: 'project',
    title: project('unitrans').title,
    org: 'Personal Project',
    period: '2025',
    description: project('unitrans').description,
    tags: project('unitrans').tech,
  },
  {
    type: 'learning',
    title: 'AI Department Member',
    org: 'Open Minds Club',
    period: 'Nov 2025 --- Present',
    description: 'Student tech club --- I work on AI projects and share what I learn.',
    tags: ['AI', 'Community'],
  },
  {
    type: 'learning',
    title: 'Aspire Program --- Organizational Leadership',
    org: 'Harvard Aspire Institute',
    period: 'Oct 2025 --- Dec 2025',
    description: 'Leadership program on teamwork, communication and planning.',
    tags: ['Leadership', 'Certificate'],
  },
]

export const COURSEWORK = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Database Systems',
  'Software Engineering',
  'Computer Networks',
  'Discrete Mathematics',
  'Object-Oriented Programming',
  'Web Development',
  'Linear Algebra',
  'Computer Architecture',
]
