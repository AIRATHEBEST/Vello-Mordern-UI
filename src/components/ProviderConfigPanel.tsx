import { useState } from 'react'
import { X, Save, Eye, EyeOff, Plus } from 'lucide-react'
import { multiProviderAPI } from '../lib/multi-provider-api'

interface ProviderConfigPanelProps {
  onClose: () => void
}

export default function ProviderConfigPanel({ onClose }: ProviderConfigPanelProps) {
  const [providers, setProviders] = useState(multiProviderAPI.getProviders())
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  const handleSaveProvider = (providerId: string) => {
    multiProviderAPI.setProviderCredentials(providerId, apiKey, baseUrl)
    setProviders(multiProviderAPI.getProviders())
    setEditingProvider(null)
    setApiKey('')
    setBaseUrl('')
  }

  const handleEditProvider = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    if (provider) {
      setEditingProvider(providerId)
      setApiKey(provider.apiKey || '')
      setBaseUrl(provider.baseUrl || '')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-100">API Providers</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{provider.name}</h3>
                  <p className="text-xs text-slate-500">
                    {provider.type === 'local' ? 'Local' : 'Cloud'} • {provider.models.length} models
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      provider.enabled ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-xs text-slate-400">
                    {provider.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {editingProvider === provider.id ? (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  {provider.type === 'cloud' && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">API Key</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                      />
                    </div>
                  )}

                  {provider.type === 'local' && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Base URL</label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="http://localhost:11434"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveProvider(provider.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProvider(null)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500">
                    {provider.apiKey ? (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span>Configured</span>
                      </div>
                    ) : provider.type === 'local' ? (
                      <span>Using default URL</span>
                    ) : (
                      <span className="text-yellow-600">Not configured</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleEditProvider(provider.id)}
                    className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-xs font-medium"
                  >
                    Configure
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-900/50 px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
