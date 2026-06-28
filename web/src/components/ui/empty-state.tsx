import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, actions, className }: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-48 flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-muted/60 text-muted-foreground">
        {icon || <Inbox className="h-5 w-5" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{actions}</div> : null}
    </div>
  )
}
