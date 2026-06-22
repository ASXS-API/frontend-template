import { useCallback, useEffect, useState, type DependencyList } from 'react'

import { logError } from '@/lib/logger'

export interface ResourceState<T> {
  data: T | null
  loading: boolean
  error: string | null
  /** 手动重新拉取(忽略上次结果,重新进入 loading)。 */
  refresh: () => void
}

/**
 * 标准异步数据获取 hook —— 取代每个页面手搓的
 * `useEffect + loading + error + 用 refreshKey 透传刷新` 这套样板。
 *
 * 职责:
 *   - deps 变化或调用 refresh() 时重新拉取
 *   - 处理竞态:后发请求/卸载后不再 setState,旧请求结果被丢弃
 *   - 统一把异常转成可展示的 error 字符串,并打到结构化日志
 *
 * @example
 * const { data, loading, error, refresh } = useResource(
 *   () => getOverview(range),
 *   [range],
 * )
 * if (loading) return <InlineLoader />
 * if (error) return <ErrorState message={error} onRetry={refresh} />
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): ResourceState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : '加载失败'
        setError(message)
        logError('resource.load_failed', { error: message })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // fetcher 每次 render 都是新引用,刻意只依赖调用方声明的 deps + nonce。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, refresh }
}
