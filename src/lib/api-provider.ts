/**
 * Unified API Provider
 * Supports Vello.ai, local Ollama, and Manus AI
 */

import { velloAPI, VelloMessage, VelloResponse } from './vello-api'
import { ollamaAPI, OllamaMessage } from './ollama-api'
import { manusAPI, ManusMessage } from './manus-api'

export type APIProvider = 'vello' | 'ollama' | 'manus'

export interface APIConfig {
  provider: APIProvider
  velloApiKey?: string
  ollamaBaseUrl?: string
  manusApiKey?: string
}

export class UnifiedAPIProvider {
  private currentProvider: APIProvider = 'vello'
  private velloKey: string | null = null
  private ollamaUrl: string = 'http://localhost:11434'
  private manusKey: string | null = null

  constructor(config?: APIConfig) {
    // Load from localStorage
    const savedProvider = localStorage.getItem('api_provider') as APIProvider
    if (savedProvider) this.currentProvider = savedProvider

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

    const savedManusKey = localStorage.getItem('manus_api_key')
    if (savedManusKey) {
      this.manusKey = savedManusKey
      manusAPI.setApiKey(savedManusKey)
    }

    if (config) {
      this.currentProvider = config.provider
      if (config.velloApiKey) this.setVelloApiKey(config.velloApiKey)
      if (config.ollamaBaseUrl) this.setOllamaUrl(config.ollamaBaseUrl)
      if (config.manusApiKey) this.setManusApiKey(config.manusApiKey)
    }
  }

  setProvider(provider: APIProvider) {
    this.currentProvider = provider
    localStorage.setItem('api_provider', provider)
  }

  getProvider(): APIProvider {
    return this.currentProvider
  }

  setVelloApiKey(key: string) {
    this.velloKey = key
    velloAPI.setApiKey(key)
    localStorage.setItem('vello_api_key', key)
  }

  setOllamaUrl(url: string) {
    this.ollamaUrl = url
    ollamaAPI.setBaseUrl(url)
    localStorage.setItem('ollama_base_url', url)
  }

  setManusApiKey(key: string) {
    this.manusKey = key
    manusAPI.setApiKey(key)
    localStorage.setItem('manus_api_key', key)
  }

  async getModels() {
    switch (this.currentProvider) {
      case 'ollama':
        const ollamaModels = await ollamaAPI.getModels()
        return ollamaModels.map(m => ({
          id: m.name,
          name: m.name,
          provider: 'Ollama',
          description: `Local model - ${(m.size / 1024 / 1024 / 1024).toFixed(2)}GB`,
        }))
      case 'manus':
        return manusAPI.getModels()
      case 'vello':
      default:
        return velloAPI.getModels()
    }
  }

  async sendMessage(modelId: string, messages: any[], options?: any): Promise<any> {
    switch (this.currentProvider) {
      case 'ollama':
        const ollamaMessages: OllamaMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        const content = await ollamaAPI.sendMessage(modelId, ollamaMessages, options)
        return {
          id: `ollama-${Date.now()}`,
          model: modelId,
          content,
          usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          created_at: new Date().toISOString(),
        }
      case 'manus':
        const manusMessages: ManusMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        return manusAPI.sendMessage(modelId, manusMessages)
      case 'vello':
      default:
        const velloMessages: VelloMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        return velloAPI.sendMessage(modelId, velloMessages, options)
    }
  }

  async *streamMessage(modelId: string, messages: any[], options?: any): AsyncGenerator<string, void, unknown> {
    switch (this.currentProvider) {
      case 'ollama':
        const ollamaMessages: OllamaMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        yield* ollamaAPI.streamMessage(modelId, ollamaMessages, options)
        break
      case 'manus':
        const manusMessages: ManusMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        yield* manusAPI.streamMessage(modelId, manusMessages)
        break
      case 'vello':
      default:
        const velloMessages: VelloMessage[] = messages.map(m => ({
          role: m.role,
          content: m.content,
        }))
        yield* velloAPI.streamMessage(modelId, velloMessages, options)
        break
    }
  }

  async checkConnectivity(): Promise<boolean> {
    switch (this.currentProvider) {
      case 'ollama': return ollamaAPI.checkConnectivity()
      case 'manus': return manusAPI.checkConnectivity()
      case 'vello':
      default: return velloAPI.checkConnectivity()
    }
  }

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

export const apiProvider = new UnifiedAPIProvider()
