import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Width = '4xl' | '5xl' | '6xl' | '7xl' | 'full'

const WIDTH_CLASS: Record<Width, string> = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-none',
}

interface PageShellProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  width?: Width
  className?: string
  headerClassName?: string
}

interface PageSurfaceProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  bodyClassName?: string
}

interface PageToolbarRowProps {
  children: ReactNode
  className?: string
}

interface PageStatStripProps {
  children: ReactNode
  className?: string
}

interface PageStatProps {
  label: string
  value: ReactNode
  note?: ReactNode
  className?: string
}

export function PageShell({
  title,
  description,
  actions,
  children,
  width = '6xl',
  className,
  headerClassName,
}: PageShellProps) {
  return (
    <div className={cn('ops-page-shell', WIDTH_CLASS[width], className)}>
      <div className={cn('ops-page-header', headerClassName)}>
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{title}</h1>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 self-start">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}

export function PageSurface({
  title,
  description,
  actions,
  children,
  footer,
  className,
  bodyClassName,
}: PageSurfaceProps) {
  const hasHeader = title || description || actions

  return (
    <section className={cn('ops-surface', className)}>
      {hasHeader ? (
        <div className="ops-surface-header">
          <div className="min-w-0 space-y-1">
            {title ? <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 self-start">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn('ops-surface-body', bodyClassName)}>{children}</div>
      {footer ? <div className="ops-surface-footer">{footer}</div> : null}
    </section>
  )
}

export function PageToolbarRow({ children, className }: PageToolbarRowProps) {
  return <div className={cn('ops-toolbar-row', className)}>{children}</div>
}

export function PageStatStrip({ children, className }: PageStatStripProps) {
  return <div className={cn('ops-stat-strip', className)}>{children}</div>
}

export function PageStat({ label, value, note, className }: PageStatProps) {
  return (
    <div className={cn('ops-stat-card', className)}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-3 text-xl font-semibold tracking-tight text-foreground">{value}</div>
      {note ? <div className="mt-1 text-xs text-muted-foreground">{note}</div> : null}
    </div>
  )
}

export function PageSubnav({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('ops-subnav', className)}>{children}</div>
}

export function PageSubnavButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'ops-subnav-button',
        active
          ? 'ops-subnav-button-active'
          : 'ops-subnav-button-idle'
      )}
    >
      {children}
    </button>
  )
}
