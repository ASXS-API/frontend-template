import { Check, ChevronsUpDown, X } from 'lucide-react'
import { useMemo, useState } from 'react'

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

export interface ComboboxProps {
  options: SelectOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  clearable?: boolean
  disabled?: boolean
  className?: string
  contentClassName?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = '请选择',
  searchPlaceholder = '搜索...',
  emptyText = '没有匹配选项',
  clearable = false,
  disabled = false,
  className,
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value])

  const clearSelection = () => {
    onValueChange('')
    setOpen(false)
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
          className={cn('h-9 w-full justify-between px-3 font-normal', !selected && 'text-muted-foreground', className)}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            {selected?.icon ? <span className="shrink-0">{selected.icon}</span> : null}
            <span className="truncate">{selected?.label || placeholder}</span>
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {clearable && selected ? (
              <span
                role="button"
                tabIndex={-1}
                className="rounded-sm p-0.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  clearSelection()
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
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label, option.description || '', ...(option.keywords || [])]}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('h-4 w-4', option.value === value ? 'opacity-100' : 'opacity-0')} />
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    {option.icon ? <span className="shrink-0">{option.icon}</span> : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.description ? <span className="block truncate text-xs text-muted-foreground">{option.description}</span> : null}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
