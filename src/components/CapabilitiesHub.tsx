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
  ChevronRight,
  Play,
  Copy,
  Check,
} from 'lucide-react'
import { capabilitiesEngine, CapabilityType, CapabilityResult } from '../lib/capabilities-engine'

interface Capability {
  id: CapabilityType
  title: string
  description: string
  icon: React.ReactNode
  color: string
  example: string
}

const capabilities: Capability[] = [
  {
    id: 'autonomous_execution',
    title: 'Autonomous Task Execution',
    description: 'Execute tasks independently from start to finish with multi-step planning',
    icon: <Zap size={24} />,
    color: 'from-blue-500 to-blue-600',
    example: 'Create a data analysis pipeline and generate a report',
  },
  {
    id: 'text_generation',
    title: 'Text & Content Generation',
    description: 'Generate essays, articles, scripts, summaries, and structured documents',
    icon: <FileText size={24} />,
    color: 'from-purple-500 to-purple-600',
    example: 'Write a professional blog post about AI trends',
  },
  {
    id: 'code_execution',
    title: 'Code Writing & Execution',
    description: 'Write, debug, and execute code in Python, JavaScript, and more',
    icon: <Code2 size={24} />,
    color: 'from-green-500 to-green-600',
    example: 'Generate Python code for data visualization',
  },
  {
    id: 'data_handling',
    title: 'Data & File Handling',
    description: 'Read, process, analyze datasets (CSV, JSON, Excel) and generate insights',
    icon: <Database size={24} />,
    color: 'from-orange-500 to-orange-600',
    example: 'Analyze sales data and create a summary report',
  },
  {
    id: 'web_automation',
    title: 'Web & Online Automation',
    description: 'Browse websites, extract information, fill forms, and access live data',
    icon: <Globe size={24} />,
    color: 'from-cyan-500 to-cyan-600',
    example: 'Extract product information from an e-commerce site',
  },
  {
    id: 'ai_reasoning',
    title: 'AI Reasoning & Analysis',
    description: 'Solve complex logic problems, perform deep research, and synthesize findings',
    icon: <Brain size={24} />,
    color: 'from-pink-500 to-pink-600',
    example: 'Analyze a complex business problem with multi-step reasoning',
  },
  {
    id: 'multimodal',
    title: 'Multimodal & Visual Understanding',
    description: 'Analyze images, process diagrams, and combine text with visual data',
    icon: <Image size={24} />,
    color: 'from-indigo-500 to-indigo-600',
    example: 'Analyze a screenshot and extract text content',
  },
  {
    id: 'haptics',
    title: 'Haptics & Physical Interaction',
    description: 'Track hand motion, finger positions, and provide haptic feedback',
    icon: <Hand size={24} />,
    color: 'from-red-500 to-red-600',
    example: 'Track hand gestures for VR interaction',
  },
  {
    id: 'workflow_automation',
    title: 'Automation & Workflow Integration',
    description: 'Automate business workflows, integrate APIs, and execute complex tasks',
    icon: <Workflow size={24} />,
    color: 'from-teal-500 to-teal-600',
    example: 'Create an automated email notification workflow',
  },
  {
    id: 'memory_personalization',
    title: 'Memory & Personalization',
    description: 'Remember preferences, retain context, and provide personalized responses',
    icon: <Lightbulb size={24} />,
    color: 'from-yellow-500 to-yellow-600',
    example: 'Save user preferences and customize responses',
  },
  {
    id: 'deliverables',
    title: 'Deliverables & Output',
    description: 'Generate code, apps, documents, presentations, and reports',
    icon: <Download size={24} />,
    color: 'from-emerald-500 to-emerald-600',
    example: 'Generate a complete React component with tests',
  },
  {
    id: 'collaboration',
    title: 'Collaboration & Team Features',
    description: 'Support team-based access, shared workspaces, and multi-agent coordination',
    icon: <Users size={24} />,
    color: 'from-violet-500 to-violet-600',
    example: 'Create a shared workspace for team collaboration',
  },
]

interface CapabilityCardProps {
  capability: Capability
  onSelect: (capability: Capability) => void
}

function CapabilityCard({ capability, onSelect }: CapabilityCardProps) {
  return (
    <button
      onClick={() => onSelect(capability)}
      className={`relative group overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br ${capability.color}/10 p-6 text-left transition-all hover:border-slate-600 hover:shadow-lg hover:shadow-${capability.color.split('-')[1]}-500/20`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="relative z-10 space-y-3">
        <div className={`inline-block p-2 rounded-lg bg-gradient-to-br ${capability.color} text-white`}>
          {capability.icon}
        </div>
        <h3 className="font-semibold text-slate-100">{capability.title}</h3>
        <p className="text-sm text-slate-400">{capability.description}</p>
        <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 group-hover:text-slate-400">
          <span>Try it</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </button>
  )
}

interface TestPanelProps {
  capability: Capability
  onClose: () => void
}

function TestPanel({ capability, onClose }: TestPanelProps) {
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
          result = await capabilitiesEngine.analyzeImage(input, 'Analyze this image')
          break
        case 'haptics':
          result = await capabilitiesEngine.trackHandMotion({ x: 0, y: 0, z: 0 })
          break
        case 'workflow_automation':
          result = await capabilitiesEngine.automateWorkflow({ steps: input.split(',') })
          break
        case 'memory_personalization':
          result = await capabilitiesEngine.saveUserPreference('test_key', input)
          break
        case 'deliverables':
          result = await capabilitiesEngine.generateDeliverable('code', input)
          break
        case 'collaboration':
          result = await capabilitiesEngine.createSharedWorkspace(input, ['user@example.com'])
          break
        default:
          result = { success: false, error: 'Unknown capability', executionTime: 0 }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-700 bg-slate-900/95 backdrop-blur px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${capability.color} text-white`}>
              {capability.icon}
            </div>
            <div>
              <h2 className="font-bold text-slate-100">{capability.title}</h2>
              <p className="text-xs text-slate-400">{capability.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input..."
              className="w-full h-24 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 resize-none"
            />
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={loading || !input.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play size={18} />
            {loading ? 'Executing...' : 'Execute'}
          </button>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">Result</label>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-900/20 border-green-700/30'
                    : 'bg-red-900/20 border-red-700/30'
                } text-slate-100 text-sm font-mono overflow-auto max-h-64`}
              >
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              <div className="text-xs text-slate-500">
                Execution time: {result.executionTime}ms
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CapabilitiesHub() {
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vello Capabilities Hub
          </h1>
          <p className="text-xl text-slate-400">
            Explore and test all 12 core AI capabilities in one unified platform
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              onSelect={setSelectedCapability}
            />
          ))}
        </div>

        {/* Test Panel */}
        {selectedCapability && (
          <TestPanel capability={selectedCapability} onClose={() => setSelectedCapability(null)} />
        )}
      </div>
    </div>
  )
}
