/**
 * Ollama Local LLM Integration
 * Connects to local Ollama instance running on user's PC
 */

export interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
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
  total_duration: number
  load_duration: number
  prompt_eval_count: number
  prompt_eval_duration: number
  eval_count: number
  eval_duration: number
}

export class OllamaAPI {
  private baseUrl: string
  private isConnected: boolean = false

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl
  }

  /**
   * Set custom Ollama server URL
   */
  setBaseUrl(url: string) {
    this.baseUrl = url
    localStorage.setItem('ollama_base_url', url)
  }

  /**
   * Get stored Ollama URL from localStorage
   */
  getBaseUrl(): string {
    return localStorage.getItem('ollama_base_url') || this.baseUrl
  }

  /**
   * Check if Ollama server is running
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      this.isConnected = response.ok
      return response.ok
    } catch (error) {
      console.error('Ollama connectivity check failed:', error)
      this.isConnected = false
      return false
    }
  }

  /**
   * Get list of available models from local Ollama
   */
  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error('Error fetching Ollama models:', error)
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
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(`API error: ${response.statusText}`)
      }

      const data: OllamaResponse = await response.json()
      return data.message.content
    } catch (error) {
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
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(`API error: ${response.statusText}`)
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
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming message from Ollama:', error)
      throw error
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error pulling model:', error)
      throw error
    }
  }

  /**
   * Delete a model from Ollama
   */
  async deleteModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting model:', error)
      throw error
    }
  }

  /**
   * Get Ollama server info
   */
  async getServerInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get server info: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error getting server info:', error)
      return null
    }
  }

  /**
   * Check if Ollama is connected
   */
  isOllamaConnected(): boolean {
    return this.isConnected
  }
}

// Export singleton instance
export const ollamaAPI = new OllamaAPI()
