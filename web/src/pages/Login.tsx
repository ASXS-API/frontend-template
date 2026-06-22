import { FormEvent, useState } from 'react'
import { Boxes, Loader2, LogIn } from 'lucide-react'

import { login } from '@/api/auth'
import { ThemeToggleButton } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BRAND_NAME } from '@/config'
import { motion } from '@/lib/motion'

interface LoginProps {
  onAuthenticated: () => void
}

export default function Login({ onAuthenticated }: LoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(password)
      onAuthenticated()
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="fixed right-4 top-4 z-10">
        <ThemeToggleButton />
      </div>
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-sm rounded-2xl p-6"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="dashboard-brand-mark flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{BRAND_NAME}</h1>
            <p className="text-sm text-muted-foreground">输入密码登录</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            autoComplete="current-password"
          />
        </div>

        {error ? <div className="mt-3 text-sm text-destructive">{error}</div> : null}

        <Button type="submit" className="mt-5 w-full gap-2" disabled={submitting || !password}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          登录
        </Button>
      </motion.form>
    </div>
  )
}
