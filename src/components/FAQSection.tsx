import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

type FAQItem = {
  id: string
  question: string
  answer: ReactNode
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'freelance',
    question: 'Are you available for freelance?',
    answer: 'Yes, always open to new projects and collaborations.',
  },
  {
    id: 'technologies',
    question: 'What technologies do you work with?',
    answer:
      'Next.js, React, TypeScript, Supabase, PostgreSQL, Stripe, Three.js, React Three Fiber, GSAP, TailwindCSS, Python, FastAPI, ComfyUI, AI/ML integrations (Claude, Gemini, GPT), and whatever the project needs.',
  },
  {
    id: 'timeline',
    question: 'How long does a project take?',
    answer:
      'Depends on complexity. This CV took 8 hours. CartFlux (a full SaaS platform) took one week. Usually maximum two weeks for most projects.',
  },
  {
    id: 'international',
    question: 'Do you work with international clients?',
    answer: "I work with anyone who pays. Location doesn't matter.",
  },
  {
    id: 'pricing',
    question: 'How much do your services cost?',
    answer:
      'Depends on how beautiful the project is and how much creative freedom I have. Pixel perfect from a Figma file costs more than a project where I can express myself.',
  },
  {
    id: 'contact',
    question: 'How can I contact you?',
    answer: (
      <>
        WhatsApp, Email (
        <a href="mailto:doiciuirinel26@gmail.com" className="faq-item__link">
          doiciuirinel26@gmail.com
        </a>
        ), or Contra:{' '}
        <a
          href="https://contra.com/irinel_doiciu/work"
          className="faq-item__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://contra.com/irinel_doiciu/work
        </a>
      </>
    ),
  },
]

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`faq-item glass${isOpen ? ' faq-item--open' : ''}`}
      data-animate="faq-item"
    >
      <h3>
        <button
          type="button"
          className="faq-item__trigger"
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${item.id}`}
          id={`faq-trigger-${item.id}`}
          onClick={onToggle}
        >
          <span className="faq-item__question">{item.question}</span>
          <ChevronDown className="faq-item__chevron" aria-hidden strokeWidth={2} />
        </button>
      </h3>
      <div
        id={`faq-panel-${item.id}`}
        className="faq-item__panel"
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
      >
        <div className="faq-item__content">
          <p className="faq-item__answer">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section
      data-section="faq"
      className="faq-section"
      aria-labelledby="faq-heading"
    >
      <div className="faq-section__inner">
        <header className="faq-section__header" data-animate="fade-up">
          <h2
            id="faq-heading"
            className="faq-section__title font-display text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500"
          >
            FAQ
          </h2>
          <span className="faq-section__accent" aria-hidden />
        </header>

        <div className="faq-section__list">
          {FAQ_ITEMS.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
