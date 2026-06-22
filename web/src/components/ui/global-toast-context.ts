import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface GlobalToastContextValue {
  showToast: (type: ToastType, text: string, options?: { translate?: boolean }) => void
}

export const GlobalToastContext = createContext<GlobalToastContextValue | null>(null)
