import { useState } from 'react'
import { useOverlayStore } from '../store/overlayStore'
import { MODEL_DATABASE, ModelCategory } from '../lib/models-database'
import { Zap, Code, Globe, Sparkles, Eye, Feather } from 'lucide-react'

const CATEGORY_INFO: Record<ModelCategory, { icon: React.ReactNode; label: string; color: string }> = {
  'deep-reasoning': { icon: <Sparkles size={18} />, label: 'Deep Reasoning', color: 'from-purple-500 to-blue-500' },
  'coding-technical': { icon: <Code size={18} />, label: 'Coding & Technical', color: 'from-blue-500 to-cyan-500' },
  'web-research': { icon: <Globe size={18} />, label: 'Web Research', color: 'from-cyan-500 to-teal-500' },
  'creative-character': { icon: <Feather size={18} />, label: 'Creative', color: 'from-pink-500 to-rose-500' },
  'vision-analysis': { icon: <Eye size={18} />, label: 'Vision Analysis', color: 'from-orange-500 to-red-500' },
  'fast-lightweight': { icon: <Zap size={18} />, label: 'Fast & Light', color: 'from-yellow-500 to-orange-500' },
  'balanced-general': { icon: <Sparkles size={18} />, label: 'Balanced', color: 'from-green-500 to-emerald-500' },
}

export default function ModelSelector() {
  const [expandedCategory, setExpandedCategory] = useState<ModelCategory>('deep-reasoning')
  const { selectedModel, setSelectedModel, selectedCategory, setSelectedCategory } = useOverlayStore()

  const categories = Object.keys(CATEGORY_INFO) as ModelCategory[]
  const modelsInCategory = Object.values(MODEL_DATABASE).filter(
    (m) => m.category === expandedCategory
  )

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
                <div className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                  model.tier === 'free'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : model.tier === 'pro'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-purple-500/20 text-purple-300'
                }`}>
                  {model.tier}
                </div>
              </div>

              {/* Model metrics */}
              <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-500">Speed</div>
                  <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < model.speed ? 'bg-blue-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-500">Reason</div>
                  <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < model.reasoning ? 'bg-purple-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-500">Creative</div>
                  <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < model.creativity ? 'bg-pink-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-slate-500">Accuracy</div>
                  <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < model.accuracy ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
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
        <button className="w-full btn btn-secondary text-sm">
          Compare Models
        </button>
        <button className="w-full btn btn-secondary text-sm">
          Orchestrate Pipeline
        </button>
      </div>
    </div>
  )
}
