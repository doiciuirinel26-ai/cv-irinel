import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProjectWheelSection } from './project-wheel/ProjectWheelSection'
import { ContactCTA } from './ContactCTA'
import { AboutSection } from './AboutSection'
import { FAQSection } from './FAQSection'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  'Next.js',
  'React',
  'TypeScript',
  'Supabase',
  'Three.js',
  'AI/ML',
  'ComfyUI',
] as const

export function CVSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('[data-animate="fade-up"]', {
        opacity: 0,
        y: 48,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="skill"]', {
        opacity: 0,
        scale: 0.85,
        y: 16,
        duration: 0.6,
        ease: 'back.out(1.4)',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '[data-section="skills"]',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="wheel"]', {
        opacity: 0,
        y: 48,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-section="projects"]',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="about-bio"]', {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: '[data-section="about"]',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="about-fact"]', {
        opacity: 0,
        y: 20,
        scale: 0.96,
        duration: 0.6,
        ease: 'back.out(1.4)',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '[data-section="about"]',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="about-note"]', {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-section="about"]',
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('[data-animate="faq-item"]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '[data-section="faq"]',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-surface-elevated px-6 py-24 md:px-12 md:py-32 lg:px-20"
      aria-label="Curriculum Vitae"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(99,102,241,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-16 text-center md:mb-20" data-animate="fade-up">
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.4em] text-accent">
            Portfolio
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl lg:text-7xl">
            Doiciu Irinel
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 md:text-xl"
            data-animate="fade-up"
          >
            Full Stack Developer &amp; AI Engineer
          </p>
          <ContactCTA />
        </header>

        <div className="mb-16 md:mb-20" data-section="skills">
          <h2
            className="mb-8 font-display text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500"
            data-animate="fade-up"
          >
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                data-animate="skill"
                className="glass rounded-full px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-accent/30 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div data-section="projects">
          <h2
            className="mb-6 font-display text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500 md:mb-8"
            data-animate="fade-up"
          >
            Projects
          </h2>
          <div data-animate="wheel" className="mx-auto max-w-6xl">
            <ProjectWheelSection />
          </div>
        </div>
      </div>

      <AboutSection />

      <FAQSection />

      <div className="relative mx-auto max-w-5xl">
        <footer
          className="mt-20 border-t border-white/5 pt-10 text-center"
          data-animate="fade-up"
        >
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Doiciu Irinel. Built with React,
            Three.js &amp; GSAP.
          </p>
        </footer>
      </div>
    </section>
  )
}
