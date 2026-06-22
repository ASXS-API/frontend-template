import { useEffect, useRef, useState } from 'react'

import { motion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface ScrollableTabBarTab<T extends string> {
  key: T
  label: string
}

interface ScrollableTabBarProps<T extends string> {
  tabs: ScrollableTabBarTab<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  indicatorId: string
  showBorder?: boolean
  outerClassName?: string
  innerClassName?: string
  buttonClassName?: string
}

export function ScrollableTabBar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  indicatorId,
  showBorder = true,
  outerClassName,
  innerClassName,
  buttonClassName,
}: ScrollableTabBarProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartScrollLeftRef = useRef(0)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const suppressClickRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = (event: MouseEvent) => {
    const container = scrollRef.current
    if (!draggingRef.current || !container) {
      return
    }

    const deltaX = event.clientX - dragStartXRef.current
    if (Math.abs(deltaX) > 4) {
      movedRef.current = true
    }

    container.scrollLeft = dragStartScrollLeftRef.current - deltaX

    if (movedRef.current) {
      event.preventDefault()
    }
  }

  const stopDragging = () => {
    draggingRef.current = false
    setIsDragging(false)

    if (movedRef.current) {
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  const handleMouseUp = () => {
    stopDragging()
  }

  useEffect(() => {
    if (!isDragging) {
      return
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    return () => {
      draggingRef.current = false
    }
  }, [])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    const container = scrollRef.current
    if (!container) {
      return
    }

    draggingRef.current = true
    movedRef.current = false
    dragStartXRef.current = event.clientX
    dragStartScrollLeftRef.current = container.scrollLeft
    setIsDragging(true)
  }

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      className={cn(
        'overflow-x-auto overflow-y-hidden pb-0 touch-pan-x select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        showBorder && 'border-b',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        outerClassName,
      )}
    >
      <div className={cn('flex min-w-max items-center gap-1', innerClassName)}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={(event) => {
              if (suppressClickRef.current) {
                event.preventDefault()
                return
              }
              onTabChange(tab.key)
            }}
            className={cn(
              'relative rounded-t-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors md:px-4',
              activeTab === tab.key
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80',
              buttonClassName,
            )}
          >
            {tab.label}
            {activeTab === tab.key ? (
              <motion.div
                layoutId={indicatorId}
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
