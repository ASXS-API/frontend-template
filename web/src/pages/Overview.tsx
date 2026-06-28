import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { getOverview, type ActivityRow, type OverviewRange } from '@/api/demo'
import { InlineLoader } from '@/components/PageLoader'
import { DataTableToolbar } from '@/components/layout/DataTableToolbar'
import { FilterBar, FilterField } from '@/components/layout/FilterBar'
import { PageShell, PageStat, PageStatStrip, PageSurface } from '@/components/layout/PageScaffold'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Combobox } from '@/components/ui/combobox'
import { DateRangePicker, type DateRangeValue } from '@/components/ui/date-range-picker'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { Pagination } from '@/components/ui/pagination'
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

function formatCompactAxisValue(value: number, prefix = ''): string {
  if (!Number.isFinite(value)) return '-'

  const abs = Math.abs(value)
  const compact = (nextValue: number, suffix: string) => `${nextValue.toFixed(1).replace(/\.0$/, '')}${suffix}`

  if (abs >= 1_000_000_000) return `${prefix}${compact(value / 1_000_000_000, 'B')}`
  if (abs >= 1_000_000) return `${prefix}${compact(value / 1_000_000, 'M')}`
  if (abs >= 1_000) return `${prefix}${compact(value / 1_000, 'K')}`

  return `${prefix}${Math.round(value).toLocaleString('zh-CN')}`
}

const STATUS_META: Record<ActivityRow['status'], { label: string; tone: string }> = {
  active: { label: '正常', tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  pending: { label: '待处理', tone: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  failed: { label: '失败', tone: 'border-destructive/35 bg-destructive/10 text-destructive' },
}

type ActivityStatusFilter = 'all' | ActivityRow['status']

const STATUS_OPTIONS: Array<{ value: ActivityStatusFilter; label: string; description?: string }> = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: STATUS_META.active.label, description: '当前进展正常' },
  { value: 'pending', label: STATUS_META.pending.label, description: '需要人工跟进' },
  { value: 'failed', label: STATUS_META.failed.label, description: '处理失败或异常' },
]

const ACTIVITY_PAGE_SIZE = 3

