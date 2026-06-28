import { createContext } from 'react'

export type ConfirmVariant = 'default' | 'destructive'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
}

export interface ConfirmDialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null)
