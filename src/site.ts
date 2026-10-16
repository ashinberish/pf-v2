// Single source of truth for site content and SEO metadata.
// The public URL comes from VITE_SITE_URL (see .env).

export const site = {
  url: (import.meta.env.VITE_SITE_URL as string).replace(/\/$/, ''),
  name: 'Ashin Berish',
  role: 'Software Engineer',
  company: 'Excelencia iTech Consulting',
  location: 'Chennai, India',
  caption: 'Turning coffee into code since 2022.',
  startYear: 2022,
  skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'Frontend Engineering', 'UI Motion'],
  statement: [
    { text: 'Coding wizard by day, caffeine-fueled debugger by night. I build web interfaces that feel' },
    { text: 'fast,', em: true },
    { text: 'look sharp and hold up in production.' },
  ],
  experience: [
    {
      title: 'Software Engineer',
      company: 'Excelencia iTech Consulting',
      place: 'Chennai',
      start: '2022-04',
      startLabel: 'Apr 2022',
      endLabel: 'Present',
      current: true,
      href: 'https://www.linkedin.com/in/ashin-berish/',
    },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/ashinberish' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ashin-berish/' },
    { label: 'X / Twitter', href: 'https://twitter.com/ashinberish' },
    { label: 'Instagram', href: 'https://www.instagram.com/_ashx.n/' },
  ],
}
