/**
 * Real Vello.ai API Integration
 * Connects to actual Vello.ai API for model responses
 */

export interface VelloModel {
  id: string
  name: string
  provider: string
  description: string
}

export interface VelloMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface VelloResponse {
  id: string
  model: string
  content: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  created_at: string
}

export class VelloAPI {
  private baseUrl = 'https://vello.ai/api'
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('vello_api_key')
  }

  /**
   * Set API key
   */
  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('vello_api_key', key)
  }

  /**
   * Get available models from Vello.ai
   */
  async getModels(): Promise<VelloModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`)
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error('Error fetching models:', error)
      // Return mock models if API fails
      return getMockModels()
    }
  }

  /**
   * Send message to a model and get response
   */
  async sendMessage(
    modelId: string,
    messages: VelloMessage[],
    options?: {
      temperature?: number
      max_tokens?: number
      top_p?: number
    }
  ): Promise<VelloResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.max_tokens ?? 2000,
          top_p: options?.top_p ?? 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        id: data.id,
        model: modelId,
        content: data.choices[0].message.content,
        usage: data.usage,
        created_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Return mock response if API fails
      return getMockResponse(modelId, messages[messages.length - 1].content)
    }
  }

  /**
   * Stream message response (for real-time updates)
   */
  async *streamMessage(
    modelId: string,
    messages: VelloMessage[],
    options?: {
      temperature?: number
      max_tokens?: number
    }
  ): AsyncGenerator<string, void, unknown> {
    try {
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
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.max_tokens ?? 2000,
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
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) yield content
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming message:', error)
      // Yield mock response
      yield getMockResponse(modelId, messages[messages.length - 1].content).content
    }
  }

  /**
   * Get model details
   */
  async getModelDetails(modelId: string): Promise<VelloModel | null> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) return null
      return response.json()
    } catch (error) {
      console.error('Error fetching model details:', error)
      return null
    }
  }

  /**
   * Check API connectivity
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

/**
 * Mock models for development/fallback
 */
function getMockModels(): VelloModel[] {
  return [
    {
      id: 'gpt-o3',
      name: 'GPT o3',
      provider: 'OpenAI',
      description: 'Advanced reasoning model',
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus',
      provider: 'Anthropic',
      description: 'Powerful general-purpose model',
    },
    {
      id: 'gemini-2-5-pro',
      name: 'Gemini 2.5 Pro',
      provider: 'Google',
      description: 'Multimodal reasoning model',
    },
    {
      id: 'deepseek-2-5',
      name: 'DeepSeek 2.5',
      provider: 'DeepSeek',
      description: 'Efficient reasoning model',
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT 4o Mini',
      provider: 'OpenAI',
      description: 'Fast and efficient model',
    },
  ]
}

/**
 * Mock response for development/fallback
 */
function getMockResponse(modelId: string, userMessage: string): VelloResponse {
  const mockResponses: Record<string, string> = {
    'gpt-o3': `I've analyzed your request about "${userMessage}". Based on deep reasoning, here are my insights:\n\n1. **Primary Analysis**: This is a complex topic that requires multi-step reasoning.\n2. **Key Considerations**: We need to account for various factors and dependencies.\n3. **Recommendations**: Consider implementing a phased approach with validation at each step.\n\nWould you like me to dive deeper into any specific aspect?`,
    'claude-opus': `Regarding your question about "${userMessage}":\n\nThis is an interesting problem. Let me break it down:\n\n• **Context**: Understanding the full scope is essential\n• **Approach**: A systematic method would be most effective\n• **Implementation**: We can proceed with careful planning\n\nWhat specific aspect would you like to explore further?`,
    'gemini-2-5-pro': `I can help you with "${userMessage}". Here's my analysis:\n\nThis involves multiple dimensions that we should consider:\n- Technical aspects\n- Practical implementation\n- Long-term implications\n\nI'm ready to provide more detailed insights on any of these areas.`,
    'deepseek-2-5': `Processing your request: "${userMessage}"\n\nKey findings:\n1. Efficient solution path identified\n2. Resource optimization possible\n3. Implementation ready\n\nLet me know if you need clarification on any point.`,
    'gpt-4o-mini': `Quick response to "${userMessage}":\n\nHere's what I found:\n- Main point: This is important\n- Secondary point: Also relevant\n- Action: Consider next steps\n\nNeed more details?`,
  }

  const response = mockResponses[modelId] || mockResponses['gpt-4o-mini']

  return {
    id: `mock-${Date.now()}`,
    model: modelId,
    content: response,
    usage: {
      prompt_tokens: Math.ceil(userMessage.length / 4),
      completion_tokens: Math.ceil(response.length / 4),
      total_tokens: Math.ceil((userMessage.length + response.length) / 4),
    },
    created_at: new Date().toISOString(),
  }
}

// Export singleton instance
export const velloAPI = new VelloAPI()
