import { Billboard, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, type CSSProperties } from 'react'
import { AdditiveBlending, type Group, type Mesh, type MeshBasicMaterial } from 'three'
import type { Project } from '../../data/projects'
import {
  CLICK_THRESHOLD,
  useWheelInteraction,
  WHEEL_RADIUS,
} from './wheelContext'

type ProjectWheelNodeProps = {
  project: Project
  index: number
  total: number
  onSelect: (project: Project) => void
}

export function ProjectWheelNode({
  project,
  index,
  total,
  onSelect,
}: ProjectWheelNodeProps) {
  const groupRef = useRef<Group>(null)
  const glowRef = useRef<Mesh>(null)
  const pointerStart = useRef(0)
  const pointerMoved = useRef(false)
  const { wheelRotation } = useWheelInteraction()

  const baseAngle = (index / total) * Math.PI * 2
  const floatY = Math.sin(index * 1.4) * 0.15

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const angle = baseAngle + wheelRotation.current
      groupRef.current.position.set(
        Math.sin(angle) * WHEEL_RADIUS,
        floatY,
        Math.cos(angle) * WHEEL_RADIUS,
      )
    }

    if (!glowRef.current) return
    const pulse = 0.12 + Math.sin(clock.elapsedTime * 1.6 + index) * 0.04
    glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.2 + index) * 0.03)
    const material = glowRef.current.material as MeshBasicMaterial
    material.opacity = pulse
  })

  const handlePointerDown = (clientX: number) => {
    pointerStart.current = clientX
    pointerMoved.current = false
  }

  const handlePointerMove = (clientX: number) => {
    if (Math.abs(clientX - pointerStart.current) > CLICK_THRESHOLD) {
      pointerMoved.current = true
    }
  }

  const handleClick = () => {
    if (pointerMoved.current) return
    onSelect(project)
  }

  return (
    <group ref={groupRef}>
      <pointLight color={project.color} intensity={0.35} distance={3} decay={2} />

      <Billboard follow>
        <mesh ref={glowRef} position={[0, 0, -0.08]}>
          <planeGeometry args={[2.6, 1.65]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>

        <Html
          center
          distanceFactor={5.5}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          <button
            type="button"
            className="project-wheel-node group"
            style={
              {
                '--node-accent': project.color,
              } as CSSProperties
            }
            onPointerDown={(event) => {
              event.stopPropagation()
              handlePointerDown(event.clientX)
            }}
            onPointerMove={(event) => {
              event.stopPropagation()
              handlePointerMove(event.clientX)
            }}
            onPointerUp={(event) => {
              event.stopPropagation()
              if (!pointerMoved.current) {
                handleClick()
              }
            }}
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <span className="project-wheel-node__glow" aria-hidden />
            <span className="project-wheel-node__logo-wrap">
              <img
                src={project.favicon}
                alt=""
                className="project-wheel-node__logo"
                loading="lazy"
                draggable={false}
              />
            </span>
            <span className="project-wheel-node__name">{project.name}</span>
            <span className="project-wheel-node__hint">Tap to preview</span>
          </button>
        </Html>
      </Billboard>
    </group>
  )
}
