import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}

export function InlineLoader({ label = '加载中' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>
  )
}

