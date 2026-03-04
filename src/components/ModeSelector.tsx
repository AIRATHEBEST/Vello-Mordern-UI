import { useOverlayStore } from '../store/overlayStore'
import { COGNITIVE_MODES, CognitiveMode } from '../lib/models-database'
import { modeSystem } from '../lib/mode-system'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ModeSelector() {
  const { selectedMode, setSelectedMode } = useOverlayStore()
  const [expandedMode, setExpandedMode] = useState<CognitiveMode | null>(null)

  const modes = Object.entries(COGNITIVE_MODES) as [CognitiveMode, typeof COGNITIVE_MODES[CognitiveMode]][]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Cognitive Modes
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Switch between specialized reasoning modes to change how the AI approaches your problem.
        </p>
      </div>

      <div className="space-y-2">
        {modes.map(([modeId, modeData]) => {
          const config = modeSystem.getMode(modeId)
          const isSelected = selectedMode === modeId
          const isExpanded = expandedMode === modeId

          return (
            <div key={modeId} className="space-y-1">
              {/* Mode button */}
              <button
                onClick={() => {
                  setSelectedMode(modeId)
                  setExpandedMode(isExpanded ? null : modeId)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-glow'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-xs opacity-75">{config.thinkingStyle}</div>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="ml-4 space-y-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                  {/* Description */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Description</div>
                    <p className="text-sm text-slate-300">{config.description}</p>
                  </div>

                  {/* Focus Areas */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Focus Areas</div>
                    <div className="flex flex-wrap gap-1">
                      {config.focusAreas.map(area => (
                        <span key={area} className="badge badge-primary text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Response Format */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Response Format</div>
                    <p className="text-sm text-slate-300">{config.responseFormat}</p>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Creativity</div>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < Math.round(config.temperature * 10)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Temperature: {config.temperature.toFixed(1)} (0=Precise, 1=Creative)
                    </div>
                  </div>

                  {/* Enabled Tools */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Enabled Tools</div>
                    <div className="space-y-1">
                      {config.tools.map(tool => (
                        <div key={tool} className="text-xs text-slate-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {tool.replace(/-/g, ' ')}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select button */}
                  {!isSelected && (
                    <button
                      onClick={() => setSelectedMode(modeId)}
                      className="w-full btn btn-primary text-sm mt-2"
                    >
                      Activate {config.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current mode info */}
      {selectedMode && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm font-semibold text-blue-300 mb-2">
            Active Mode: {modeSystem.getMode(selectedMode).name}
          </div>
          <p className="text-xs text-blue-200">
            {modeSystem.getMode(selectedMode).description}
          </p>
        </div>
      )}
    </div>
  )
}
