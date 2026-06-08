import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import type { Project } from '../../data/projects'
import { ProjectWheelNode } from './ProjectWheelNode'
import {
  DRAG_SENSITIVITY,
  INERTIA_DAMPING,
  useWheelInteraction,
  type WheelDragState,
} from './wheelContext'

type ProjectWheelSceneProps = {
  projects: Project[]
  onSelect: (project: Project) => void
  paused: boolean
}

export function ProjectWheelScene({
  projects,
  onSelect,
  paused,
}: ProjectWheelSceneProps) {
  const wheelRef = useRef<Group>(null)
  const rotation = useRef(0)
  const velocity = useRef(0)
  const { dragState } = useWheelInteraction()
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (event: PointerEvent) => {
      dragState.current = {
        active: true,
        startX: event.clientX,
        moved: false,
      }
      velocity.current = 0
      canvas.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragState.current.active) return

      const deltaX = event.clientX - dragState.current.startX
      if (Math.abs(deltaX) > 4) {
        dragState.current.moved = true
      }

      const step = deltaX * DRAG_SENSITIVITY
      rotation.current += step
      if (wheelRef.current) {
        wheelRef.current.rotation.y = rotation.current
      }

      dragState.current.startX = event.clientX
      velocity.current = step
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragState.current.active) return
      dragState.current.active = false
      canvas.releasePointerCapture(event.pointerId)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', endDrag)
    canvas.addEventListener('pointercancel', endDrag)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', endDrag)
      canvas.removeEventListener('pointercancel', endDrag)
    }
  }, [dragState, gl.domElement])

  useFrame(() => {
    if (paused || dragState.current.active || !wheelRef.current) return
    if (Math.abs(velocity.current) < 0.0001) return

    rotation.current += velocity.current
    velocity.current *= INERTIA_DAMPING
    wheelRef.current.rotation.y = rotation.current
  })

  return (
    <>
      <color attach="background" args={['#111111']} />
      <fog attach="fog" args={['#111111', 6, 16]} />

      <ambientLight intensity={0.45} color="#c4b5fd" />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#818cf8" />
      <pointLight position={[0, -1, 0]} intensity={0.2} color="#6366f1" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[3.0, 4.2, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} />
      </mesh>

      <group ref={wheelRef}>
        {projects.map((project, index) => (
          <ProjectWheelNode
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  )
}

export function createInitialDragState(): WheelDragState {
  return { active: false, startX: 0, moved: false }
}
