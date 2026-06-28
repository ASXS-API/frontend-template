import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Language = 'zh-CN'

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const dictionary: Record<string, string> = {
  'common.cancel': '取消',
  'common.close': '关闭',
  'common.confirm': '确认',
  'dateTimePicker.placeholder': '选择日期时间',
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function translateDynamicText(value: string, language?: Language): string {
  void language
  return value
}

export function translateMessage(key: string, params?: Record<string, string | number>): string {
  return interpolate(dictionary[key] || key, params)
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return Object.entries(params).reduce((text, [key, value]) => text.replace(`{${key}}`, String(value)), template)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh-CN')
  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, params) => translateMessage(key, params),
  }), [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (context) return context
  return {
    language: 'zh-CN',
    setLanguage: () => {},
    t: (key, params) => translateMessage(key, params),
  }
}
