/**
 * Multi-Provider API System
 * Supports Ollama, OpenAI, Anthropic, and other LLM providers
 * Intelligently routes requests based on capability and user configuration
 */

export interface APIProvider {
  id: string
  name: string
  type: 'local' | 'cloud'
  baseUrl?: string
  apiKey?: string
  models: string[]
  enabled: boolean
}

export interface AIResponse {
  provider: string
  model: string
  content: string
  tokens?: number
  executionTime: number
}

export interface FileAttachment {
  id: string
  name: string
  type: 'image' | 'document' | 'data' | 'code'
  mimeType: string
  size: number
  content?: string
  url?: string
  uploadedAt: Date
}

class MultiProviderAPI {
  private providers: Map<string, APIProvider> = new Map()
  private selectedProvider: string = 'ollama'
  private fileAttachments: FileAttachment[] = []

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Ollama - Local LLM
    this.providers.set('ollama', {
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'local',
      baseUrl: localStorage.getItem('ollama_url') || 'http://localhost:11434',
      models: ['llama2', 'mistral', 'neural-chat', 'dolphin-mixtral'],
      enabled: true,
    })

    // OpenAI
    this.providers.set('openai', {
      id: 'openai',
      name: 'OpenAI',
      type: 'cloud',
      apiKey: localStorage.getItem('openai_api_key'),
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      enabled: !!localStorage.getItem('openai_api_key'),
    })

    // Anthropic Claude
    this.providers.set('anthropic', {
      id: 'anthropic',
      name: 'Anthropic Claude',
      type: 'cloud',
      apiKey: localStorage.getItem('anthropic_api_key'),
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      enabled: !!localStorage.getItem('anthropic_api_key'),
    })

    // Google Gemini
    this.providers.set('gemini', {
      id: 'gemini',
      name: 'Google Gemini',
      type: 'cloud',
      apiKey: localStorage.getItem('gemini_api_key'),
      models: ['gemini-pro', 'gemini-pro-vision'],
      enabled: !!localStorage.getItem('gemini_api_key'),
    })

