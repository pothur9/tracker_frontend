export interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  authToken?: string | null
}

const DEFAULT_BASE = typeof window === 'undefined' ? 'http://localhost:4000' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000')

export async function api(path: string, options: ApiOptions = {}) {
  const base = DEFAULT_BASE
  const url = `${base}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = options.authToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })
  if (!res.ok) {
    let text = await res.text()
    try {
      const json = JSON.parse(text)
      throw new Error(json.error || JSON.stringify(json))
    } catch {
      throw new Error(text || `Request failed: ${res.status}`)
    }
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export function getApiBase() {
  return DEFAULT_BASE
}
