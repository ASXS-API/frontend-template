import { useEffect, useLayoutEffect, useState } from 'react'

import {
  activateNotoSansScFullFont,
  isNotoSansScFullFontActive,
  isNotoSansScFullFontReady,
  loadNotoSansScFullFont,
} from '@/lib/font-loading'

export function FontLoadCoordinator() {
  const [fontReady, setFontReady] = useState(() => isNotoSansScFullFontReady())

  useLayoutEffect(() => {
    if (!fontReady || isNotoSansScFullFontActive()) return
    activateNotoSansScFullFont()
  }, [fontReady])

  useEffect(() => {
    if (typeof window === 'undefined' || fontReady) return

    let cancelled = false
    const startLoad = () => {
      void loadNotoSansScFullFont().then((loaded) => {
        if (!loaded || cancelled) return
        activateNotoSansScFullFont()
        setFontReady(true)
      })
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(startLoad, { timeout: 2400 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(idleId)
      }
    }

    const timeoutId = globalThis.setTimeout(startLoad, 1200)
    return () => {
      cancelled = true
      globalThis.clearTimeout(timeoutId)
    }
  }, [fontReady])

  return null
}
