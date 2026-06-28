import { useContext } from 'react'

import { ConfirmDialogContext, type ConfirmDialogContextValue } from '@/components/ui/confirm-dialog-context'

export function useConfirm(): ConfirmDialogContextValue['confirm'] {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider')
  }
  return context.confirm
}
