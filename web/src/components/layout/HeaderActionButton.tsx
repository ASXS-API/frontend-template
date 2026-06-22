import type { ComponentProps } from 'react'

import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HideLabelBelow = 'xl' | '2xl'

const BUTTON_CLASS_BY_BREAKPOINT: Record<HideLabelBelow, string> = {
  xl: 'h-9 w-9 shrink-0 rounded-md p-0 xl:w-auto xl:px-3',
  '2xl': 'h-9 w-9 shrink-0 rounded-md p-0 2xl:w-auto 2xl:px-3',
}

const ICON_CLASS_BY_BREAKPOINT: Record<HideLabelBelow, string> = {
  xl: 'h-4 w-4 xl:mr-2',
  '2xl': 'h-4 w-4 2xl:mr-2',
}

const LABEL_CLASS_BY_BREAKPOINT: Record<HideLabelBelow, string> = {
  xl: 'hidden xl:inline',
  '2xl': 'hidden 2xl:inline',
}

interface HeaderActionButtonProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  icon: LucideIcon
  label: string
  hideLabelBelow?: HideLabelBelow
  iconClassName?: string
}

export function HeaderActionButton({
  icon: Icon,
  label,
  hideLabelBelow = 'xl',
  className,
  iconClassName,
  title,
  'aria-label': ariaLabel,
  ...props
}: HeaderActionButtonProps) {
  return (
    <Button
      aria-label={ariaLabel || label}
      title={title || label}
      className={cn(BUTTON_CLASS_BY_BREAKPOINT[hideLabelBelow], className)}
      {...props}
    >
      <Icon className={cn(ICON_CLASS_BY_BREAKPOINT[hideLabelBelow], iconClassName)} />
      <span className={LABEL_CLASS_BY_BREAKPOINT[hideLabelBelow]}>{label}</span>
    </Button>
  )
}
