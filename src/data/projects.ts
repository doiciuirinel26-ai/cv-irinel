export type Project = {
  id: string
  name: string
  description: string
  url: string
  tags: readonly string[]
  color: string
  favicon: string
}

export const PROJECTS: Project[] = [
  {
    id: 'cartflux',
    name: 'CartFlux',
    description:
      'Full-stack e-commerce platform with real-time inventory, analytics dashboard, and optimized checkout flows.',
    url: 'https://cartflux.eu',
    tags: ['Next.js', 'Supabase', 'Stripe'],
    color: '#22d3ee',
    favicon: 'https://www.google.com/s2/favicons?domain=cartflux.eu&sz=128',
  },
  {
    id: 'vantis',
    name: 'Vantis Boutique',
    description:
      'Premium fashion storefront with immersive product galleries, CMS-driven collections, and mobile-first UX.',
    url: 'https://vantis.boutique',
    tags: ['React', 'TypeScript', 'Tailwind'],
    color: '#fbbf24',
    favicon: 'https://www.google.com/s2/favicons?domain=vantis.boutique&sz=128',
  },
  {
    id: 'freegma',
    name: 'Freegma',
    description:
      'Community-driven gaming hub featuring live leaderboards, user profiles, and modular content modules.',
    url: 'https://freegma.vercel.app',
    tags: ['Next.js', 'Supabase', 'AI/ML'],
    color: '#a78bfa',
    favicon: 'https://www.google.com/s2/favicons?domain=freegma.vercel.app&sz=128',
  },
  {
    id: 'realist',
    name: 'Realist Reading',
    description:
      'AI-assisted reading companion with comprehension tools, progress tracking, and personalized study paths.',
    url: 'https://e-book-reader-nine.vercel.app',
    tags: ['React', 'AI/ML', 'ComfyUI'],
    color: '#60a5fa',
    favicon:
      'https://www.google.com/s2/favicons?domain=e-book-reader-nine.vercel.app&sz=128',
  },
  {
    id: 'luxury-temple',
    name: 'Luxury Temple',
    description:
      'VANTIS Obsidian Collection — luxury storefront with curated collections, bespoke experiences, and concierge-grade UX.',
    url: 'https://luxury-temple-2.vercel.app',
    tags: ['React', 'TypeScript', 'Tailwind'],
    color: '#d4af37',
    favicon:
      'https://www.google.com/s2/favicons?domain=luxury-temple-2.vercel.app&sz=128',
  },
  {
    id: 'luxury-temple-2',
    name: 'Luxury Temple2',
    description:
      'Premium AI Studio luxury prototype with immersive brand storytelling and refined dark-mode interface design.',
    url: 'https://luxury-temple.vercel.app',
    tags: ['React', 'AI/ML', 'Tailwind'],
    color: '#e7e5e4',
    favicon:
      'https://www.google.com/s2/favicons?domain=luxury-temple.vercel.app&sz=128',
  },
]
