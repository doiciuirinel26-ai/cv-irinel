import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
  type Mesh,
} from 'three'

const NODE_COUNT = 62
const MAX_EDGES = 110
const LINK_DISTANCE = 0.19
const CANVAS_SCALE = 2
const PLANE_Z = -9

type Node = {
  x: number
  y: number
  pulsePhase: number
}

type Edge = {
  a: number
  b: number
  phase: number
  drawSpeed: number
  drawT: number
  fadeSpeed: number
  fade: number
  fadeDir: 1 | -1
}

type Signal = {
  edgeIndex: number
  t: number
  speed: number
}

type NetworkState = {
  nodes: Node[]
  edges: Edge[]
  signals: Signal[]
  spawnTimer: number
  width: number
  height: number
}

type CircuitResources = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: CanvasTexture
  network: NetworkState
}

function buildNetwork(): Pick<NetworkState, 'nodes' | 'edges'> {
  const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
    x: 0.08 + Math.random() * 0.84,
    y: 0.08 + Math.random() * 0.84,
    pulsePhase: Math.random() * Math.PI * 2,
  }))

  const edges: Edge[] = []
  const edgeSet = new Set<string>()

  for (let i = 0; i < nodes.length; i += 1) {
    const distances: { j: number; d: number }[] = []

    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.hypot(dx, dy)
      if (d < LINK_DISTANCE) {
        distances.push({ j, d })
      }
    }

    distances.sort((a, b) => a.d - b.d)

    for (const { j } of distances.slice(0, 3)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (edgeSet.has(key) || edges.length >= MAX_EDGES) continue
      edgeSet.add(key)
      edges.push({
        a: i,
        b: j,
        phase: Math.random() * Math.PI * 2,
        drawSpeed: 0.18 + Math.random() * 0.22,
        drawT: Math.random(),
        fadeSpeed: 0.25 + Math.random() * 0.35,
        fade: 0.35 + Math.random() * 0.45,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
      })
    }
  }

  return { nodes, edges }
}

function createCircuitResources(width: number, height: number): CircuitResources {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(Math.floor(width * CANVAS_SCALE), 512)
  canvas.height = Math.max(Math.floor(height * CANVAS_SCALE), 512)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('[StarField] Failed to acquire 2D canvas context')
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter

  const { nodes, edges } = buildNetwork()

  return {
    canvas,
    ctx,
    texture,
    network: {
      nodes,
      edges,
      signals: [],
      spawnTimer: 1.2,
      width: canvas.width,
      height: canvas.height,
    },
  }
}

