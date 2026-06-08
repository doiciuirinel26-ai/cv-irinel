import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import type { Project } from '../../data/projects'

type ProjectPhoneModalProps = {
  project: Project | null
  onClose: () => void
}

export function ProjectPhoneModal({ project, onClose }: ProjectPhoneModalProps) {
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) {
      setVisible(false)
      return
    }

    setLoading(true)
    setVisible(true)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  useLayoutEffect(() => {
    if (!project || !visible) return

    const overlay = overlayRef.current
    const phone = phoneRef.current
    const closeBtn = closeRef.current
    if (!overlay || !phone || !closeBtn) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' },
      )

      gsap.fromTo(
        phone,
        {
          opacity: 0,
          y: 80,
          scale: 0.72,
          rotateY: -28,
          rotateX: 8,
        },
        {
          opacity: 1,
          y: 36,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
      )

      gsap.fromTo(
        closeBtn,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.35, delay: 0.35, ease: 'back.out(1.6)' },
      )
    })

    return () => ctx.revert()
  }, [project, visible])

  const handleClose = () => {
    const overlay = overlayRef.current
    const phone = phoneRef.current
    if (!overlay || !phone) {
      onClose()
      return
    }

    gsap.to(phone, {
      opacity: 0,
      y: 60,
      scale: 0.85,
      rotateY: 20,
      duration: 0.4,
      ease: 'power2.in',
    })

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.35,
      delay: 0.1,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  if (!project || !visible) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="project-phone-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} preview`}
    >
      <button
        ref={closeRef}
        type="button"
        className="project-phone-close"
        onClick={handleClose}
        aria-label="Close preview"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="project-phone-stage">
        <div ref={phoneRef} className="project-phone-mockup">
          <div className="project-phone-frame">
            <div className="project-phone-side project-phone-side--left" aria-hidden />
            <div className="project-phone-side project-phone-side--right" aria-hidden />
            <div className="project-phone-bezel">
              <div className="project-phone-notch" aria-hidden />
              <div className="project-phone-screen">
                {loading && (
                  <div className="project-phone-loading">
                    <span className="project-phone-spinner" aria-hidden />
                    <p>Loading {project.name}…</p>
                  </div>
                )}
                <iframe
                  key={project.id}
                  src={project.url}
                  title={`${project.name} preview`}
                  className="project-phone-iframe"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  onLoad={() => setLoading(false)}
                />
              </div>
              <div className="project-phone-home-bar" aria-hidden />
            </div>
          </div>

          <div className="project-phone-meta">
            <img src={project.favicon} alt="" className="project-phone-meta__icon" />
            <div>
              <p className="project-phone-meta__name">{project.name}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-phone-meta__link"
              >
                Open in new tab ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
