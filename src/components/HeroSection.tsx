import { useRef } from 'react'
import { AvatarScene } from './AvatarScene'
import { useHeroScroll } from '../hooks/useHeroScroll'

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useHeroScroll(heroRef)

  return (
    <section
      ref={heroRef}
      className="hero-section relative w-full overflow-hidden bg-surface"
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(99,102,241,0.12),transparent_70%)]" />

      <AvatarScene />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-10">
        <p className="hero-scroll-hint font-display text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
          Scroll to meet me
        </p>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  )
}
