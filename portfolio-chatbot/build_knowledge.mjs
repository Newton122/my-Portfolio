// Builds knowledge.json for the chatbot from the site's real data files.
// Run from anywhere: `node portfolio-chatbot/build_knowledge.mjs`
// (main.py also runs it automatically when the source files change).
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const ts = createRequire(join(ROOT, 'package.json'))('typescript')

const MODULES = {
  projects: 'src/lib/projects.ts',
  experience: 'src/lib/experience.ts',
  skills: 'src/lib/skills.ts',
  certificates: 'src/lib/certificates.ts',
  blog: 'src/lib/blog.ts',
  en: 'src/translations/en.ts',
}

async function loadModules() {
  const dir = mkdtempSync(join(tmpdir(), 'chat-kb-'))
  try {
    for (const [name, rel] of Object.entries(MODULES)) {
      const source = readFileSync(join(ROOT, rel), 'utf8')
      let js = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText
      js = js.replace(/from\s+['"](?:\.\/|@\/lib\/)(\w+)['"]/g, "from './$1.mjs'")
      writeFileSync(join(dir, `${name}.mjs`), js)
    }
    const out = {}
    for (const name of Object.keys(MODULES)) {
      out[name] = await import(pathToFileURL(join(dir, `${name}.mjs`)).href)
    }
    return out
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function readConst(file, name) {
  const text = readFileSync(join(ROOT, file), 'utf8')
  return text.match(new RegExp(`const ${name}\\s*=\\s*['"]([^'"]+)['"]`))?.[1] ?? null
}

const lines = (...parts) => parts.filter(Boolean).join('\n')

const { projects, experience, skills, certificates, blog, en } = await loadModules()
const t = en.default
const email = readConst('src/app/contact/page.tsx', 'EMAIL')
const github = readConst('src/app/contact/page.tsx', 'GITHUB_URL')
const linkedin = readConst('src/app/contact/page.tsx', 'LINKEDIN_URL')

const docs = []
const add = (id, section, title, url, text) => docs.push({ id, section, title, url, text })

add('profile', 'about', 'About Brighton', '/about', lines(
  t.about.intro1, t.about.intro2, t.about.intro3, t.about.intro4,
  `Roles: ${t.home.roles.join(', ')}.`,
  t.home.description,
  `Status: ${t.home.badge}.`,
  `Values: ${t.about.honesty} - ${t.about.honestyBody} ${t.about.depth} - ${t.about.depthBody} ${t.about.building} - ${t.about.buildingBody}`,
  `How he works: ${t.philosophy.cards.map((c) => `${c.title} (${c.body})`).join('; ')}.`,
))

add('contact', 'contact', 'Contact & availability', '/contact', lines(
  t.contact.subtitle,
  email && `Email: ${email}`,
  github && `GitHub: ${github}`,
  linkedin && `LinkedIn: ${linkedin}`,
  `Location: ${t.contact.location}`,
  `Looking for: ${t.now.lookingFor}`,
  t.cta.description,
  'Visitors can also use the contact form on the /contact page. A resume can be downloaded from the home page.',
))

for (const p of projects.PROJECTS) {
  add(`project-${p.slug}`, 'projects', `Project: ${p.title}`, '/projects', lines(
    `${p.title} - ${p.tagline}.`,
    p.description,
    p.built && `How it was built: ${p.built}`,
    p.learned && `What he learned: ${p.learned}`,
    `Tech stack: ${p.tech.join(', ')}.`,
    `Code: ${p.github}`,
    p.demo ? `Live demo: ${p.demo}` : 'No public live demo.',
  ))
}

add('projects-overview', 'projects', 'All projects', '/projects', lines(
  `Brighton has ${projects.PROJECTS.length} projects on the site:`,
  ...projects.PROJECTS.map((p) => `- ${p.title}: ${p.tagline} (${p.tech.join(', ')})`),
))

add('skills', 'skills', 'Skills', '/skills', lines(
  ...Object.entries(skills.SKILLS).map(([cat, list]) => `${cat}: ${list.join(', ')}.`),
))

const timeline = experience.EXPERIENCE_TIMELINE
add('experience', 'experience', 'Experience timeline', '/experience', lines(
  ...timeline.map((e) => `- ${e.title} at ${e.org} (${e.period}): ${e.description} [${e.tags.join(', ')}]`),
))
for (const e of timeline.filter((e) => e.type !== 'project')) {
  add(`exp-${e.title.toLowerCase().replace(/\W+/g, '-')}`, e.type, e.title, '/experience',
    `${e.title} - ${e.org}, ${e.period}. ${e.description} Tags: ${e.tags.join(', ')}.`)
}

add('education', 'education', 'Education', '/education', lines(
  `${t.education.degree} at USTHB (Algiers) - ${t.education.degreeType}, ${t.education.status.toLowerCase()} (2024 - present).`,
  `Coursework: ${experience.COURSEWORK.join(', ')}.`,
  `${t.education.interests.title1}: ${t.education.interests.text1}`,
  `${t.education.interests.title2}: ${t.education.interests.text2}`,
))

add('certificates', 'certificates', 'Certificates', '/testimonials', lines(
  ...certificates.CERTIFICATES.map((c) => `- ${c.title} (${c.subtitle}, ${c.date}): ${c.description} Verify: ${c.externalUrl}`),
))

add('now', 'now', 'What he is doing now', '/now', lines(
  t.now.lastUpdated + '.',
  `Learning: ${t.now.learningData.map((l) => `${l.topic} (${l.detail})`).join('; ')}.`,
  'Building: new data and AI projects, coming soon to the Projects page.',
  `Reading: ${t.now.readingData.map((r) => `${r.title} by ${r.author}`).join('; ')}.`,
  `Looking for: ${t.now.lookingFor}`,
))

for (const post of blog.BLOG_POSTS) {
  add(`blog-${post.slug}`, 'blog', `Blog post: ${post.title}`, `/blog`, lines(
    `"${post.title}" (${post.category}, ${post.date}, ${post.readTime}). Tags: ${post.tags.join(', ')}.`,
    post.excerpt,
    post.body.replace(/\*\*/g, ''),
  ))
}

writeFileSync(join(HERE, 'knowledge.json'), JSON.stringify({ generated: new Date().toISOString(), docs }, null, 2))
console.log(`knowledge.json: ${docs.length} documents`)
