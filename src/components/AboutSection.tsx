function RomaniaFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      role="img"
    >
      <rect width="8" height="16" fill="#002B7F" />
      <rect x="8" width="8" height="16" fill="#FCD116" />
      <rect x="16" width="8" height="16" fill="#CE1126" />
    </svg>
  )
}

const FUN_FACTS = [
  { id: 'products', icon: '🚀', text: 'Multiple products shipped and live' },
  { id: 'ai', icon: '🤖', text: 'AI-native development workflow' },
  { id: 'cat', icon: '🐱', text: 'Cat-assisted marketing department' },
  {
    id: 'romania',
    text: 'Based in Romania, building for the world',
    FlagIcon: RomaniaFlagIcon,
  },
] as const

export function AboutSection() {
  return (
    <section
      data-section="about"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-section__inner">
        <header className="about-section__header" data-animate="fade-up">
          <h2
            id="about-heading"
            className="about-section__title font-display text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500"
          >
            About Me
          </h2>
          <span className="about-section__accent" aria-hidden />
        </header>

        <div className="about-section__card glass">
          <p className="about-bio__text" data-animate="about-bio">
            Romanian solo founder and full-stack developer building AI-powered
            products under NovaCraft Studio. I specialize in turning ideas into
            real products fast, combining modern web tech with AI tools.
          </p>

          <ul className="about-bio__facts">
            {FUN_FACTS.map((fact) => (
              <li
                key={fact.id}
                className="about-bio__fact glass"
                data-animate="about-fact"
              >
                <span
                  className={`about-bio__fact-icon${'FlagIcon' in fact ? ' about-bio__fact-icon--flag' : ''}`}
                  aria-hidden
                >
                  {'FlagIcon' in fact ? (
                    <fact.FlagIcon className="about-bio__flag" />
                  ) : (
                    fact.icon
                  )}
                </span>
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="about-section__note" data-animate="about-note">
          I enjoy technically challenging projects and learning new technologies.
          If a project presents an interesting problem to solve, I&apos;m often
          willing to explore unfamiliar tools and stacks to find the best
          solution.
        </p>
      </div>
    </section>
  )
}
