import type { ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterBarProps {
  children: ReactNode
  onReset?: () => void
  resetText?: string
  className?: string
  actions?: ReactNode
}

export function FilterBar({ children, onReset, resetText = '重置', className, actions }: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-border/70 bg-background/75 p-3 lg:flex-row lg:items-center lg:justify-between', className)}>
      <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {children}
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {actions}
        {onReset ? (
          <Button type="button" variant="ghost" size="sm" className="gap-2" onClick={onReset}>
            <X className="h-4 w-4" />
            {resetText}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export function FilterField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </div>
  )
}
