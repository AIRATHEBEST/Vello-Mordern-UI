import { useState } from 'react'
import { ChevronDown, Plus, Trash2, AlertCircle, TrendingUp } from 'lucide-react'

interface CognitiveTool {
  id: string
  name: string
  description: string
  icon: string
  category: 'analysis' | 'generation' | 'validation' | 'visualization'
}

const COGNITIVE_TOOLS: CognitiveTool[] = [
  {
    id: 'assumption-editor',
    name: 'Assumption Editor',
    description: 'Identify and challenge underlying assumptions',
    icon: '📋',
    category: 'analysis'
  },
  {
    id: 'bias-detector',
    name: 'Bias Detector',
    description: 'Detect cognitive and confirmation biases',
    icon: '🎯',
    category: 'analysis'
  },
  {
    id: 'constraint-panel',
    name: 'Constraint Panel',
    description: 'Define and track problem constraints',
    icon: '🔒',
    category: 'analysis'
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    description: 'Visualize decision paths and outcomes',
    icon: '🌳',
    category: 'visualization'
  },
  {
    id: 'proof-validator',
    name: 'Proof Validator',
    description: 'Step-by-step logical proof verification',
    icon: '✓',
    category: 'validation'
  },
  {
    id: 'risk-model',
    name: 'Risk Modeler',
    description: 'Identify and quantify risks',
    icon: '⚠️',
    category: 'analysis'
  },
  {
    id: 'scenario-planner',
    name: 'Scenario Planner',
    description: 'Explore multiple future scenarios',
    icon: '🔮',
    category: 'generation'
  },
  {
    id: 'synthesis-engine',
    name: 'Synthesis Engine',
    description: 'Combine multiple perspectives into unified view',
    icon: '🔄',
    category: 'generation'
  },
]

interface CognitiveToolsProps {
  onToolSelect?: (toolId: string) => void
}

export default function CognitiveTools({ onToolSelect }: CognitiveToolsProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>('analysis')

  const categories = ['analysis', 'generation', 'validation', 'visualization']

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
    onToolSelect?.(toolId)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Cognitive Augmentation Tools
        </h3>
        <p className="text-xs text-slate-500">
          Select tools to enhance your thinking and analysis
        </p>
      </div>

      {categories.map(category => {
        const tools = COGNITIVE_TOOLS.filter(t => t.category === category)
        const isExpanded = expandedCategory === category

        return (
          <div key={category} className="space-y-2">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <span className="text-sm font-medium text-slate-300 capitalize">{category}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {isExpanded && (
              <div className="space-y-1 ml-2">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-start gap-3 ${
                      selectedTools.includes(tool.id)
                        ? 'bg-blue-500/20 border border-blue-500 text-blue-300'
                        : 'bg-slate-800/30 border border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs opacity-75 truncate">{tool.description}</div>
                    </div>
                    {selectedTools.includes(tool.id) && (
                      <div className="text-blue-400 flex-shrink-0">✓</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {selectedTools.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <TrendingUp size={16} />
            <span>{selectedTools.length} tools active</span>
          </div>
          <button className="w-full btn btn-primary text-sm">
            Activate Tools
          </button>
        </div>
      )}
    </div>
  )
}
