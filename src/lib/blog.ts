export interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  category: string
  excerpt: string
  body: string
  tags: string[]
  image?: string
  imageAlt?: string
}

// Starter posts - written to match the real focus areas (backend, databases, AI
// curiosity) without inventing specific claims. Swap these for your own writing
// whenever you're ready; the structure (category, tags, markdown-style **headers**
// in body) is built to make that easy.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'representing-openminds-at-a-job-summit',
    title: 'Representing OpenMinds at a Job Summit',
    date: 'September 2026',
    readTime: '3 min read',
    category: 'Community',
    excerpt:
      'A day spent representing OpenMinds as a staff member at a job summit, connecting a student tech community with people thinking seriously about what comes next.',
    body: `Representing OpenMinds at a job summit gave me a different view of what it means to build a community around technology. For the day, I was not only attending as a student - I was helping carry the club's presence into a room filled with students, professionals and organizations.

**Showing up with purpose**

Being part of the staff meant welcoming people, explaining what OpenMinds does and making the club feel approachable to anyone curious about technology. Small conversations mattered: a question about the club could become someone's first step toward joining a project, learning a new skill or meeting people with similar interests.

**Learning outside the classroom**

Job summits make the connection between learning and opportunity feel concrete. You hear what teams are looking for, how people describe their work and which skills help conversations move forward. That perspective is useful as I continue growing toward data, AI and full-stack engineering.

**What I am taking forward**

The experience reinforced something I already value: technical growth is stronger when it is shared. Representing OpenMinds reminded me that community work is also engineering work in a broader sense - listening carefully, making connections and helping useful ideas reach more people.`,
    tags: ['OpenMinds', 'Community', 'Career'],
    image: '/openminds.jpg',
    imageAlt: 'Brighton representing OpenMinds at a job summit',
  },
  {
    slug: 'thinking-about-schema-before-code',
    title: 'Why I Sketch the Schema Before Writing Any Code',
    date: 'July 2026',
    readTime: '4 min read',
    category: 'Database',
    excerpt:
      'The biggest slowdowns in my projects rarely come from a missing feature - they come from a data shape that made a simple question expensive to answer.',
    body: `Most of the friction I have run into on past projects did not come from a missing feature. It came from a table shape that made a simple question expensive to answer.

**The contract matters more than the code**

When I start a new project now, I sketch the entities the same way I would sketch a screen: what does someone actually need to see or ask, and what is the smallest set of relationships that gets them there without five joins.

**Slower on day one, faster every day after**

It slows down the very first day, because you are resisting the urge to just start writing routes. But it pays for itself almost immediately - migrations get simpler, queries get shorter, and the frontend stops fighting the backend's shape.

**What I am still working on**

Indexing strategy and knowing when a denormalized read model is actually the right call instead of forcing everything into third normal form out of habit.`,
    tags: ['PostgreSQL', 'Database Design'],
  },
  {
    slug: 'lessons-building-authenticated-apps',
    title: 'What Building an Authenticated App Taught Me About State',
    date: 'June 2026',
    readTime: '5 min read',
    category: 'Backend',
    excerpt:
      'Adding real authentication and draggable state to a MERN app surfaced problems tutorials never mention - mostly around what happens when things happen out of order.',
    body: `Tutorials make authentication look like a solved problem: hash the password, sign a token, done. The part they skip is everything that happens after - what your UI should do while a request is in flight, and what happens when two updates land out of order.

**Optimistic updates are a tradeoff, not a default**

Updating the UI before the server confirms makes an app feel instant, but it means you need a clear plan for what happens when the server disagrees. I did not have that plan the first time, and it showed.

**JWTs solve authentication, not authorization**

A valid token tells you who someone is. It does not tell you what they are allowed to do. Keeping those two concerns separate in the code made permission bugs much easier to find.

**What's next**

Looking more closely at refresh token rotation and session invalidation - the parts of auth that only matter once something goes wrong.`,
    tags: ['Node.js', 'Authentication', 'MERN'],
  },
  {
    slug: 'why-im-studying-ai-as-a-backend-developer',
    title: "Why I'm Studying AI as a Backend-Leaning Developer",
    date: 'May 2026',
    readTime: '4 min read',
    category: 'AI/ML',
    excerpt:
      "I'm not trying to become a machine learning researcher. Here's the honest reason I'm spending time on it anyway.",
    body: `I write backend code by instinct - APIs, databases, the systems underneath an app. So why spend time studying machine learning?

**AI is becoming infrastructure**

The same way understanding how a database works makes you a better engineer even if you are not a DBA, understanding how models are trained and where they fail makes you a better engineer even if you never train one professionally.

**The practical shape of the work**

Most of what I have studied so far is less about the models themselves and more about the data around them - cleaning, transforming, and preparing data is most of the actual work in any real system.

**What I expect**

I do not expect to become a deep learning researcher. I expect to become someone who can reason clearly about intelligent systems, build the pipelines that move data to and from them, and work well with people who specialize in this area.`,
    tags: ['AI', 'Machine Learning', 'Career'],
  },
]
