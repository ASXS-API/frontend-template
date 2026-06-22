/**
 * 演示用的「假后端」—— 让模板 clone 下来后 `npm run dev` 就能看到完整页面,
 * 无需先起后端。接入真实接口时,把 mock 部分换成 apiRequest 即可:
 *
 *   import { apiRequest } from '@/api/client'
 *   export function getOverview(range: OverviewRange) {
 *     return apiRequest<OverviewData>(`/overview?range=${range}`)
 *   }
 *
 * 页面层(useResource)与类型完全不用改 —— 这就是把网络细节关在 api 层的好处。
 */

export type OverviewRange = '7d' | '30d'

export interface TrendPoint {
  date: string
  revenue: number
  cost: number
}

export interface ActivityRow {
  id: string
  name: string
  channel: string
  status: 'active' | 'pending' | 'failed'
  amount: number
  updatedAt: string
}

export interface OverviewData {
  totalRevenue: number
  revenueDelta: number
  activeUsers: number
  totalCost: number
  pendingCount: number
  trend: TrendPoint[]
  rows: ActivityRow[]
}

function buildTrend(days: number, base: number): TrendPoint[] {
  // 用确定性公式造数据,避免 Math.random 带来的每次刷新跳动。
  return Array.from({ length: days }, (_, index) => {
    const wave = Math.sin(index / 2.4) * 0.18 + 1
    const revenue = Math.round(base * wave)
    return {
      date: `D${index + 1}`,
      revenue,
      cost: Math.round(revenue * 0.42),
    }
  })
}

const ROWS: ActivityRow[] = [
  { id: 'o-1042', name: 'Aurora 工作室', channel: '直连', status: 'active', amount: 12880, updatedAt: '2026-06-22 09:14' },
  { id: 'o-1041', name: 'Nimbus 科技', channel: '渠道 A', status: 'pending', amount: 6420, updatedAt: '2026-06-22 08:51' },
  { id: 'o-1040', name: 'Vertex 数据', channel: '渠道 B', status: 'active', amount: 23150, updatedAt: '2026-06-21 22:03' },
  { id: 'o-1039', name: 'Lumen 设计', channel: '直连', status: 'failed', amount: 980, updatedAt: '2026-06-21 19:40' },
  { id: 'o-1038', name: 'Quanta 实验室', channel: '渠道 A', status: 'active', amount: 18760, updatedAt: '2026-06-21 14:27' },
]

const SNAPSHOTS: Record<OverviewRange, OverviewData> = {
  '7d': {
    totalRevenue: 184250,
    revenueDelta: 0.082,
    activeUsers: 1268,
    totalCost: 77380,
    pendingCount: 3,
    trend: buildTrend(7, 26000),
    rows: ROWS,
  },
  '30d': {
    totalRevenue: 792140,
    revenueDelta: -0.031,
    activeUsers: 4915,
    totalCost: 332700,
    pendingCount: 11,
    trend: buildTrend(30, 25000),
    rows: ROWS,
  },
}

export function getOverview(range: OverviewRange): Promise<OverviewData> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(SNAPSHOTS[range]), 320)
  })
}
