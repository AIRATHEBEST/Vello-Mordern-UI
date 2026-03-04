import { useState } from 'react'
import { useOverlayStore } from '../../store/overlayStore'
import { ModelCapability } from '../../lib/models-database'
import { ChevronDown, Plus, Trash2, Send } from 'lucide-react'

interface ReasoningInterfaceProps {
  model: ModelCapability
}

export default function ReasoningInterface({ model }: ReasoningInterfaceProps) {
  const { reasoningDepth, setReasoningDepth, addMessage } = useOverlayStore()
  const [assumptions, setAssumptions] = useState<string[]>([
    'Problem is well-defined',
    'All constraints are known',
  ])
  const [newAssumption, setNewAssumption] = useState('')
  const [input, setInput] = useState('')

  const handleAddAssumption = () => {
    if (newAssumption.trim()) {
      setAssumptions([...assumptions, newAssumption])
      setNewAssumption('')
    }
  }

  const handleRemoveAssumption = (index: number) => {
    setAssumptions(assumptions.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      addMessage({
        role: 'user',
        content: input,
        metadata: { model: model.name, depth: reasoningDepth }
      })
      setInput('')
    }
  }

  const depthConfig = {
    shallow: { time: '10-15s', cost: '$0.05', label: 'Quick' },
    medium: { time: '30-45s', cost: '$0.15', label: 'Balanced' },
    deep: { time: '2-5min', cost: '$0.50', label: 'Thorough' },
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Model header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient">{model.name}</h2>
            <p className="text-slate-400 mt-1">{model.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{model.reasoning}/10</div>
            <div className="text-xs text-slate-500">Reasoning Score</div>
          </div>
        </div>

        {/* Thinking depth slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-300">Thinking Depth</label>
            <div className="text-xs text-slate-500">
              {depthConfig[reasoningDepth].time} • {depthConfig[reasoningDepth].cost}
            </div>
          </div>
          <div className="flex gap-2">
            {(['shallow', 'medium', 'deep'] as const).map((depth) => (
              <button
                key={depth}
                onClick={() => setReasoningDepth(depth)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  reasoningDepth === depth
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-glow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {depthConfig[depth].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Assumptions panel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span>📋</span> Assumptions
          </h3>

          <div className="space-y-2 mb-4">
            {assumptions.map((assumption, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                />
                <span className="flex-1 text-slate-300">{assumption}</span>
                <button
                  onClick={() => handleRemoveAssumption(index)}
                  className="btn btn-ghost p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAssumption}
              onChange={(e) => setNewAssumption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAssumption()}
              placeholder="Add new assumption..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={handleAddAssumption} className="btn btn-primary p-2">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Reasoning tree placeholder */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span>🌳</span> Reasoning Tree
          </h3>
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700 text-slate-400 text-sm">
            <p>Enter your problem above to see the reasoning tree unfold step by step.</p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your reasoning problem... (e.g., 'Prove that x > y given these constraints...')"
            rows={3}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1 gap-2">
              <Send size={18} />
              Start Reasoning
            </button>
            <button type="button" className="btn btn-secondary">
              Validate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
