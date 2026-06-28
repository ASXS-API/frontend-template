import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { nsKey } from '@/config'
import { FontLoadCoordinator } from '@/components/font-load-coordinator'
import { ThemeProvider } from '@/components/theme'
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog'
import { GlobalToastProvider } from '@/components/ui/global-toast'
import { I18nProvider } from '@/i18n'
import { installBrowserErrorLogging, logError, logWarn } from '@/lib/logger'

import App from './App'
import './fonts.css'
import './index.css'

// 部署后 chunk 文件名(hash)会变,旧页面动态 import 旧 chunk 会 404。
// 监听 vite:preloadError,自动整页 reload 一次;用 sessionStorage 标记防止死循环。
const CHUNK_RELOAD_MARKER = nsKey('chunk-reload-attempted')

if (typeof window !== 'undefined') {
  installBrowserErrorLogging()

  window.addEventListener('vite:preloadError', (event) => {
    if (window.sessionStorage.getItem(CHUNK_RELOAD_MARKER) === '1') {
      logError('vite.preload_failed_after_reload', { error: String(event) })
      return
    }

    event.preventDefault()
    logWarn('vite.preload_failed_reload', { error: String(event) })
    window.sessionStorage.setItem(CHUNK_RELOAD_MARKER, '1')
    window.location.reload()
  })

  window.addEventListener(
    'load',
    () => {
      window.sessionStorage.removeItem(CHUNK_RELOAD_MARKER)
    },
    { once: true },
  )
}

// Provider 顺序:主题 → i18n → 全局 toast。
// GlobalToastProvider 依赖 useI18n,必须在 I18nProvider 之内。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <GlobalToastProvider>
          <ConfirmDialogProvider>
            <FontLoadCoordinator />
            <App />
          </ConfirmDialogProvider>
        </GlobalToastProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
