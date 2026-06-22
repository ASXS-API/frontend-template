import { apiRequest, clearAuthToken, getAuthToken, setAuthToken } from '@/api/client'

/**
 * 鉴权相关接口。token 的存取与请求头注入都在 api/client 里,
 * 这里只负责登录 / 登出 / 状态查询三个动作。
 *
 * 模板假设后端是「单密码 + Bearer token」的最简方案,换成账号密码 /
 * OAuth 时只改这个文件,api/client 与页面层不用动。
 */

export async function login(password: string): Promise<void> {
  const result = await apiRequest<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  setAuthToken(result.token)
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST', body: '{}' })
  } finally {
    clearAuthToken()
  }
}

export async function getAuthStatus(): Promise<boolean> {
  if (!getAuthToken()) return false
  const result = await apiRequest<{ authenticated: boolean }>('/auth/status')
  return Boolean(result.authenticated)
}
