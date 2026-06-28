import { useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'

import { FormField, FormSection } from '@/components/layout/FormScaffold'
import { PageSurface } from '@/components/layout/PageScaffold'
import { TabbedSettingsPage } from '@/components/layout/TabbedSettingsPage'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Switch } from '@/components/ui/switch'
import { useConfirm } from '@/components/ui/use-confirm'

/**
 * 参考页 —— 「带选项卡的设置页」范本。
 * TabbedSettingsPage 负责标题、可横向滚动的选项卡、切换动画;
 * 保存成功通过 message 回传,组件内部统一弹全局 toast(见 GlobalToastProvider)。
 */

type Tab = 'general' | 'appearance'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'general', label: '通用' },
  { key: 'appearance', label: '外观' },
]

const OWNER_OPTIONS = [
  { value: 'ops', label: '运营团队', description: '默认处理后台配置与日常发布', keywords: ['operation', 'owner'] },
  { value: 'growth', label: '增长团队', description: '负责活动、渠道和转化配置', keywords: ['marketing', 'growth'] },
  { value: 'support', label: '客服团队', description: '负责用户支持与工单流转', keywords: ['service', 'support'] },
]

const FEATURE_OPTIONS = [
  { value: 'audit-log', label: '审计日志', description: '记录关键配置变更' },
  { value: 'export', label: '数据导出', description: '开放后台 CSV 导出能力' },
  { value: 'webhook', label: 'Webhook', description: '业务事件推送到外部系统' },
  { value: 'beta-panel', label: '灰度面板', description: '控制实验功能开关' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const confirm = useConfirm()

  const [siteName, setSiteName] = useState('Acme Console')
  const [contact, setContact] = useState('ops@example.com')
  const [owner, setOwner] = useState('ops')
  const [features, setFeatures] = useState(['audit-log', 'export'])
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)

  const save = async () => {
    // 真实项目里这里 await 一个 api/client 调用;模板只演示反馈链路。
    const confirmed = await confirm({
      title: '保存设置',
      description: '确认保存当前页面配置? 真实项目中这里通常会接 api/client 的保存接口。',
      confirmText: '保存',
    })
    if (!confirmed) return
    setMessage({ type: 'success', text: '设置已保存' })
  }

  const resetAppearance = async () => {
    const confirmed = await confirm({
      title: '恢复默认外观',
      description: '将关闭紧凑模式并重新启用页面动效。这个动作会覆盖当前外观偏好。',
      confirmText: '恢复默认',
      variant: 'destructive',
    })
    if (!confirmed) return
    setCompactMode(false)
    setAnimations(true)
    setMessage({ type: 'success', text: '外观偏好已恢复默认' })
  }

  return (
    <TabbedSettingsPage
      title="设置"
      description="带选项卡的配置页范本。"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      indicatorId="settings-tabs"
      message={message}
      headerActions={
        <Button type="button" className="gap-2" onClick={save}>
          <Save className="h-4 w-4" />
          保存
        </Button>
      }
    >
      {activeTab === 'general' ? (
        <PageSurface title="基本信息" description="展示名称与联系方式。">
          <FormSection className="sm:max-w-lg">
            <FormField label="站点名称" htmlFor="site-name" required>
              <Input id="site-name" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
            </FormField>
            <FormField label="联系邮箱" htmlFor="contact" description="用于系统通知、审计提醒和异常告警。">
              <Input id="contact" type="email" value={contact} onChange={(event) => setContact(event.target.value)} />
            </FormField>
            <FormField label="负责团队" description="可搜索的单选组件,替代原生 select。">
              <Combobox options={OWNER_OPTIONS} value={owner} onValueChange={setOwner} searchPlaceholder="搜索团队..." />
            </FormField>
            <FormField label="启用能力" description="可搜索的多选组件,适合标签、角色、能力开关等场景。">
              <MultiSelect options={FEATURE_OPTIONS} value={features} onValueChange={setFeatures} searchPlaceholder="搜索能力..." />
            </FormField>
          </FormSection>
        </PageSurface>
      ) : (
        <PageSurface
          title="界面偏好"
          description="影响布局密度与动效。"
          actions={
            <Button type="button" variant="outline" size="sm" className="gap-2" onClick={resetAppearance}>
              <RotateCcw className="h-4 w-4" />
              恢复默认
            </Button>
          }
        >
          <div className="space-y-4 sm:max-w-md">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3">
              <span>
                <span className="block text-sm font-medium">紧凑模式</span>
                <span className="block text-xs text-muted-foreground">收紧间距以容纳更多内容</span>
              </span>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3">
              <span>
                <span className="block text-sm font-medium">页面动效</span>
                <span className="block text-xs text-muted-foreground">关闭后切换页面不再有过渡动画</span>
              </span>
              <Switch checked={animations} onCheckedChange={setAnimations} />
            </label>
          </div>
        </PageSurface>
      )}
    </TabbedSettingsPage>
  )
}
