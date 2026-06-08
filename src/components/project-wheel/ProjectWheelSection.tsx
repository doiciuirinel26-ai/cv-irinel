import { Component, lazy, Suspense, type ReactNode } from 'react'

const ProjectWheel = lazy(() =>
  import('./ProjectWheel').then((module) => ({
    default: module.ProjectWheel,
  })),
)

type ErrorBoundaryState = {
  hasError: boolean
}

class ProjectWheelErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="project-wheel-wrap flex items-center justify-center px-6">
          <p className="text-center text-sm text-zinc-500">
            Projects wheel failed to load. Refresh the page or restart{' '}
            <code className="text-zinc-400">npm run dev</code>.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function ProjectWheelFallback() {
  return (
    <div className="project-wheel-wrap flex items-center justify-center">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        Loading projects…
      </p>
    </div>
  )
}

export function ProjectWheelSection() {
  return (
    <ProjectWheelErrorBoundary>
      <Suspense fallback={<ProjectWheelFallback />}>
        <ProjectWheel />
      </Suspense>
    </ProjectWheelErrorBoundary>
  )
}
