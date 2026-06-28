import { Check, ChevronsUpDown, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { SelectOption } from '@/components/ui/option-types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface MultiSelectProps {
  options: SelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxPreviewItems?: number
  disabled?: boolean
  className?: string
  contentClassName?: string
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = '请选择',
  searchPlaceholder = '搜索...',
  emptyText = '没有匹配选项',
  maxPreviewItems = 3,
  disabled = false,
  className,
  contentClassName,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedOptions = useMemo(() => options.filter((option) => value.includes(option.value)), [options, value])
  const selectedSet = useMemo(() => new Set(value), [value])
  const visibleOptions = selectedOptions.slice(0, maxPreviewItems)
  const overflowCount = Math.max(selectedOptions.length - visibleOptions.length, 0)

  const toggleValue = (nextValue: string) => {
    if (selectedSet.has(nextValue)) {
      onValueChange(value.filter((item) => item !== nextValue))
      return
    }
    onValueChange([...value, nextValue])
  }

  const removeValue = (nextValue: string) => {
    onValueChange(value.filter((item) => item !== nextValue))
  }

  const clearAll = () => {
    onValueChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('min-h-9 h-auto w-full justify-between px-3 py-1.5 font-normal', !selectedOptions.length && 'text-muted-foreground', className)}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length ? (
              <>
                {visibleOptions.map((option) => (
                  <Badge key={option.value} variant="secondary" className="max-w-[11rem] gap-1 pr-1">
                    <span className="truncate">{option.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      className="rounded-sm p-0.5 text-muted-foreground transition hover:bg-background/70 hover:text-foreground"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        removeValue(option.value)
                      }}
                      aria-label={`移除 ${option.label}`}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
                {overflowCount ? <Badge variant="outline">+{overflowCount}</Badge> : null}
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {selectedOptions.length ? (
              <span
                role="button"
                tabIndex={-1}
                className="rounded-sm p-0.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  clearAll()
                }}
                aria-label="清空选择"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            ) : null}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[--radix-popover-trigger-width] p-0', contentClassName)} align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const selected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, option.description || '', ...(option.keywords || [])]}
                    disabled={option.disabled}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Check className={cn('h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      {option.icon ? <span className="shrink-0">{option.icon}</span> : null}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description ? <span className="block truncate text-xs text-muted-foreground">{option.description}</span> : null}
                      </span>
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
