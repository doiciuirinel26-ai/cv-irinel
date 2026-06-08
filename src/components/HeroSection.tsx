import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AvatarScene } from './AvatarScene'
import { avatarRotation, heroScrollState } from '../store/avatarRotation'

gsap.registerPlugin(ScrollTrigger)

/** Viewport heights of scroll consumed while hero is pinned (rotation phase). */
const ROTATION_SCROLL_VH = 1

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    avatarRotation.y = Math.PI
    heroScrollState.rotationComplete = false
    document.body.classList.add('hero-scroll-locked')

    const getScrollDistance = () => window.innerHeight * ROTATION_SCROLL_VH

    const ctx = gsap.context(() => {
      gsap.to(avatarRotation, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 0.35,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1,
            duration: { min: 0.12, max: 0.28 },
            delay: 0.02,
            ease: 'power1.inOut',
          },
          onUpdate: (self) => {
            if (self.progress >= 0.999) {
              avatarRotation.y = 0
            }
          },
          onLeave: () => {
            avatarRotation.y = 0
            heroScrollState.rotationComplete = true
            document.body.classList.remove('hero-scroll-locked')
          },
          onEnterBack: () => {
            heroScrollState.rotationComplete = false
            document.body.classList.add('hero-scroll-locked')
          },
        },
      })
    }, hero)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('hero-scroll-locked')
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-[100vh] min-h-[100vh] w-full overflow-hidden bg-surface"
      style={{ height: '100dvh', minHeight: '100dvh' }}
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(99,102,241,0.12),transparent_70%)]" />

      <AvatarScene />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-10">
        <p className="font-display text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
          Scroll to meet me
        </p>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  )
}