    // Hugging Face
    this.providers.set('huggingface', {
      id: 'huggingface',
      name: 'Hugging Face',
      type: 'cloud',
      apiKey: localStorage.getItem('huggingface_api_key'),
      models: ['mistral-7b', 'llama-2-70b', 'falcon-40b'],
      enabled: !!localStorage.getItem('huggingface_api_key'),
    })
  }

  /**
   * Set API provider credentials
   */
  setProviderCredentials(providerId: string, apiKey: string, baseUrl?: string) {
    const provider = this.providers.get(providerId)
    if (provider) {
      provider.apiKey = apiKey
      if (baseUrl) provider.baseUrl = baseUrl
      provider.enabled = true
      localStorage.setItem(`${providerId}_api_key`, apiKey)
      if (baseUrl) localStorage.setItem(`${providerId}_base_url`, baseUrl)
    }
  }

  /**
   * Select the active provider
   */
  selectProvider(providerId: string) {
    if (this.providers.has(providerId)) {
      this.selectedProvider = providerId
      localStorage.setItem('selected_provider', providerId)
    }
  }

  /**
   * Get all available providers
   */
  getProviders(): APIProvider[] {
    return Array.from(this.providers.values())
  }

  /**
   * Get enabled providers only
   */
  getEnabledProviders(): APIProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.enabled)
  }

  /**
   * Get the currently selected provider
   */
  getSelectedProvider(): APIProvider | undefined {
    return this.providers.get(this.selectedProvider)
  }

  /**
   * Intelligently select the best provider based on capability type
   */
  selectBestProvider(capabilityType: string): string {
    const enabledProviders = this.getEnabledProviders()

    if (enabledProviders.length === 0) {
      return 'ollama' // Fallback to Ollama
    }

    // Capability-specific provider selection
    switch (capabilityType) {
      case 'multimodal':
      case 'vision':
        // Prefer providers with vision capabilities
        return (
          enabledProviders.find((p) =>
            ['openai', 'anthropic', 'gemini'].includes(p.id)
          )?.id || this.selectedProvider
        )

      case 'code_execution':
      case 'reasoning':
        // Prefer advanced reasoning models
        return (
          enabledProviders.find((p) =>
            ['openai', 'anthropic'].includes(p.id)
          )?.id || this.selectedProvider
        )

      case 'text_generation':
      case 'content':
        // Any provider works, use selected or first available
        return this.selectedProvider

      default:
        return this.selectedProvider
    }
  }

  /**
   * Add file attachment
   */
  addFileAttachment(file: File): Promise<FileAttachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const attachment: FileAttachment = {
          id: `file_${Date.now()}`,
          name: file.name,
          type: this.detectFileType(file.type),
          mimeType: file.type,
          size: file.size,
          content: reader.result as string,
          uploadedAt: new Date(),
        }

        this.fileAttachments.push(attachment)
        resolve(attachment)
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * Detect file type from MIME type
   */
  private detectFileType(mimeType: string): FileAttachment['type'] {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
    if (mimeType.includes('json') || mimeType.includes('csv')) return 'data'
    if (mimeType.includes('code') || mimeType.includes('javascript')) return 'code'
    return 'document'
  }

  /**
   * Get all attachments
   */
  getAttachments(): FileAttachment[] {
    return this.fileAttachments
  }

  /**
   * Remove attachment
   */
  removeAttachment(attachmentId: string) {
    this.fileAttachments = this.fileAttachments.filter((a) => a.id !== attachmentId)
  }

  /**
   * Clear all attachments
   */
  clearAttachments() {
    this.fileAttachments = []
  }

  /**
   * Send request to selected provider
   */
  async sendRequest(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const startTime = Date.now()
    const provider = this.providers.get(this.selectedProvider)

    if (!provider || !provider.enabled) {
      throw new Error(`Provider ${this.selectedProvider} is not available`)
    }

    try {
      let response: AIResponse

      switch (provider.id) {
        case 'openai':
          response = await this.callOpenAI(prompt, model, systemPrompt)
          break

        case 'anthropic':
          response = await this.callAnthropic(prompt, model, systemPrompt)
          break

        case 'gemini':
          response = await this.callGemini(prompt, model, systemPrompt)
          break

        case 'huggingface':
          response = await this.callHuggingFace(prompt, model, systemPrompt)
          break

        case 'ollama':
        default:
          response = await this.callOllama(prompt, model, systemPrompt)
      }

      response.executionTime = Date.now() - startTime
      return response
    } catch (error: any) {
      throw new Error(`API Error (${provider.name}): ${error.message}`)
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const provider = this.providers.get('openai')!
    const selectedModel = model || provider.models[0]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      provider: 'openai',
      model: selectedModel,
      content: data.choices[0].message.content,
      tokens: data.usage.total_tokens,
      executionTime: 0,
    }
  }

  /**
   * Call Anthropic Claude API
   */
  private async callAnthropic(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const provider = this.providers.get('anthropic')!
    const selectedModel = model || provider.models[0]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      provider: 'anthropic',
      model: selectedModel,
      content: data.content[0].text,
      executionTime: 0,
    }
  }

  /**
   * Call Google Gemini API
   */
  private async callGemini(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const provider = this.providers.get('gemini')!
    const selectedModel = model || provider.models[0]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${provider.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                ...(systemPrompt ? [{ text: systemPrompt }] : []),
                { text: prompt },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      provider: 'gemini',
      model: selectedModel,
      content: data.candidates[0].content.parts[0].text,
      executionTime: 0,
    }
  }

  /**
   * Call Hugging Face API
   */
  private async callHuggingFace(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const provider = this.providers.get('huggingface')!
    const selectedModel = model || provider.models[0]

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${selectedModel}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          inputs: `${systemPrompt ? systemPrompt + '\n' : ''}${prompt}`,
          parameters: {
            max_length: 2000,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      provider: 'huggingface',
      model: selectedModel,
      content: Array.isArray(data) ? data[0].generated_text : data.generated_text,
      executionTime: 0,
    }
  }

  /**
   * Call Ollama API (local)
   */
  private async callOllama(
    prompt: string,
    model?: string,
    systemPrompt?: string
  ): Promise<AIResponse> {
    const provider = this.providers.get('ollama')!
    const selectedModel = model || provider.models[0]

    const response = await fetch(`${provider.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: `${systemPrompt ? systemPrompt + '\n' : ''}${prompt}`,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      provider: 'ollama',
      model: selectedModel,
      content: data.response,
      executionTime: 0,
    }
  }
}

export const multiProviderAPI = new MultiProviderAPI()
