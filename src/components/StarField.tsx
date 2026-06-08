import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import type { Points as PointsType } from 'three'

const STAR_COUNT = 2500
const SPREAD = 45

function createStarPositions(count: number, spread: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread - 8
  }
  return positions
}

export function StarField() {
  const pointsRef = useRef<PointsType>(null)
  const positions = useMemo(
    () => createStarPositions(STAR_COUNT, SPREAD),
    [],
  )

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e4e4e7"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  )
}
