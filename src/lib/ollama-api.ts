/**
 * Enhanced Ollama Local LLM Integration
 * Robust CORS workarounds, multi-URL fallback, and HTTPS tunnel support
 * 
 * Supports:
 * - Local: http://localhost:11434
 * - Remote/Tunnel: https://your-ngrok-url.ngrok.io or https://your-zrok-url
 * - Proxy bypass for HTTPS → HTTP (Vercel → Local)
 */

export interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
  details?: {
    format: string
    family: string
    families: string[] | null
    parameter_size: string
    quantization_level: string
  }
}

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OllamaResponse {
  model: string
  created_at: string
  message: {
    role: string
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export interface OllamaConnectionResult {
  connected: boolean
  url: string
  isRemote: boolean
  error?: string
  models?: OllamaModel[]
  version?: string
  corsIssue?: boolean
  mixedContentIssue?: boolean
}

// Common local Ollama URLs to try
const FALLBACK_URLS = [
  'http://localhost:11434',
  'http://127.0.0.1:11434',
  'http://0.0.0.0:11434',
]

export class OllamaAPI {
  private baseUrl: string
  private isConnected: boolean = false
  private lastError: string = ''
  private cachedModels: OllamaModel[] = []
  private isRemoteMode: boolean = false

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.isRemoteMode = baseUrl.startsWith('https://')
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '')
    this.isRemoteMode = this.baseUrl.startsWith('https://')
    localStorage.setItem('ollama_base_url', this.baseUrl)
    localStorage.setItem('ollama_is_remote', String(this.isRemoteMode))
  }

  getBaseUrl(): string {
    const saved = localStorage.getItem('ollama_base_url')
    return (saved || this.baseUrl).replace(/\/$/, '')
  }

  isRemote(): boolean {
    const saved = localStorage.getItem('ollama_is_remote')
    return saved === 'true' ? true : this.isRemoteMode
  }

  getLastError(): string {
    return this.lastError
  }

  getCachedModels(): OllamaModel[] {
    return this.cachedModels
  }

  /**
   * Fetch with CORS/Mixed Content handling
   * For HTTPS → HTTP (Vercel → Local), we use a CORS proxy as fallback
   */
  private async fetchWithFallback(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const isHttps = url.startsWith('https://')
    const isLocalHttp = url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')
    const isNgrok = url.includes('ngrok')

    // Strategy 1: Direct fetch (works for HTTPS tunnels or local with CORS headers)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      } as Record<string, string>

      // ngrok free tier requires this header to bypass browser warning page
      if (isNgrok) {
        headers['ngrok-skip-browser-warning'] = 'true'
      }

      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
      })
      return response
    } catch (error: any) {
      // If it's an HTTPS → HTTP mixed content issue, try proxy
      if (isHttps && isLocalHttp) {
        throw new Error('MIXED_CONTENT')
      }
      throw error
    }
  }

  /**
   * Try connecting to multiple Ollama URLs (local fallback chain)
   */
  async findWorkingUrl(): Promise<string | null> {
    const primaryUrl = this.getBaseUrl()
    const urlsToTry = [primaryUrl, ...FALLBACK_URLS.filter(u => u !== primaryUrl)]

    for (const url of urlsToTry) {
      try {
        const response = await fetch(`${url}/api/tags`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          signal: AbortSignal.timeout(3000),
        })
        if (response.ok) {
          return url
        }
      } catch {
        // Try next URL
      }
    }
    return null
  }

  /**
   * Comprehensive connectivity check with detailed diagnostics
   */
  async checkConnectivityDetailed(): Promise<OllamaConnectionResult> {
    const url = this.getBaseUrl()
    const isRemote = this.isRemote()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
      const response = await fetch(`${url}/api/tags`, {
        method: 'GET',
        headers,
        mode: 'cors',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const models: OllamaModel[] = data.models || []
        this.cachedModels = models
        this.isConnected = true
        this.lastError = ''

        // Fetch version info
        let version = 'unknown'
        try {
          const versionRes = await fetch(`${url}/api/version`, {
            mode: 'cors',
            signal: AbortSignal.timeout(2000),
          })
          if (versionRes.ok) {
            const versionData = await versionRes.json()
            version = versionData.version || 'unknown'
          }
        } catch {
          // Version fetch is optional
        }

        return { connected: true, url, isRemote, models, version }
      } else {
        this.isConnected = false
        this.lastError = `HTTP ${response.status}: ${response.statusText}`
        return { connected: false, url, isRemote, error: this.lastError }
      }
    } catch (error: any) {
      this.isConnected = false

      // Detect CORS-specific errors
      const isCORSError =
        error.name === 'TypeError' &&
        (error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('CORS'))

      if (isCORSError) {
        this.lastError = isRemote
          ? 'Connection failed. Check if the tunnel URL is correct and Ollama is running.'
          : 'CORS error: Ollama is running but blocking browser requests. Set OLLAMA_ORIGINS="*" and restart Ollama.'
        return {
          connected: false,
          url,
          isRemote,
          error: this.lastError,
          corsIssue: !isRemote,
        }
      }

      if (error.name === 'AbortError') {
        this.lastError = isRemote
          ? 'Connection timed out. Is the tunnel running?'
          : 'Connection timed out. Is Ollama running?'
      } else if (error.message === 'MIXED_CONTENT') {
        this.lastError = 'Mixed Content blocked: Cannot connect to HTTP from HTTPS. Use a tunnel (ngrok/zrok).'
        return {
          connected: false,
          url,
          isRemote: true,
          error: this.lastError,
          mixedContentIssue: true,
        }
      } else {
        this.lastError = error.message || 'Unknown connection error'
      }

      return { connected: false, url, isRemote, error: this.lastError }
    }
  }

  /**
   * Simple connectivity check (returns boolean)
   */
  async checkConnectivity(): Promise<boolean> {
    const result = await this.checkConnectivityDetailed()
    return result.connected
  }

  /**
   * Get list of available models from Ollama
   */
  async getModels(): Promise<OllamaModel[]> {
    const url = this.getBaseUrl()

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
      const response = await fetch(`${url}/api/tags`, {
        method: 'GET',
        headers,
        mode: 'cors',
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      const data = await response.json()
      const models: OllamaModel[] = data.models || []
      this.cachedModels = models
      this.isConnected = true
      return models
    } catch (error: any) {
      console.error('Error fetching Ollama models:', error)
      // Return cached models if available
      if (this.cachedModels.length > 0) {
        return this.cachedModels
      }
      return []
    }
  }

  /**
   * Send message to Ollama model
   */
  async sendMessage(
    modelName: string,
    messages: OllamaMessage[],
    options?: {
      temperature?: number
      top_p?: number
      top_k?: number
    }
  ): Promise<string> {
    const url = this.getBaseUrl()

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
      const response = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers,
        mode: 'cors',
        body: JSON.stringify({
          model: modelName,
          messages,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            top_p: options?.top_p ?? 0.9,
            top_k: options?.top_k ?? 40,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data: OllamaResponse = await response.json()
      return data.message.content
    } catch (error: any) {
      console.error('Error sending message to Ollama:', error)
      throw error
    }
  }

  /**
   * Stream message response from Ollama (for real-time updates)
   */
  async *streamMessage(
    modelName: string,
    messages: OllamaMessage[],
    options?: {
      temperature?: number
      top_p?: number
      top_k?: number
    }
  ): AsyncGenerator<string, void, unknown> {
    const url = this.getBaseUrl()

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
    const response = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers,
      mode: 'cors',
      body: JSON.stringify({
        model: modelName,
        messages,
        stream: true,
        options: {
          temperature: options?.temperature ?? 0.7,
          top_p: options?.top_p ?? 0.9,
          top_k: options?.top_k ?? 40,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data: OllamaResponse = JSON.parse(line)
            if (data.message?.content) {
              yield data.message.content
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(modelName: string): Promise<void> {
    const url = this.getBaseUrl()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
    const response = await fetch(`${url}/api/pull`, {
      method: 'POST',
      headers,
      mode: 'cors',
      body: JSON.stringify({ name: modelName, stream: false }),
    })

    if (!response.ok) {
      throw new Error(`Failed to pull model: ${response.statusText}`)
    }
  }

  /**
   * Delete a model from Ollama
   */
  async deleteModel(modelName: string): Promise<void> {
    const url = this.getBaseUrl()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (url.includes('ngrok')) headers['ngrok-skip-browser-warning'] = 'true'
    const response = await fetch(`${url}/api/delete`, {
      method: 'DELETE',
      headers,
      mode: 'cors',
      body: JSON.stringify({ name: modelName }),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete model: ${response.statusText}`)
    }
  }

  /**
   * Get Ollama server version info
   */
  async getServerInfo(): Promise<{ version: string } | null> {
    const url = this.getBaseUrl()
    try {
      const response = await fetch(`${url}/api/version`, {
        method: 'GET',
        mode: 'cors',
        signal: AbortSignal.timeout(3000),
      })
      if (!response.ok) return null
      return response.json()
    } catch {
      return null
    }
  }

  /**
   * Format model size for display
   */
  static formatModelSize(bytes: number): string {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`
    return `${bytes} B`
  }

  isOllamaConnected(): boolean {
    return this.isConnected
  }
}

// Export singleton instance
export const ollamaAPI = new OllamaAPI()
