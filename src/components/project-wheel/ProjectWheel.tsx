import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PROJECTS, type Project } from '../../data/projects'
import { ProjectPhoneModal } from './ProjectPhoneModal'
import {
  createInitialDragState,
  ProjectWheelScene,
} from './ProjectWheelScene'
import { WheelInteractionProvider } from './wheelContext'

type ProjectWheelProps = {
  className?: string
}

export function ProjectWheel({ className = '' }: ProjectWheelProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const dragState = useRef(createInitialDragState())
  const wheelRotation = useRef(0)
  const modalOpen = selectedProject !== null

  return (
    <WheelInteractionProvider dragState={dragState} wheelRotation={wheelRotation}>
      <div
        className={`project-wheel-wrap ${modalOpen ? 'project-wheel-wrap--dimmed' : ''} ${className}`}
      >
        <Canvas
          className="project-wheel-canvas"
          camera={{ position: [0, 0.4, 7.2], fov: 42, near: 0.1, far: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <ProjectWheelScene
              projects={PROJECTS}
              onSelect={setSelectedProject}
              paused={modalOpen}
            />
          </Suspense>
        </Canvas>

        <p className="project-wheel-hint">
          Drag to spin the wheel · Click a project to preview
        </p>
      </div>

      <ProjectPhoneModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </WheelInteractionProvider>
  )
}
