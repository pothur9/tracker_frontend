export interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  authToken?: string | null
}

// Base API URL must be provided via env. Do not hard-code defaults.
const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_BASE

export async function api(path: string, options: ApiOptions = {}) {
  const base = DEFAULT_BASE
  if (!base) {
    throw new Error(
      'Environment variable NEXT_PUBLIC_API_BASE is not set. Please set it in your .env.local (e.g., NEXT_PUBLIC_API_BASE="https://api.example.com")'
    )
  }
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
  if (!DEFAULT_BASE) {
    throw new Error('NEXT_PUBLIC_API_BASE is not set')
  }
  return DEFAULT_BASE
}