function drawNetwork(
  ctx: CanvasRenderingContext2D,
  state: NetworkState,
  time: number,
  delta: number,
) {
  const { width, height } = state
  ctx.clearRect(0, 0, width, height)

  const toX = (n: number) => n * width
  const toY = (n: number) => n * height

  for (const edge of state.edges) {
    const na = state.nodes[edge.a]
    const nb = state.nodes[edge.b]
    if (!na || !nb) continue

    edge.drawT += edge.drawSpeed * delta
    if (edge.drawT > 1.15) {
      edge.drawT = 0
      edge.phase = Math.random() * Math.PI * 2
    }

    edge.fade += edge.fadeSpeed * delta * edge.fadeDir
    if (edge.fade >= 0.5) {
      edge.fade = 0.5
      edge.fadeDir = -1
    } else if (edge.fade <= 0.18) {
      edge.fade = 0.18
      edge.fadeDir = 1
    }

    const ax = toX(na.x)
    const ay = toY(na.y)
    const bx = toX(nb.x)
    const by = toY(nb.y)
    const progress = Math.min(edge.drawT, 1)
    const px = ax + (bx - ax) * progress
    const py = ay + (by - ay) * progress
    const pulse = 0.85 + Math.sin(time * 1.4 + edge.phase) * 0.15
    const alpha = edge.fade * pulse

    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(px, py)
    ctx.strokeStyle = `rgba(26, 74, 122, ${alpha})`
    ctx.lineWidth = 1.2 * CANVAS_SCALE
    ctx.stroke()
  }

  state.spawnTimer -= delta
  if (state.spawnTimer <= 0 && state.edges.length > 0) {
    state.spawnTimer = 1.8 + Math.random() * 2.4
    state.signals.push({
      edgeIndex: Math.floor(Math.random() * state.edges.length),
      t: 0,
      speed: 0.35 + Math.random() * 0.45,
    })
  }

  for (let i = state.signals.length - 1; i >= 0; i -= 1) {
    const signal = state.signals[i]
    const edge = state.edges[signal.edgeIndex]
    if (!edge) {
      state.signals.splice(i, 1)
      continue
    }

    signal.t += signal.speed * delta
    if (signal.t >= 1) {
      state.signals.splice(i, 1)
      continue
    }

    const na = state.nodes[edge.a]
    const nb = state.nodes[edge.b]
    const sx = toX(na.x + (nb.x - na.x) * signal.t)
    const sy = toY(na.y + (nb.y - na.y) * signal.t)

    ctx.beginPath()
    ctx.arc(sx, sy, 2.4 * CANVAS_SCALE, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(sx, sy, 5.5 * CANVAS_SCALE, 0, Math.PI * 2)
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5.5 * CANVAS_SCALE)
    glow.addColorStop(0, 'rgba(0, 255, 255, 0.12)')
    glow.addColorStop(1, 'rgba(0, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fill()
  }

  for (const node of state.nodes) {
    const x = toX(node.x)
    const y = toY(node.y)
    const pulse = 0.55 + Math.sin(time * 2.2 + node.pulsePhase) * 0.45
    const radius = (1.6 + pulse * 1) * CANVAS_SCALE

    ctx.beginPath()
    ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2)
    const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.4)
    halo.addColorStop(0, `rgba(74, 158, 255, ${0.1 + pulse * 0.08})`)
    halo.addColorStop(1, 'rgba(74, 158, 255, 0)')
    ctx.fillStyle = halo
    ctx.fill()

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(74, 158, 255, ${0.5 + pulse * 0.45})`
    ctx.fill()
  }
}

function viewportPlaneSize(
  viewportWidth: number,
  viewportHeight: number,
  cameraZ: number,
  planeZ: number,
  fovDeg: number,
) {
  const aspect = viewportWidth / Math.max(viewportHeight, 1)
  const distance = Math.abs(cameraZ - planeZ)
  const vFov = (fovDeg * Math.PI) / 180
  const height = 2 * Math.tan(vFov / 2) * distance * 1.15
  return [height * aspect, height] as const
}

export function StarField() {
  const meshRef = useRef<Mesh>(null)
  const resourcesRef = useRef<CircuitResources | null>(null)
  const { size, camera } = useThree()

  const viewportWidth = size.width || (typeof window !== 'undefined' ? window.innerWidth : 1280)
  const viewportHeight = size.height || (typeof window !== 'undefined' ? window.innerHeight : 720)

  const resources = useMemo(() => {
    const created = createCircuitResources(viewportWidth, viewportHeight)
    resourcesRef.current = created
    return created
  }, [])

  const planeSize = useMemo(() => {
    const fov =
      'fov' in camera && typeof camera.fov === 'number' ? camera.fov : 45
    const cameraZ = camera.position.z
    return viewportPlaneSize(viewportWidth, viewportHeight, cameraZ, PLANE_Z, fov)
  }, [camera, viewportWidth, viewportHeight])

  useEffect(() => {
    return () => {
      resourcesRef.current?.texture.dispose()
      resourcesRef.current = null
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const { canvas, ctx, texture, network } = resources

    const targetWidth = Math.max(Math.floor(viewportWidth * CANVAS_SCALE), 512)
    const targetHeight = Math.max(Math.floor(viewportHeight * CANVAS_SCALE), 512)

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth
      canvas.height = targetHeight
      network.width = targetWidth
      network.height = targetHeight
    }

    drawNetwork(ctx, network, clock.elapsedTime, delta)
    texture.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} position={[0, 0.55, PLANE_Z]} renderOrder={-10}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <meshBasicMaterial
        map={resources.texture}
        transparent
        opacity={1}
        depthWrite={false}
        depthTest={true}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  )
}
