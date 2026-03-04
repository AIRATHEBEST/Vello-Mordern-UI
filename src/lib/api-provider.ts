/**
 * Unified API Provider
 * Supports both Vello.ai API and local Ollama instances
 */

import { velloAPI, VelloMessage, VelloResponse } from './vello-api'
import { ollamaAPI, OllamaMessage } from './ollama-api'

export type APIProvider = 'vello' | 'ollama'

export interface APIConfig {
  provider: APIProvider
  velloApiKey?: string
  ollamaBaseUrl?: string
}

export class UnifiedAPIProvider {
  private currentProvider: APIProvider = 'vello'
  private velloKey: string | null = null
  private ollamaUrl: string = 'http://localhost:11434'

  constructor(config?: APIConfig) {
    if (config) {
      this.currentProvider = config.provider
      if (config.velloApiKey) {
        this.velloKey = config.velloApiKey
        velloAPI.setApiKey(config.velloApiKey)
      }
      if (config.ollamaBaseUrl) {
        this.ollamaUrl = config.ollamaBaseUrl
        ollamaAPI.setBaseUrl(config.ollamaBaseUrl)
      }
    }

    // Load from localStorage
    const savedProvider = localStorage.getItem('api_provider') as APIProvider
    if (savedProvider) {
      this.currentProvider = savedProvider
    }

    const savedVelloKey = localStorage.getItem('vello_api_key')
    if (savedVelloKey) {
      this.velloKey = savedVelloKey
      velloAPI.setApiKey(savedVelloKey)
    }

    const savedOllamaUrl = localStorage.getItem('ollama_base_url')
    if (savedOllamaUrl) {
      this.ollamaUrl = savedOllamaUrl
      ollamaAPI.setBaseUrl(savedOllamaUrl)
    }
  }

  /**
   * Set the API provider
   */
  setProvider(provider: APIProvider) {
    this.currentProvider = provider
    localStorage.setItem('api_provider', provider)
  }

  /**
   * Get current provider
   */
  getProvider(): APIProvider {
    return this.currentProvider
  }

  /**
   * Set Vello API key
   */
  setVelloApiKey(key: string) {
    this.velloKey = key
    velloAPI.setApiKey(key)
    localStorage.setItem('vello_api_key', key)
  }

  /**
   * Set Ollama base URL
   */
  setOllamaUrl(url: string) {
    this.ollamaUrl = url
    ollamaAPI.setBaseUrl(url)
    localStorage.setItem('ollama_base_url', url)
  }

  /**
   * Get available models
   */
  async getModels() {
    if (this.currentProvider === 'ollama') {
      const ollamaModels = await ollamaAPI.getModels()
      return ollamaModels.map(m => ({
        id: m.name,
        name: m.name,
        provider: 'Ollama',
        description: `Local model - ${(m.size / 1024 / 1024 / 1024).toFixed(2)}GB`,
      }))
    } else {
      return velloAPI.getModels()
    }
  }

  /**
   * Send message to model
   */
  async sendMessage(
    modelId: string,
    messages: any[],
    options?: any
  ): Promise<any> {
    if (this.currentProvider === 'ollama') {
      const ollamaMessages: OllamaMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const content = await ollamaAPI.sendMessage(modelId, ollamaMessages, options)
      return {
        id: `ollama-${Date.now()}`,
        model: modelId,
        content,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        created_at: new Date().toISOString(),
      }
    } else {
      const velloMessages: VelloMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      return velloAPI.sendMessage(modelId, velloMessages, options)
    }
  }

  /**
   * Stream message response
   */
  async *streamMessage(
    modelId: string,
    messages: any[],
    options?: any
  ): AsyncGenerator<string, void, unknown> {
    if (this.currentProvider === 'ollama') {
      const ollamaMessages: OllamaMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      yield* ollamaAPI.streamMessage(modelId, ollamaMessages, options)
    } else {
      const velloMessages: VelloMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      yield* velloAPI.streamMessage(modelId, velloMessages, options)
    }
  }

  /**
   * Check connectivity to current provider
   */
  async checkConnectivity(): Promise<boolean> {
    if (this.currentProvider === 'ollama') {
      return ollamaAPI.checkConnectivity()
    } else {
      return velloAPI.checkConnectivity()
    }
  }

  /**
   * Get provider status
   */
  async getStatus(): Promise<{
    provider: APIProvider
    connected: boolean
    models: number
  }> {
    const connected = await this.checkConnectivity()
    const models = await this.getModels()

    return {
      provider: this.currentProvider,
      connected,
      models: models.length,
    }
  }
}

// Export singleton instance
export const apiProvider = new UnifiedAPIProvider()
