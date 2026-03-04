/**
 * Manus AI API Integration
 * Connects to Manus AI's OpenAI-compatible API
 */

export interface ManusModel {
  id: string
  name: string
  provider: string
  description: string
}

export interface ManusMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class ManusAPI {
  private baseUrl = 'https://api.manus.im/v1'
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('manus_api_key')
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('manus_api_key', key)
  }

  async getModels(): Promise<ManusModel[]> {
    if (!this.apiKey) return []
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error(`Manus API error: ${response.statusText}`)
      const data = await response.json()
      return data.data.map((m: any) => ({
        id: m.id,
        name: m.id,
        provider: 'Manus AI',
        description: 'Autonomous AI Agent Model',
      }))
    } catch (error) {
      console.error('Error fetching Manus models:', error)
      return [
        { id: 'manus-1', name: 'Manus 1', provider: 'Manus AI', description: 'Standard Manus model' },
        { id: 'manus-pro', name: 'Manus Pro', provider: 'Manus AI', description: 'Advanced Manus model' }
      ]
    }
  }

  async sendMessage(modelId: string, messages: ManusMessage[]): Promise<any> {
    if (!this.apiKey) throw new Error('Manus API key not set')
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: false,
      }),
    })

    if (!response.ok) throw new Error(`Manus API error: ${response.statusText}`)
    const data = await response.json()
    return {
      id: data.id,
      content: data.choices[0].message.content,
      model: modelId,
      created_at: new Date().toISOString(),
    }
  }

  async *streamMessage(modelId: string, messages: ManusMessage[]): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) throw new Error('Manus API key not set')

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        stream: true,
      }),
    })

    if (!response.ok) throw new Error(`Manus API error: ${response.statusText}`)
    
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ''
            if (content) yield content
          } catch (e) {}
        }
      }
    }
  }

  async checkConnectivity(): Promise<boolean> {
    if (!this.apiKey) return false
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const manusAPI = new ManusAPI()
