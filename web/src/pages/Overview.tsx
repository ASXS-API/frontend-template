import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { getOverview, type ActivityRow, type OverviewRange } from '@/api/demo'
import { InlineLoader } from '@/components/PageLoader'
import { PageShell, PageStat, PageStatStrip, PageSurface } from '@/components/layout/PageScaffold'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { motion, staggerContainer, staggerItem } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useResource } from '@/lib/use-resource'

/**
 * 参考页 —— 一个数据页「该长什么样」的范本,新页面照着抄结构:
 *   PageShell(标题 + 操作区)
 *     └ PageStatStrip / PageStat   关键指标
 *     └ PageSurface                每一块内容(图表 / 表格 / 列表)的统一卡片
 *
 * 数据通过 useResource 获取:loading / error / refresh 都不用手写。
 * 页面只描述「展示什么」,不关心「怎么取数据、长什么颜色」。
 */

const RANGE_OPTIONS: Array<[OverviewRange, string]> = [
  ['7d', '近 7 天'],
  ['30d', '近 30 天'],
]

const chartConfig: ChartConfig = {
  revenue: { label: '营收', color: 'hsl(var(--chart-1))' },
  cost: { label: '成本', color: 'hsl(var(--chart-2))' },
}

const STATUS_META: Record<ActivityRow['status'], { label: string; tone: string }> = {
  active: { label: '正常', tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  pending: { label: '待处理', tone: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  failed: { label: '失败', tone: 'border-destructive/35 bg-destructive/10 text-destructive' },
}

export default function Overview() {
  const [range, setRange] = useState<OverviewRange>('7d')
  const { data, loading, error, refresh } = useResource(() => getOverview(range), [range])

  const deltaUp = (data?.revenueDelta ?? 0) >= 0

  return (
    <PageShell
      title="概览"
      description="一个数据页的结构范本:指标条 + 趋势图 + 明细表。"
      width="7xl"
      actions={
        <>
          <div className="flex rounded-md border border-border/70 bg-background/80 p-0.5">
            {RANGE_OPTIONS.map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={range === value ? 'default' : 'ghost'}
                size="sm"
                className="h-7 rounded-md px-2.5 text-xs"
                onClick={() => setRange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={refresh} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            刷新
          </Button>
        </>
      }
    >
      {error ? (
        <PageSurface>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button type="button" variant="outline" size="sm" onClick={refresh}>
              重试
            </Button>
          </div>
        </PageSurface>
      ) : loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <InlineLoader />
        </div>
      ) : data ? (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          <PageStatStrip>
            <motion.div variants={staggerItem}>
              <PageStat
                label="总营收"
                value={formatCurrency(data.totalRevenue)}
                note={
                  <span className={cn('inline-flex items-center gap-1', deltaUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                    {deltaUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {(data.revenueDelta * 100).toFixed(1)}% 环比
                  </span>
                }
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <PageStat label="活跃用户" value={formatNumber(data.activeUsers)} note="区间内去重" />
            </motion.div>
            <motion.div variants={staggerItem}>
              <PageStat label="总成本" value={formatCurrency(data.totalCost)} note="含渠道分摊" />
            </motion.div>
            <motion.div variants={staggerItem}>
              <PageStat label="待处理" value={formatNumber(data.pendingCount)} note="需人工跟进" />
            </motion.div>
          </PageStatStrip>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <PageSurface title="营收趋势" bodyClassName="space-y-4">
              <div className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart data={data.trend} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `¥${Number(value).toLocaleString('zh-CN')}`} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => (
                            <div className="flex min-w-32 items-center justify-between gap-4">
                              <span className="text-muted-foreground">{chartConfig[String(name)]?.label ?? String(name)}</span>
                              <span className="font-mono text-foreground">{formatCurrency(Number(value || 0))}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </PageSurface>

            <PageSurface title="最近活动" bodyClassName="p-0">
              <div className="ops-table-shell border-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>客户</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.map((row) => {
                      const meta = STATUS_META[row.status]
                      return (
                        <TableRow key={row.id}>
                          <TableCell>
                            <div className="font-medium">{row.name}</div>
                            <div className="text-xs text-muted-foreground">{row.channel} · {row.updatedAt}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('text-[11px]', meta.tone)}>{meta.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(row.amount)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </PageSurface>
          </div>
        </motion.div>
      ) : null}
    </PageShell>
  )
}
