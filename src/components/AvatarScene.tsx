import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { AvatarModel } from './AvatarModel'
import { StarField } from './StarField'
import { CameraRig } from './CameraRig'

function SceneContent() {
  return (
    <>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 8, 28]} />

      <CameraRig />

      <ambientLight intensity={0.35} color="#c4b5fd" />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.4}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-5, 3, -3]}
        intensity={0.45}
        color="#818cf8"
      />
      <pointLight position={[0, 2, -4]} intensity={0.25} color="#6366f1" />

      <StarField />
      <AvatarModel />
    </>
  )
}

export function AvatarScene() {
  return (
    <>
      <Canvas
        className="hero-scene-canvas !absolute inset-0 h-full w-full touch-none"
        frameloop="always"
        camera={{ position: [0, 1.16, 3.55], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{
          background: 'transparent',
          top: 'auto',
          bottom: '28%',
          height: 'auto',
        }}
        innerStyles={{ background: 'rgba(99, 102, 241, 0.15)', width: '120px' }}
        barStyles={{ background: '#818cf8', height: '2px' }}
        dataStyles={{
          color: '#a1a1aa',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      />
    </>
  )
}
