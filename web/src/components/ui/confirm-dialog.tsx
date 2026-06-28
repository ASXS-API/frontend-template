import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button-variants'
import { ConfirmDialogContext, type ConfirmOptions } from '@/components/ui/confirm-dialog-context'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

interface PendingConfirm {
  options: Required<ConfirmOptions>
  resolve: (confirmed: boolean) => void
}

function normalizeOptions(options: ConfirmOptions, fallback: { confirmText: string; cancelText: string }): Required<ConfirmOptions> {
  return {
    title: options.title,
    description: options.description || '',
    confirmText: options.confirmText || fallback.confirmText,
    cancelText: options.cancelText || fallback.cancelText,
    variant: options.variant || 'default',
  }
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)
  const pendingRef = useRef<PendingConfirm | null>(null)
  const { t } = useI18n()

  const close = useCallback((confirmed: boolean) => {
    const current = pendingRef.current
    if (!current) return

    pendingRef.current = null
    setPending(null)
    current.resolve(confirmed)
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    const normalized = normalizeOptions(options, {
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
    })

    pendingRef.current?.resolve(false)

    return new Promise<boolean>((resolve) => {
      const next = { options: normalized, resolve }
      pendingRef.current = next
      setPending(next)
    })
  }, [t])

  const value = useMemo(() => ({ confirm }), [confirm])
  const open = Boolean(pending)
  const options = pending?.options

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <AlertDialog open={open} onOpenChange={(nextOpen) => {
        if (!nextOpen) close(false)
      }}>
        {options ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{options.title}</AlertDialogTitle>
              {options.description ? <AlertDialogDescription>{options.description}</AlertDialogDescription> : null}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => close(false)}>{options.cancelText}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => close(true)}
                className={cn(options.variant === 'destructive' && buttonVariants({ variant: 'destructive' }))}
              >
                {options.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  )
}
