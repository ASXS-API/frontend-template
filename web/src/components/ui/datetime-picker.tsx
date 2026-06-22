import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function toDateTimePickerValue(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export function toDateTimePickerISOString(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function formatDisplay(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function DateTimePicker({ value, onChange, placeholder, className }: DateTimePickerProps) {
  const { language, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => {
    if (value) return new Date(value).getFullYear()
    return new Date().getFullYear()
  })
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) return new Date(value).getMonth()
    return new Date().getMonth()
  })

  const parsed = value ? new Date(value) : null
  const selectedDay = parsed ? parsed.getDate() : null
  const selectedMonth = parsed ? parsed.getMonth() : null
  const selectedYear = parsed ? parsed.getFullYear() : null

  const [hour, setHour] = useState(parsed ? pad(parsed.getHours()) : '00')
  const [minute, setMinute] = useState(parsed ? pad(parsed.getMinutes()) : '00')

  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)
  const effectivePlaceholder = placeholder || t('dateTimePicker.placeholder')
  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(language, { month: 'long' }).format(new Date(viewYear, viewMonth, 1))
  }, [language, viewMonth, viewYear])
  const weekdayLabels = useMemo(() => {
    const baseSunday = new Date(2024, 0, 7)
    return Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(language, { weekday: 'short' }).format(new Date(baseSunday.getFullYear(), baseSunday.getMonth(), baseSunday.getDate() + index)),
    )
  }, [language])

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
        setHour(pad(d.getHours()))
        setMinute(pad(d.getMinutes()))
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      }
    }
  }, [value])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const today = new Date()

  const buildValue = (year: number, month: number, day: number, h: string, m: string) => {
    return `${year}-${pad(month + 1)}-${pad(day)}T${h}:${m}`
  }

  const handleDayClick = (day: number) => {
    const newValue = buildValue(viewYear, viewMonth, day, hour, minute)
    onChange(newValue)
  }

  const handleTimeChange = (newHour: string, newMinute: string) => {
    if (parsed && selectedYear !== null && selectedMonth !== null && selectedDay !== null) {
      onChange(buildValue(selectedYear, selectedMonth, selectedDay, newHour, newMinute))
    }
  }

  const handleHourSelect = (h: number) => {
    const padded = pad(h)
    setHour(padded)
    handleTimeChange(padded, minute)
  }

  const handleMinuteSelect = (m: number) => {
    const padded = pad(m)
    setMinute(padded)
    handleTimeChange(hour, padded)
  }

  const scrollToSelected = useCallback(() => {
    const ITEM_H = 28
    if (hourListRef.current) {
      const h = parseInt(hour) || 0
      hourListRef.current.scrollTop = h * ITEM_H
    }
    if (minuteListRef.current) {
      const m = parseInt(minute) || 0
      minuteListRef.current.scrollTop = m * ITEM_H
    }
  }, [hour, minute])

  useEffect(() => {
    if (open) {
      requestAnimationFrame(scrollToSelected)
    }
  }, [open, scrollToSelected])

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const setNow = () => {
    const now = new Date()
    const h = pad(now.getHours())
    const m = pad(now.getMinutes())
    setHour(h)
    setMinute(m)
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    onChange(buildValue(now.getFullYear(), now.getMonth(), now.getDate(), h, m))
  }

  const handleClearPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleClearMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    onChange('')
    setHour('00')
    setMinute('00')
  }

  const handleTimeListWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.currentTarget.scrollTop += event.deltaY
    event.preventDefault()
  }

  const stopTouchPropagation = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const displayValue = formatDisplay(value)

  return (
    <>
      <div className="relative sm:hidden">
        <Input
          type="datetime-local"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn('pr-10', className)}
          aria-label={effectivePlaceholder}
        />
        {value && (
          <button
            type="button"
            aria-label={t('dateTimePicker.clear')}
            className="absolute right-3 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            onPointerDown={handleClearPointerDown}
            onMouseDown={handleClearMouseDown}
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="hidden sm:block">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="relative block">
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'h-9 w-full justify-between gap-2 pr-8 text-left font-normal',
                  !value && 'text-muted-foreground',
                  className
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs">{displayValue || effectivePlaceholder}</span>
                </span>
              </Button>
            </PopoverTrigger>
            {value && (
              <button
                type="button"
                aria-label={t('dateTimePicker.clear')}
                className="absolute right-2 top-1/2 inline-flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                onPointerDown={handleClearPointerDown}
                onMouseDown={handleClearMouseDown}
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <PopoverContent className="w-[320px] p-0" align="start">
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {monthLabel} {viewYear}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-0">
                {weekdayLabels.map((dayLabel) => (
                  <div key={dayLabel} className="py-1 text-center text-xs font-medium text-muted-foreground">
                    {dayLabel}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-8 w-8" />
                  }
                  const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear
                  const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        'h-8 w-8 rounded-md text-xs font-medium transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                        isToday && !isSelected && 'border border-primary/50 text-primary',
                      )}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              <div className="mt-3 border-t pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{hour}:{minute}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={setNow}>
                    {t('dateTimePicker.now')}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="mb-1 text-center text-xs text-muted-foreground">{t('dateTimePicker.hour')}</div>
                    <div
                      ref={hourListRef}
                      className="h-[140px] touch-pan-y overflow-y-auto overscroll-contain rounded-md border"
                      onWheel={handleTimeListWheel}
                      onTouchMoveCapture={stopTouchPropagation}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleHourSelect(i)}
                          className={cn(
                            'h-7 w-full text-center text-xs transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            pad(i) === hour && 'bg-primary text-primary-foreground hover:bg-primary/90',
                          )}
                        >
                          {pad(i)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-center text-xs text-muted-foreground">{t('dateTimePicker.minute')}</div>
                    <div
                      ref={minuteListRef}
                      className="h-[140px] touch-pan-y overflow-y-auto overscroll-contain rounded-md border"
                      onWheel={handleTimeListWheel}
                      onTouchMoveCapture={stopTouchPropagation}
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleMinuteSelect(i)}
                          className={cn(
                            'h-7 w-full text-center text-xs transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            pad(i) === minute && 'bg-primary text-primary-foreground hover:bg-primary/90',
                          )}
                        >
                          {pad(i)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
