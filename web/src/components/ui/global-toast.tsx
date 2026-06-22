import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { GlobalToastContext, type ToastType } from '@/components/ui/global-toast-context'
import { translateDynamicText, useI18n } from '@/i18n'
import { AnimatePresence, motion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'

interface ToastItem {
  id: string
  type: ToastType
  text: string
}

function buildToastClass(type: ToastType) {
  switch (type) {
    case 'success':
      return 'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-400/15 dark:bg-emerald-950 dark:text-emerald-100'
    case 'error':
      return 'border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-400/15 dark:bg-rose-950 dark:text-rose-100'
    default:
      return 'border-slate-200/80 bg-background text-foreground dark:border-white/[0.08] dark:bg-popover'
  }
}

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4" />
    case 'error':
      return <CircleAlert className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}

export function GlobalToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const { language, t } = useI18n()

  const dismissToast = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const showToast = useCallback((type: ToastType, text: string, options?: { translate?: boolean }) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const nextText = options?.translate === false ? trimmed : translateDynamicText(trimmed, language)
    setItems((current) => [...current.slice(-3), { id, type, text: nextText }])
  }, [language])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <GlobalToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4">
              <div className="flex w-full max-w-xl flex-col gap-3">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <ToastCard key={item.id} item={item} closeLabel={t('common.close')} onClose={() => dismissToast(item.id)} />
                  ))}
                </AnimatePresence>
              </div>
            </div>,
            document.body,
          )
        : null}
    </GlobalToastContext.Provider>
  )
}

function ToastCard({ item, closeLabel, onClose }: { item: ToastItem; closeLabel: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.28 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg dark:shadow-[0_28px_48px_-30px_rgba(0,0,0,0.96),0_0_0_1px_rgba(255,255,255,0.03)]',
        buildToastClass(item.type),
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5 shrink-0">
        <ToastIcon type={item.type} />
      </div>
      <div className="min-w-0 flex-1 text-sm leading-5">{item.text}</div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
        aria-label={closeLabel}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
