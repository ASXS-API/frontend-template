import type { ReactNode } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface DataTableToolbarProps {
  title?: string
  description?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  className?: string
}

export function DataTableToolbar({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = '搜索...',
  filters,
  actions,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 border-b border-border/70 px-5 py-4', className)}>
      {title || description || actions ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {onSearchChange || filters ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {onSearchChange ? (
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue || ''}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : null}
          {filters ? <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 lg:justify-end">{filters}</div> : null}
        </div>
      ) : null}
    </div>
  )
}
