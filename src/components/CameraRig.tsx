import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/** Aim camera at torso so full body stays in frame. */
export function CameraRig() {
  const { camera } = useThree()

  useEffect(() => {
    camera.lookAt(0, 1.12, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}
