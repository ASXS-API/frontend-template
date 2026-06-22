import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'

import { ThemeContext, useTheme, type Theme } from '@/components/theme-context'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const THEME_STORAGE_KEY = 'app:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

function readSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const root = document.documentElement
  root.classList.add('theme-switching')
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      root.classList.remove('theme-switching')
    })
  })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedTheme, setStoredTheme] = useState<Theme | null>(() => readStoredTheme())
  const [systemTheme, setSystemTheme] = useState<Theme>(() => readSystemTheme())
  const theme = storedTheme ?? systemTheme

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia(DARK_QUERY)
    const syncSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light')

    syncSystemTheme()
    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return
      setStoredTheme(isTheme(event.newValue) ? event.newValue : null)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    setStoredTheme(nextTheme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {}
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

interface ThemeToggleButtonProps {
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  compact?: boolean
  showLabel?: boolean
}

export function ThemeToggleButton({
  className,
  side = 'bottom',
  compact = false,
  showLabel = false,
}: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? '切换到浅色模式' : '切换到深色模式'
  const buttonText = isDark ? '浅色' : '深色'
  const expanded = showLabel && !compact

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size={expanded ? undefined : 'icon'}
            className={cn(
              expanded ? 'gap-2' : compact ? 'h-9 w-9 rounded-md' : 'h-9 w-9 rounded-full',
              className,
            )}
            onClick={toggleTheme}
            aria-label={label}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {expanded ? <span>{buttonText}</span> : null}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