export default function Overview() {
  const [range, setRange] = useState<OverviewRange>('7d')
  const [activitySearch, setActivitySearch] = useState('')
  const [activityStatus, setActivityStatus] = useState<ActivityStatusFilter>('all')
  const [activityDateRange, setActivityDateRange] = useState<DateRangeValue>({ from: '', to: '' })
  const [activityPage, setActivityPage] = useState(1)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const { data, loading, error, refresh } = useResource(() => getOverview(range), [range])

  const deltaUp = (data?.revenueDelta ?? 0) >= 0
  const chartMargin = isCompactViewport
    ? { top: 8, right: 4, left: 8, bottom: 0 }
    : { top: 8, right: 12, left: -4, bottom: 0 }
  const compactAxisProps = isCompactViewport ? { width: 44, tick: { fontSize: 10 } } : {}
  const filteredRows = useMemo(() => {
    const keyword = activitySearch.trim().toLocaleLowerCase('zh-CN')
    return (data?.rows ?? []).filter((row) => {
      if (activityStatus !== 'all' && row.status !== activityStatus) return false

      const rowDate = row.updatedAt.slice(0, 10)
      if (activityDateRange.from && rowDate < activityDateRange.from) return false
      if (activityDateRange.to && rowDate > activityDateRange.to) return false

      if (!keyword) return true
      return [row.id, row.name, row.channel, STATUS_META[row.status].label]
        .join(' ')
        .toLocaleLowerCase('zh-CN')
        .includes(keyword)
    })
  }, [activityDateRange.from, activityDateRange.to, activitySearch, activityStatus, data?.rows])
  const visibleRows = filteredRows.slice((activityPage - 1) * ACTIVITY_PAGE_SIZE, activityPage * ACTIVITY_PAGE_SIZE)

  useEffect(() => {
    setActivityPage(1)
  }, [activityDateRange.from, activityDateRange.to, activitySearch, activityStatus, range])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 430px)')
    const syncViewport = () => setIsCompactViewport(media.matches)

    syncViewport()
    media.addEventListener('change', syncViewport)
    return () => media.removeEventListener('change', syncViewport)
  }, [])

  const resetActivityFilters = () => {
    setActivitySearch('')
    setActivityStatus('all')
    setActivityDateRange({ from: '', to: '' })
  }

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
          <ErrorState message={error} onRetry={refresh} />
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
            <PageSurface title="营收趋势" description="面积折线用于展示连续指标,弱化网格和坐标轴,突出走势与对比。" bodyClassName="space-y-4">
              <div className="h-[300px] min-w-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart accessibilityLayer data={data.trend} margin={chartMargin}>
                    <defs>
                      <linearGradient id="overviewRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.36} />
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="overviewCostFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={isCompactViewport ? 4 : 8}
                      tick={{ fontSize: isCompactViewport ? 10 : 12 }}
                      minTickGap={isCompactViewport ? 20 : 8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      {...compactAxisProps}
                      tickFormatter={(value) => formatCompactAxisValue(Number(value), '¥')}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(value) => String(value)}
                          formatter={(value, name) => (
                            <div className="flex min-w-32 items-center justify-between gap-4">
                              <span className="text-muted-foreground">{chartConfig[String(name)]?.label ?? String(name)}</span>
                              <span className="font-mono text-foreground">{formatCurrency(Number(value || 0))}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Area
                      type="monotoneX"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      fill="url(#overviewRevenueFill)"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotoneX"
                      dataKey="cost"
                      stroke="var(--color-cost)"
                      strokeWidth={2}
                      fill="url(#overviewCostFill)"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </PageSurface>

            <PageSurface title="每日营收" description="柱状图用于强调单日规模,限制柱宽并使用渐变填充。">
              <div className="h-[300px] min-w-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart accessibilityLayer data={data.trend} margin={chartMargin}>
                    <defs>
                      <linearGradient id="overviewRevenueBarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.42} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={isCompactViewport ? 4 : 8}
                      tick={{ fontSize: isCompactViewport ? 10 : 12 }}
                      minTickGap={isCompactViewport ? 20 : 8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      {...compactAxisProps}
                      tickFormatter={(value) => formatCompactAxisValue(Number(value), '¥')}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(value) => String(value)}
                          formatter={(value) => formatCurrency(Number(value || 0))}
                        />
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="url(#overviewRevenueBarFill)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={36}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </PageSurface>
          </div>

          <div className="grid gap-4">
            <PageSurface
              title="最近活动"
              description="表格页范本:搜索 + 筛选栏 + 空态 + 分页。"
              bodyClassName="p-0"
              footer={
                <Pagination
                  page={activityPage}
                  pageSize={ACTIVITY_PAGE_SIZE}
                  total={filteredRows.length}
                  onPageChange={setActivityPage}
                  className="w-full"
                />
              }
            >
              <DataTableToolbar
                searchValue={activitySearch}
                onSearchChange={setActivitySearch}
                searchPlaceholder="搜索客户、渠道、状态..."
                filters={
                  <FilterBar onReset={resetActivityFilters} className="w-full border-0 bg-transparent p-0">
                    <FilterField label="状态">
                      <Combobox
                        options={STATUS_OPTIONS}
                        value={activityStatus}
                        onValueChange={(nextValue) => setActivityStatus(nextValue as ActivityStatusFilter)}
                        searchPlaceholder="搜索状态..."
                      />
                    </FilterField>
                    <FilterField label="更新时间">
                      <DateRangePicker value={activityDateRange} onChange={setActivityDateRange} />
                    </FilterField>
                  </FilterBar>
                }
              />
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
                    {visibleRows.length ? (
                      visibleRows.map((row) => {
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
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <EmptyState title="没有匹配活动" description="调整关键词、状态或日期范围后再试。" />
                        </TableCell>
                      </TableRow>
                    )}
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
