import { createContext, useContext, type MutableRefObject, type ReactNode } from 'react'

export type WheelDragState = {
  active: boolean
  startX: number
  moved: boolean
}

type WheelInteractionContextValue = {
  dragState: MutableRefObject<WheelDragState>
}

const WheelInteractionContext = createContext<WheelInteractionContextValue | null>(
  null,
)

export function WheelInteractionProvider({
  children,
  dragState,
}: {
  children: ReactNode
  dragState: MutableRefObject<WheelDragState>
}) {
  return (
    <WheelInteractionContext.Provider value={{ dragState }}>
      {children}
    </WheelInteractionContext.Provider>
  )
}

export function useWheelInteraction() {
  const ctx = useContext(WheelInteractionContext)
  if (!ctx) {
    throw new Error('useWheelInteraction must be used within WheelInteractionProvider')
  }
  return ctx
}

export const WHEEL_RADIUS = 3.6
export const DRAG_SENSITIVITY = 0.004
export const INERTIA_DAMPING = 0.94
export const CLICK_THRESHOLD = 6
