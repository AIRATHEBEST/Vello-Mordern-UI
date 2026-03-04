import { useState, useEffect } from 'react'
import { Settings, Check, X, Loader, ChevronDown } from 'lucide-react'
import { apiProvider } from '../lib/api-provider'
import OllamaSettings from './OllamaSettings'

export default function APISettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [provider, setProvider] = useState<'vello' | 'ollama' | 'manus'>('vello')
  const [velloApiKey, setVelloApiKey] = useState('')
  const [manusApiKey, setManusApiKey] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [modelCount, setModelCount] = useState(0)
  const [statusText, setStatusText] = useState<string>('')
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>('')

  useEffect(() => {
    const savedProvider = localStorage.getItem('api_provider') as 'vello' | 'ollama' | 'manus'
    if (savedProvider) setProvider(savedProvider)

    const savedVelloKey = localStorage.getItem('vello_api_key')
    if (savedVelloKey) setVelloApiKey(savedVelloKey)

    const savedManusKey = localStorage.getItem('manus_api_key')
    if (savedManusKey) setManusApiKey(savedManusKey)

    const savedOllamaModel = localStorage.getItem('ollama_selected_model')
    if (savedOllamaModel) setSelectedOllamaModel(savedOllamaModel)

    // Only auto-check non-ollama providers (Ollama is handled by OllamaSettings)
    if (savedProvider !== 'ollama') {
      checkStatus(savedProvider || 'vello')
    }
  }, [])

  const checkStatus = async (providerOverride?: string) => {
    const activeProvider = (providerOverride ?? provider) as 'vello' | 'ollama' | 'manus'
    if (activeProvider === 'ollama') return // handled by OllamaSettings

    setIsChecking(true)
    try {
      const status = await apiProvider.getStatus()
      setIsConnected(status.connected)
      setModelCount(status.models)
      setStatusText(status.connected ? 'Connected' : 'Disconnected')
    } catch {
      setIsConnected(false)
      setStatusText('Error checking status')
    } finally {
      setIsChecking(false)
    }
  }

  const handleProviderChange = (newProvider: 'vello' | 'ollama' | 'manus') => {
    setProvider(newProvider)
    apiProvider.setProvider(newProvider)
    if (newProvider !== 'ollama') checkStatus(newProvider)
  }

  const handleOllamaModelSelect = (modelName: string) => {
    setSelectedOllamaModel(modelName)
    localStorage.setItem('ollama_selected_model', modelName)
    localStorage.setItem('ollama_active_model', modelName)
  }

  const providerColor = {
    vello: 'from-blue-600 to-blue-700',
    ollama: 'from-purple-600 to-purple-700',
    manus: 'from-orange-600 to-orange-700',
  }[provider]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full bg-gradient-to-r ${providerColor} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all`}
        title="API Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[26rem] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">API Settings</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Provider Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                API Provider
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['vello', 'ollama', 'manus'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      provider === p
                        ? p === 'vello'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                          : p === 'ollama'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                          : 'bg-orange-600 text-white shadow-lg shadow-orange-900/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {p === 'vello' ? 'Vello.ai' : p === 'ollama' ? 'Ollama Local' : 'Manus AI'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Vello Settings ── */}
            {provider === 'vello' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Vello API Key
                  </label>
                  <input
                    type="password"
                    value={velloApiKey}
                    onChange={(e) => {
                      setVelloApiKey(e.target.value)
                      apiProvider.setVelloApiKey(e.target.value)
                    }}
                    placeholder="sk-vello-…"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  />
                  <p className="text-xs text-slate-500">
                    Get your key at{' '}
                    <a href="https://vello.ai" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                      vello.ai
                    </a>
                  </p>
                </div>

                {/* Status */}
                <StatusCard
                  isChecking={isChecking}
                  isConnected={isConnected}
                  statusText={statusText}
                  modelCount={modelCount}
                  onCheck={() => checkStatus()}
                  accentColor="blue"
                />
              </>
            )}

            {/* ── Ollama Settings ── */}
            {provider === 'ollama' && (
              <>
                <OllamaSettings
                  selectedModel={selectedOllamaModel}
                  onModelSelect={handleOllamaModelSelect}
                />
                {selectedOllamaModel && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-600/30 rounded-lg text-sm text-purple-300">
                    <Check size={14} className="text-purple-400 flex-shrink-0" />
                    <span>
                      Active model: <strong>{selectedOllamaModel}</strong>
                    </span>
                  </div>
                )}
              </>
            )}

            {/* ── Manus Settings ── */}
            {provider === 'manus' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Manus API Key
                  </label>
                  <input
                    type="password"
                    value={manusApiKey}
                    onChange={(e) => {
                      setManusApiKey(e.target.value)
                      apiProvider.setManusApiKey(e.target.value)
                    }}
                    placeholder="Enter Manus API key"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                  />
                  <p className="text-xs text-slate-500">
                    Get your key at{' '}
                    <a href="https://manus.im" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">
                      manus.im
                    </a>
                  </p>
                </div>

                {/* Status */}
                <StatusCard
                  isChecking={isChecking}
                  isConnected={isConnected}
                  statusText={statusText}
                  modelCount={modelCount}
                  onCheck={() => checkStatus()}
                  accentColor="orange"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Status Card sub-component ────────────────────────────────────────────────

function StatusCard({
  isChecking,
  isConnected,
  statusText,
  modelCount,
  onCheck,
  accentColor,
}: {
  isChecking: boolean
  isConnected: boolean
  statusText: string
  modelCount: number
  onCheck: () => void
  accentColor: 'blue' | 'orange'
}) {
  const accent = accentColor === 'blue' ? 'blue' : 'orange'

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Connection Status</span>
        <div className="flex items-center gap-1.5">
          {isChecking ? (
            <Loader size={13} className="animate-spin text-blue-400" />
          ) : isConnected ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <X size={13} className="text-red-400" />
          )}
          <span className={`text-xs font-medium ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
            {statusText || (isConnected ? 'Connected' : 'Disconnected')}
          </span>
        </div>
      </div>
      {modelCount > 0 && (
        <p className="text-xs text-slate-500">
          {modelCount} model{modelCount !== 1 ? 's' : ''} available
        </p>
      )}
      <button
        onClick={onCheck}
        disabled={isChecking}
        className={`w-full px-3 py-1.5 bg-${accent}-600 hover:bg-${accent}-700 disabled:bg-slate-600 text-white rounded text-xs font-medium transition-colors`}
      >
        {isChecking ? 'Checking…' : 'Check Status'}
      </button>
    </div>
  )
}
