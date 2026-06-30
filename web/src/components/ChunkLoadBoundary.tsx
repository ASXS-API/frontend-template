import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logError } from '@/lib/logger'

interface Props {
  children: ReactNode
  scopeLabel: string
}

interface State {
  hasError: boolean
}

export class ChunkLoadBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError('react.chunk_boundary.failed', {
      scope: this.props.scopeLabel,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: info.componentStack,
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && prevProps.scopeLabel !== this.props.scopeLabel) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-lg border border-border/70 bg-card/80 p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{this.props.scopeLabel} 加载失败</h2>
          <p className="text-sm text-muted-foreground">页面模块加载异常，可以刷新当前界面重试。</p>
        </div>
        <Button type="button" variant="outline" className="gap-2" onClick={() => window.location.reload()}>
          <RotateCcw className="h-4 w-4" />
          刷新
        </Button>
      </div>
    )
  }
}
