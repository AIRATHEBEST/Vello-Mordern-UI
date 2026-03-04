import React, { useState, useEffect } from 'react'
import { MessageCircle, Settings, Plus, Send, Loader } from 'lucide-react'
import { apiProvider } from '../lib/api-provider'

export default function Popup() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('')
  const [models, setModels] = useState<any[]>([])
  const [provider, setProvider] = useState<'vello' | 'ollama'>('vello')
  const [showSettings, setShowSettings] = useState(false)
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')

  useEffect(() => {
    loadSettings()
    loadModels()
  }, [provider])

  const loadSettings = async () => {
    const savedProvider = localStorage.getItem('api_provider') as 'vello' | 'ollama'
    if (savedProvider) setProvider(savedProvider)

    const savedOllamaUrl = localStorage.getItem('ollama_base_url')
    if (savedOllamaUrl) setOllamaUrl(savedOllamaUrl)
  }

  const loadModels = async () => {
    try {
      const availableModels = await apiProvider.getModels()
      setModels(availableModels)
      if (availableModels.length > 0 && !selectedModel) {
        setSelectedModel(availableModels[0].id)
      }
    } catch (error) {
      console.error('Error loading models:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await apiProvider.sendMessage(
        selectedModel,
        [...messages, userMessage],
        { temperature: 0.7 }
      )

      const assistantMessage = {
        role: 'assistant',
        content: response.content,
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderChange = (newProvider: 'vello' | 'ollama') => {
    setProvider(newProvider)
    apiProvider.setProvider(newProvider)
    localStorage.setItem('api_provider', newProvider)
    setMessages([])
    loadModels()
  }

  const handleOllamaUrlChange = (url: string) => {
    setOllamaUrl(url)
    apiProvider.setOllamaUrl(url)
    localStorage.setItem('ollama_base_url', url)
  }

  return (
    <div className="w-96 h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h1 className="font-bold">Vello AI</h1>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800 border-b border-slate-700 p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProviderChange('vello')}
                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                  provider === 'vello'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Vello
              </button>
              <button
                onClick={() => handleProviderChange('ollama')}
                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                  provider === 'ollama'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Ollama
              </button>
            </div>
          </div>

          {provider === 'ollama' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Ollama URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => handleOllamaUrlChange(e.target.value)}
                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                placeholder="http://localhost:11434"
              />
            </div>
          )}
        </div>
      )}

      {/* Model Selector */}
      <div className="bg-slate-800 border-b border-slate-700 p-3">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a model...</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-2">
              <MessageCircle size={32} className="mx-auto text-slate-600" />
              <p className="text-sm text-slate-400">Start a conversation</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-3 py-2 rounded-lg">
              <Loader size={16} className="animate-spin text-blue-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-slate-800 border-t border-slate-700 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            disabled={isLoading || !selectedModel}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !selectedModel || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
