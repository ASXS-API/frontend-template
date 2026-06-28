import type { ReactNode } from 'react'
import { CircleAlert, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  title?: string
  message: string
  retryText?: string
  onRetry?: () => void
  actions?: ReactNode
  className?: string
}

export function ErrorState({
  title = '加载失败',
  message,
  retryText = '重试',
  onRetry,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
        <CircleAlert className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
      {onRetry || actions ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" />
              {retryText}
            </Button>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  )
}
