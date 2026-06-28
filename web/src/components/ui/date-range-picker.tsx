import { CalendarDays, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface DateRangeValue {
  from: string
  to: string
}

export interface DateRangePickerProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  placeholder?: string
  className?: string
}

function formatDate(value: string) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(date)
}

export function DateRangePicker({ value, onChange, placeholder = '选择日期范围', className }: DateRangePickerProps) {
  const hasValue = Boolean(value.from || value.to)
  const display = hasValue ? `${formatDate(value.from) || '开始'} - ${formatDate(value.to) || '结束'}` : placeholder

  const update = (patch: Partial<DateRangeValue>) => {
    onChange({ ...value, ...patch })
  }

  const clear = () => {
    onChange({ from: '', to: '' })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('h-9 w-full justify-between px-3 font-normal', !hasValue && 'text-muted-foreground', className)}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{display}</span>
          </span>
          {hasValue ? (
            <span
              role="button"
              tabIndex={-1}
              className="ml-2 rounded-sm p-0.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                clear()
              }}
              aria-label="清空日期范围"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px]" align="start">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="date-range-from">开始日期</label>
            <Input id="date-range-from" type="date" value={value.from} max={value.to || undefined} onChange={(event) => update({ from: event.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="date-range-to">结束日期</label>
            <Input id="date-range-to" type="date" value={value.to} min={value.from || undefined} onChange={(event) => update({ to: event.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              清空
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
