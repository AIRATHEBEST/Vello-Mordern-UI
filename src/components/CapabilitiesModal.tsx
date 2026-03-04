import { useState } from 'react'
import {
  Zap,
  FileText,
  Code2,
  Database,
  Globe,
  Brain,
  Image,
  Hand,
  Workflow,
  Lightbulb,
  Download,
  Users,
  X,
  Play,
  Copy,
  Check,
} from 'lucide-react'
import { capabilitiesEngine, CapabilityResult } from '../lib/capabilities-engine'

interface Capability {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  example: string
}

const capabilities: Capability[] = [
  {
    id: 'autonomous_execution',
    title: 'Autonomous Task Execution',
    description: 'Execute tasks independently from start to finish',
    icon: <Zap size={20} />,
    example: 'Create a data analysis pipeline',
  },
  {
    id: 'text_generation',
    title: 'Text & Content Generation',
    description: 'Generate essays, articles, scripts, and reports',
    icon: <FileText size={20} />,
    example: 'Write a professional blog post',
  },
  {
    id: 'code_execution',
    title: 'Code Writing & Execution',
    description: 'Write, debug, and execute code',
    icon: <Code2 size={20} />,
    example: 'Generate Python code',
  },
  {
    id: 'data_handling',
    title: 'Data & File Handling',
    description: 'Process and analyze datasets',
    icon: <Database size={20} />,
    example: 'Analyze sales data',
  },
  {
    id: 'web_automation',
    title: 'Web & Online Automation',
    description: 'Browse websites and extract information',
    icon: <Globe size={20} />,
    example: 'Extract product information',
  },
  {
    id: 'ai_reasoning',
    title: 'AI Reasoning & Analysis',
    description: 'Solve complex problems with reasoning',
    icon: <Brain size={20} />,
    example: 'Analyze business problems',
  },
  {
    id: 'multimodal',
    title: 'Multimodal & Visual Understanding',
    description: 'Analyze images and visual data',
    icon: <Image size={20} />,
    example: 'Analyze a screenshot',
  },
  {
    id: 'haptics',
    title: 'Haptics & Physical Interaction',
    description: 'Track hand motion and haptic feedback',
    icon: <Hand size={20} />,
    example: 'Track hand gestures',
  },
  {
    id: 'workflow_automation',
    title: 'Automation & Workflow Integration',
    description: 'Automate business workflows',
    icon: <Workflow size={20} />,
    example: 'Create email workflow',
  },
  {
    id: 'memory_personalization',
    title: 'Memory & Personalization',
    description: 'Remember preferences and personalize',
    icon: <Lightbulb size={20} />,
    example: 'Save user preferences',
  },
  {
    id: 'deliverables',
    title: 'Deliverables & Output',
    description: 'Generate code, docs, and reports',
    icon: <Download size={20} />,
    example: 'Generate React component',
  },
  {
    id: 'collaboration',
    title: 'Collaboration & Team Features',
    description: 'Create shared workspaces',
    icon: <Users size={20} />,
    example: 'Create team workspace',
  },
]

interface CapabilitiesModalProps {
  onClose: () => void
}

function CapabilityTester({ capability, onClose }: { capability: Capability; onClose: () => void }) {
  const [input, setInput] = useState(capability.example)
  const [result, setResult] = useState<CapabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExecute = async () => {
    setLoading(true)
    try {
      let result: CapabilityResult

      switch (capability.id) {
        case 'autonomous_execution':
          result = await capabilitiesEngine.executeAutonomousTask(input)
          break
        case 'text_generation':
          result = await capabilitiesEngine.generateText(input, 'article')
          break
        case 'code_execution':
          result = await capabilitiesEngine.executeCode(input, 'python')
          break
        case 'data_handling':
          result = await capabilitiesEngine.processData(input, 'json')
          break
        case 'web_automation':
          result = await capabilitiesEngine.automateWebTask(input, 'extract')
          break
        case 'ai_reasoning':
          result = await capabilitiesEngine.analyzeWithReasoning(input)
          break
        case 'multimodal':
          result = await capabilitiesEngine.analyzeImage(input, 'Analyze')
          break
        case 'haptics':
          result = await capabilitiesEngine.trackHandMotion({ x: 0, y: 0, z: 0 })
          break
        case 'workflow_automation':
          result = await capabilitiesEngine.automateWorkflow({ steps: input.split(',') })
          break
        case 'memory_personalization':
          result = await capabilitiesEngine.saveUserPreference('test', input)
          break
        case 'deliverables':
          result = await capabilitiesEngine.generateDeliverable('code', input)
          break
        case 'collaboration':
          result = await capabilitiesEngine.createSharedWorkspace(input, [])
          break
        default:
          result = { success: false, error: 'Unknown', executionTime: 0 }
      }

      setResult(result)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input..."
        className="w-full h-20 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none"
      />
      <button
        onClick={handleExecute}
        disabled={loading || !input.trim()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
      >
        <Play size={16} />
        {loading ? 'Executing...' : 'Execute'}
      </button>
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Result</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/30 border border-slate-700 text-slate-300 text-xs font-mono max-h-32 overflow-auto">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CapabilitiesModal({ onClose }: CapabilitiesModalProps) {
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-100">
            {selectedCapability ? selectedCapability.title : 'All Capabilities'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!selectedCapability ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-6">
              {capabilities.map((capability) => (
                <button
                  key={capability.id}
                  onClick={() => setSelectedCapability(capability)}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                      {capability.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-100 text-sm">{capability.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">{selectedCapability.title}</h3>
                  <p className="text-sm text-slate-400">{selectedCapability.description}</p>
                </div>
                <CapabilityTester
                  capability={selectedCapability}
                  onClose={() => setSelectedCapability(null)}
                />
                <button
                  onClick={() => setSelectedCapability(null)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm"
                >
                  Back to all capabilities
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
