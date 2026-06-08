import { useEffect, useRef, useState } from 'react'
import './CustomCursor.css'

const CURSOR_LERP = 0.16
const MAX_PARTICLES = 120
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [role="link"]'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest(INTERACTIVE_SELECTOR))
}

function spawnParticles(
  particles: Particle[],
  x: number,
  y: number,
  count: number,
  intensity: number,
) {
  const room = MAX_PARTICLES - particles.length
  const spawnCount = Math.min(count, room)
  if (spawnCount <= 0) return

  for (let i = 0; i < spawnCount; i += 1) {
    particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.9 * intensity,
      vy: (-0.35 - Math.random() * 0.9) * intensity,
      life: 1,
      maxLife: 0.45 + Math.random() * 0.35,
      size: 2 + Math.random() * 2,
    })
  }
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const cursorRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const hoveringRef = useRef(false)
  const rafRef = useRef(0)
  const lastBurstRef = useRef(0)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (isCoarsePointer()) return undefined

    document.body.classList.add('custom-cursor-enabled')

    const canvas = canvasRef.current
    const dot = dotRef.current
    if (!canvas || !dot) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const onPointerMove = (event: PointerEvent) => {
      targetRef.current.x = event.clientX
      targetRef.current.y = event.clientY

      const interactive = isInteractiveTarget(event.target)
      if (interactive !== hoveringRef.current) {
        hoveringRef.current = interactive
        setHovering(interactive)
      }

      const count = interactive
        ? 8 + Math.floor(Math.random() * 5)
        : 5 + Math.floor(Math.random() * 4)
      const intensity = interactive ? 1.6 : 1

      spawnParticles(particlesRef.current, event.clientX, event.clientY, count, intensity)

      if (interactive && performance.now() - lastBurstRef.current > 90) {
        lastBurstRef.current = performance.now()
        spawnParticles(
          particlesRef.current,
          event.clientX,
          event.clientY,
          10,
          2.2,
        )
      }
    }

    let lastTime = performance.now()

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.032)
      lastTime = time

      const cursor = cursorRef.current
      const target = targetRef.current
      cursor.x += (target.x - cursor.x) * CURSOR_LERP
      cursor.y += (target.y - cursor.y) * CURSOR_LERP

      dot.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`

      ctx.clearRect(0, 0, width, height)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i]
        particle.life -= dt / particle.maxLife
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy -= 0.35 * dt

        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const alpha = particle.life ** 1.4
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size,
        )
        gradient.addColorStop(0, `rgba(230, 195, 100, ${alpha * 0.95})`)
        gradient.addColorStop(0.55, `rgba(201, 168, 76, ${alpha * 0.55})`)
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('custom-cursor-enabled')
      particlesRef.current = []
    }
  }, [])

  if (isCoarsePointer()) return null

  return (
    <>
      <canvas ref={canvasRef} className="custom-cursor-canvas" aria-hidden />
      <div
        ref={dotRef}
        className={`custom-cursor-dot${hovering ? ' custom-cursor-dot--hover' : ''}`}
        aria-hidden
      />
    </>
  )
}
