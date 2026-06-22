import { lazy, Suspense, useEffect, useState } from 'react'

import { getAuthStatus } from '@/api/auth'
import { ChunkLoadBoundary } from '@/components/ChunkLoadBoundary'
import { PageLoader } from '@/components/PageLoader'
import { BRAND_NAME } from '@/config'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))

/**
 * 应用根:只负责「鉴权门」—— 查一次登录态,未登录给 Login,已登录给 Dashboard。
 * 真正的页面路由(用 useState 切页,不引 router)在 Dashboard 里,理由见 README。
 */
export default function App() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let cancelled = false
    getAuthStatus()
      .then((status) => {
        if (!cancelled) setAuthenticated(status)
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (checking) return <PageLoader />

  return (
    <ChunkLoadBoundary scopeLabel={BRAND_NAME}>
      <Suspense fallback={<PageLoader />}>
        {authenticated ? (
          <Dashboard onLogout={() => setAuthenticated(false)} />
        ) : (
          <Login onAuthenticated={() => setAuthenticated(true)} />
        )}
      </Suspense>
    </ChunkLoadBoundary>
  )
}
