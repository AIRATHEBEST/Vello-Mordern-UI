import { useState, useEffect } from 'react'
import { Settings, Check, X, Loader } from 'lucide-react'
import { apiProvider } from '../lib/api-provider'

export default function APISettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [provider, setProvider] = useState<'vello' | 'ollama'>('vello')
  const [velloApiKey, setVelloApiKey] = useState('')
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [modelCount, setModelCount] = useState(0)
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const savedProvider = localStorage.getItem('api_provider') as 'vello' | 'ollama'
    if (savedProvider) setProvider(savedProvider)

    const savedVelloKey = localStorage.getItem('vello_api_key')
    if (savedVelloKey) setVelloApiKey(savedVelloKey)

    const savedOllamaUrl = localStorage.getItem('ollama_base_url')
    if (savedOllamaUrl) setOllamaUrl(savedOllamaUrl)

    checkStatus()
  }, [])

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const status = await apiProvider.getStatus()
      setIsConnected(status.connected)
      setModelCount(status.models)
      setStatus(status.connected ? 'Connected' : 'Disconnected')
    } catch (error) {
      setIsConnected(false)
      setStatus('Error checking status')
    } finally {
      setIsChecking(false)
    }
  }

  const handleProviderChange = (newProvider: 'vello' | 'ollama') => {
    setProvider(newProvider)
    apiProvider.setProvider(newProvider)
    checkStatus()
  }

  const handleVelloKeyChange = (key: string) => {
    setVelloApiKey(key)
    apiProvider.setVelloApiKey(key)
  }

  const handleOllamaUrlChange = (url: string) => {
    setOllamaUrl(url)
    apiProvider.setOllamaUrl(url)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        title="API Settings"
      >
        <Settings size={20} />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">API Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status:</span>
              <div className="flex items-center gap-2">
                {isChecking ? (
                  <Loader size={16} className="animate-spin text-blue-500" />
                ) : isConnected ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                  {status}
                </span>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Models available: {modelCount}
            </div>
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded text-sm transition-colors"
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              API Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProviderChange('vello')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  provider === 'vello'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Vello.ai
              </button>
              <button
                onClick={() => handleProviderChange('ollama')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  provider === 'ollama'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Ollama Local
              </button>
            </div>
          </div>

          {/* Vello API Key */}
          {provider === 'vello' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Vello API Key
              </label>
              <input
                type="password"
                value={velloApiKey}
                onChange={(e) => handleVelloKeyChange(e.target.value)}
                placeholder="Enter your Vello API key"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-400">
                Get your API key from{' '}
                <a
                  href="https://vello.ai/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  vello.ai/api
                </a>
              </p>
            </div>
          )}

          {/* Ollama URL */}
          {provider === 'ollama' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ollama Server URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => handleOllamaUrlChange(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-slate-400">
                Make sure Ollama is running on your PC. Default: http://localhost:11434
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300">Quick Setup:</p>
            {provider === 'ollama' ? (
              <>
                <p>1. Install Ollama from ollama.ai</p>
                <p>2. Run: <code className="bg-slate-900 px-1 rounded">ollama serve</code></p>
                <p>3. Pull models: <code className="bg-slate-900 px-1 rounded">ollama pull llama2</code></p>
              </>
            ) : (
              <>
                <p>1. Sign up at vello.ai</p>
                <p>2. Get your API key</p>
                <p>3. Paste it above</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
