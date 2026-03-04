import { useState, useEffect } from 'react'
import { useOverlayStore } from '../store/overlayStore'
import { MODEL_DATABASE, ModelCapability, ModelCategory } from '../lib/models-database'
import { ollamaAPI, OllamaModel } from '../lib/ollama-api'
import { Zap, Code, Globe, Sparkles, Eye, Feather, Cpu, RefreshCw, HardDrive } from 'lucide-react'

const CATEGORY_INFO: Record<ModelCategory, { icon: React.ReactNode; label: string; color: string }> = {
  'deep-reasoning': { icon: <Sparkles size={18} />, label: 'Deep Reasoning', color: 'from-purple-500 to-blue-500' },
  'coding-technical': { icon: <Code size={18} />, label: 'Coding & Technical', color: 'from-blue-500 to-cyan-500' },
  'web-research': { icon: <Globe size={18} />, label: 'Web Research', color: 'from-cyan-500 to-teal-500' },
  'creative-character': { icon: <Feather size={18} />, label: 'Creative', color: 'from-pink-500 to-rose-500' },
  'vision-analysis': { icon: <Eye size={18} />, label: 'Vision Analysis', color: 'from-orange-500 to-red-500' },
  'fast-lightweight': { icon: <Zap size={18} />, label: 'Fast & Light', color: 'from-yellow-500 to-orange-500' },
  'balanced-general': { icon: <Sparkles size={18} />, label: 'Balanced', color: 'from-green-500 to-emerald-500' },
}

function formatModelSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`
  return `${bytes} B`
}

export default function ModelSelector() {
  const [expandedCategory, setExpandedCategory] = useState<ModelCategory>('deep-reasoning')
  const { selectedModel, setSelectedModel, selectedCategory, setSelectedCategory } = useOverlayStore()

  // Ollama state
  const [activeProvider, setActiveProvider] = useState<string>('vello')
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([])
  const [ollamaLoading, setOllamaLoading] = useState(false)
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>('')

  useEffect(() => {
    const savedProvider = localStorage.getItem('api_provider') || 'vello'
    setActiveProvider(savedProvider)

    const savedOllamaModel = localStorage.getItem('ollama_active_model') || ''
    setSelectedOllamaModel(savedOllamaModel)

    if (savedProvider === 'ollama') {
      loadOllamaModels()
    }

    // Listen for provider changes (storage events from APISettings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'api_provider') {
        const newProvider = e.newValue || 'vello'
        setActiveProvider(newProvider)
        if (newProvider === 'ollama') loadOllamaModels()
      }
      if (e.key === 'ollama_active_model') {
        setSelectedOllamaModel(e.newValue || '')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const loadOllamaModels = async () => {
    setOllamaLoading(true)
    try {
      const models = await ollamaAPI.getModels()
      setOllamaModels(models)
    } catch {
      setOllamaModels([])
    } finally {
      setOllamaLoading(false)
    }
  }

  const handleOllamaModelSelect = (model: OllamaModel) => {
    setSelectedOllamaModel(model.name)
    localStorage.setItem('ollama_active_model', model.name)
    localStorage.setItem('ollama_selected_model', model.name)

    // Create a synthetic ModelCapability for the selected Ollama model
    const syntheticModel: ModelCapability = {
      id: `ollama-${model.name}`,
      name: model.name,
      provider: 'Ollama (Local)',
      category: 'balanced-general',
      tier: 'free',
      strengths: ['Local execution', 'Privacy', 'No API costs'],
      weaknesses: ['Requires local GPU/CPU', 'Speed depends on hardware'],
      idealFor: ['Private conversations', 'Offline use', 'Custom fine-tunes'],
      speed: 6,
      reasoning: 7,
      creativity: 7,
      accuracy: 7,
      contextWindow: 8192,
      costPerMillion: 0,
      hasVision: false,
      hasWebBrowsing: false,
      hasCodeExecution: false,
      hasImageGeneration: false,
      enabledTools: [],
      bestModes: ['engineer', 'researcher'],
      description: `Local Ollama model: ${model.name}`,
    }
    setSelectedModel(syntheticModel)
  }

  const categories = Object.keys(CATEGORY_INFO) as ModelCategory[]
  const modelsInCategory = Object.values(MODEL_DATABASE).filter(
    (m) => m.category === expandedCategory
  )

  // ── Ollama Provider View ──────────────────────────────────────────────────
  if (activeProvider === 'ollama') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu size={14} className="text-purple-400" />
            Ollama Models
          </h2>
          <button
            onClick={loadOllamaModels}
            disabled={ollamaLoading}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={11} className={ollamaLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {ollamaLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-4 justify-center">
            <RefreshCw size={14} className="animate-spin text-purple-400" />
            Loading models…
          </div>
        )}

        {!ollamaLoading && ollamaModels.length === 0 && (
          <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4 text-center space-y-2">
            <Cpu size={24} className="text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400">No Ollama models found</p>
            <p className="text-xs text-slate-500">
              Open the ⚙️ settings panel to connect to Ollama and load your models.
            </p>
          </div>
        )}

        {!ollamaLoading && ollamaModels.length > 0 && (
          <div className="space-y-1">
            {ollamaModels.map((model) => {
              const isSelected = selectedOllamaModel === model.name
              return (
                <button
                  key={model.name}
                  onClick={() => handleOllamaModelSelect(model)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                      : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-600/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Cpu size={14} className={isSelected ? 'text-purple-400' : 'text-slate-500'} />
                      <span className="font-medium text-sm truncate">{model.name}</span>
                    </div>
                    {model.size > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                        <HardDrive size={11} />
                        <span>{formatModelSize(model.size)}</span>
                      </div>
                    )}
                  </div>
                  {model.details && (
                    <div className="mt-1 flex gap-1.5 flex-wrap">
                      {model.details.parameter_size && (
                        <span className="text-xs bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                          {model.details.parameter_size}
                        </span>
                      )}
                      {model.details.quantization_level && (
                        <span className="text-xs bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                          {model.details.quantization_level}
                        </span>
                      )}
                      {model.details.family && (
                        <span className="text-xs bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded capitalize">
                          {model.details.family}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {selectedOllamaModel && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Active:{' '}
              <span className="text-purple-300 font-medium">{selectedOllamaModel}</span>
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Configure Ollama connection via the ⚙️ button (bottom-right).
          </p>
        </div>
      </div>
    )
  }

  // ── Default (Vello / Manus) Provider View ────────────────────────────────
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Model Categories</h2>

        <div className="space-y-1">
          {categories.map((category) => {
            const info = CATEGORY_INFO[category]
            const count = Object.values(MODEL_DATABASE).filter((m) => m.category === category).length

            return (
              <button
                key={category}
                onClick={() => {
                  setExpandedCategory(category)
                  setSelectedCategory(category)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                  expandedCategory === category
                    ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex-shrink-0">{info.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{info.label}</div>
                  <div className="text-xs opacity-75">{count} models</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Models in selected category */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          {CATEGORY_INFO[expandedCategory].label}
        </h3>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {modelsInCategory.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedModel?.id === model.id
                  ? 'bg-blue-500/30 border border-blue-500 text-blue-300'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{model.name}</div>
                  <div className="text-xs text-slate-500 truncate">{model.provider}</div>
                </div>
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                    model.tier === 'free'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : model.tier === 'pro'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {model.tier}
                </div>
              </div>

              {/* Model metrics */}
              <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                {(['speed', 'reasoning', 'creativity', 'accuracy'] as const).map((metric) => (
                  <div key={metric} className="space-y-0.5">
                    <div className="text-slate-500 capitalize">{metric === 'reasoning' ? 'Reason' : metric === 'creativity' ? 'Creative' : metric.charAt(0).toUpperCase() + metric.slice(1)}</div>
                    <div className="flex gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < model[metric]
                              ? metric === 'speed'
                                ? 'bg-blue-500'
                                : metric === 'reasoning'
                                ? 'bg-purple-500'
                                : metric === 'creativity'
                                ? 'bg-pink-500'
                                : 'bg-emerald-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Capabilities */}
              <div className="mt-2 flex flex-wrap gap-1">
                {model.hasVision && <span className="badge badge-primary text-xs">Vision</span>}
                {model.hasWebBrowsing && <span className="badge badge-primary text-xs">Web</span>}
                {model.hasCodeExecution && <span className="badge badge-primary text-xs">Code</span>}
                {model.hasImageGeneration && <span className="badge badge-primary text-xs">Images</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <button className="w-full btn btn-secondary text-sm">Compare Models</button>
        <button className="w-full btn btn-secondary text-sm">Orchestrate Pipeline</button>
      </div>
    </div>
  )
}
