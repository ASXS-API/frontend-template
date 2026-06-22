const NOTO_SANS_SC_FULL_READY_KEY = 'app:font:noto-sc-full-ready'
const NOTO_SANS_SC_FULL_DATA_ATTRIBUTE = 'data-noto-sc-full'
const NOTO_SANS_SC_FULL_STYLESHEET_ID = 'noto-sc-full-font-stylesheet'
const NOTO_SANS_SC_FULL_GOOGLEAPIS_PRECONNECT_ID = 'noto-sc-full-googleapis-preconnect'
const NOTO_SANS_SC_FULL_GSTATIC_PRECONNECT_ID = 'noto-sc-full-gstatic-preconnect'
const NOTO_SANS_SC_FULL_STYLESHEET_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
const NOTO_SANS_SC_FULL_SAMPLE_TEXT = '正在加载页面'

let fullFontLoadPromise: Promise<boolean> | null = null

function ensureHeadLink({
  id,
  rel,
  href,
  crossOrigin,
}: {
  id: string
  rel: string
  href: string
  crossOrigin?: string
}) {
  const existing = document.getElementById(id)
  if (existing instanceof HTMLLinkElement) return existing

  const link = document.createElement('link')
  link.id = id
  link.rel = rel
  link.href = href
  if (crossOrigin !== undefined) link.crossOrigin = crossOrigin
  if (rel === 'stylesheet') {
    link.addEventListener('load', () => { link.dataset.loaded = '1' }, { once: true })
    link.addEventListener('error', () => { link.dataset.error = '1' }, { once: true })
  }
  document.head.append(link)
  return link
}

function ensureNotoSansScFullFontStylesheet() {
  ensureHeadLink({
    id: NOTO_SANS_SC_FULL_GOOGLEAPIS_PRECONNECT_ID,
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  })
  ensureHeadLink({
    id: NOTO_SANS_SC_FULL_GSTATIC_PRECONNECT_ID,
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: '',
  })
  return ensureHeadLink({
    id: NOTO_SANS_SC_FULL_STYLESHEET_ID,
    rel: 'stylesheet',
    href: NOTO_SANS_SC_FULL_STYLESHEET_HREF,
  })
}

function markNotoSansScFullFontReady() {
  try {
    window.localStorage.setItem(NOTO_SANS_SC_FULL_READY_KEY, '1')
  } catch {}
}

async function waitForStylesheetLoad(link: HTMLLinkElement) {
  if (link.dataset.loaded === '1') return
  if (link.dataset.error === '1') throw new Error('Noto Sans SC stylesheet failed to load.')

  await new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      link.dataset.loaded = '1'
      cleanup()
      resolve()
    }
    const handleError = () => {
      link.dataset.error = '1'
      cleanup()
      reject(new Error('Noto Sans SC stylesheet failed to load.'))
    }
    const cleanup = () => {
      link.removeEventListener('load', handleLoad)
      link.removeEventListener('error', handleError)
    }

    link.addEventListener('load', handleLoad)
    link.addEventListener('error', handleError)
  })
}

async function waitForFullFontFaces() {
  if (!('fonts' in document)) return

  await Promise.all(
    [400, 500, 700].map((weight) =>
      document.fonts.load(`${weight} 1em "Noto Sans SC"`, NOTO_SANS_SC_FULL_SAMPLE_TEXT),
    ),
  )
  await document.fonts.ready
}

export function isNotoSansScFullFontReady() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(NOTO_SANS_SC_FULL_READY_KEY) === '1'
  } catch {
    return false
  }
}

export function isNotoSansScFullFontActive() {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute(NOTO_SANS_SC_FULL_DATA_ATTRIBUTE) === '1'
}

export function activateNotoSansScFullFont() {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(NOTO_SANS_SC_FULL_DATA_ATTRIBUTE, '1')
  ensureNotoSansScFullFontStylesheet()
}

export async function loadNotoSansScFullFont() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  if (isNotoSansScFullFontReady()) return true
  if (fullFontLoadPromise) return fullFontLoadPromise

  fullFontLoadPromise = (async () => {
    try {
      const link = ensureNotoSansScFullFontStylesheet()
      await waitForStylesheetLoad(link)
      await waitForFullFontFaces()
      markNotoSansScFullFontReady()
      return true
    } catch {
      return false
    } finally {
      fullFontLoadPromise = null
    }
  })()

  return fullFontLoadPromise
}

