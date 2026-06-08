import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import {
  AnimationMixer,
  LoopRepeat,
  type Group,
} from 'three'
import { avatarRotation } from '../store/avatarRotation'

const AVATAR_URL = '/avatar.glb?v=2'

useGLTF.clear('/avatar.glb')
useGLTF.clear('/avatar.glb?v=idle')
useGLTF.clear(AVATAR_URL)
useGLTF.preload(AVATAR_URL)

export function AvatarModel() {
  const groupRef = useRef<Group>(null)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const gltf = useGLTF(AVATAR_URL)
  const { scene, animations } = gltf

  useEffect(() => {
    scene.traverse((child) => {
      if ('isMesh' in child && child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    mixerRef.current?.stopAllAction()
    mixerRef.current = null

    if (animations.length === 0) {
      console.error(
        '[Avatar] No animations in GLB. Replace public/avatar.glb and hard-refresh (Ctrl+Shift+R).',
      )
      return
    }

    const mixer = new AnimationMixer(scene)
    const action = mixer.clipAction(animations[0])
    action.setLoop(LoopRepeat, Infinity)
    action.setEffectiveWeight(1)
    action.play()
    mixer.update(0)
    mixerRef.current = mixer

    return () => {
      action.stop()
      mixer.stopAllAction()
      mixerRef.current = null
    }
  }, [scene, animations])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)

    if (groupRef.current) {
      groupRef.current.rotation.y = avatarRotation.y
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.55, 0]} scale={1.06}>
      <Center disableY>
        <primitive object={scene} />
      </Center>
    </group>
  )
}
