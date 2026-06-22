import { useState } from 'react'
import { Save } from 'lucide-react'

import { PageSurface } from '@/components/layout/PageScaffold'
import { TabbedSettingsPage } from '@/components/layout/TabbedSettingsPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

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

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [siteName, setSiteName] = useState('Acme Console')
  const [contact, setContact] = useState('ops@example.com')
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)

  const save = () => {
    // 真实项目里这里 await 一个 api/client 调用;模板只演示反馈链路。
    setMessage({ type: 'success', text: '设置已保存' })
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
          <div className="grid gap-5 sm:max-w-md">
            <div className="space-y-2">
              <Label htmlFor="site-name">站点名称</Label>
              <Input id="site-name" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">联系邮箱</Label>
              <Input id="contact" type="email" value={contact} onChange={(event) => setContact(event.target.value)} />
            </div>
          </div>
        </PageSurface>
      ) : (
        <PageSurface title="界面偏好" description="影响布局密度与动效。">
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
