import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export interface FormFieldProps {
  label: string
  htmlFor?: string
  description?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {title || description ? (
        <div className="space-y-1">
          {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : null}
          {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}
      <div className="grid gap-5">{children}</div>
    </div>
  )
}

export function FormField({ label, htmlFor, description, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </Label>
        {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
      {error ? <p className="text-xs leading-5 text-destructive">{error}</p> : null}
    </div>
  )
}
