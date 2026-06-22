import { useContext } from 'react'

import { GlobalToastContext } from '@/components/ui/global-toast-context'

export function useGlobalToast() {
  const context = useContext(GlobalToastContext)
  if (!context) {
    throw new Error('useGlobalToast must be used within GlobalToastProvider')
  }
  return context
}
