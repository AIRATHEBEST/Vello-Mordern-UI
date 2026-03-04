import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Upload,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { advancedIntentRouter, IntentAnalysis } from '../lib/advanced-intent-router'
import { multiProviderAPI, FileAttachment } from '../lib/multi-provider-api'

interface EnhancedCommandCenterProps {
  onIntentDetection: (input: string, analysis: IntentAnalysis) => void
  onShowCapabilities: () => void
}

export default function EnhancedCommandCenter({
  onIntentDetection,
  onShowCapabilities,
}: EnhancedCommandCenterProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<IntentAnalysis | null>(null)
  const [selectedProvider, setSelectedProvider] = useState('ollama')
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const quickSuggestions = [
    'Analyze this data',
    'Write a blog post',
    'Generate Python code',
    'Create a workflow',
    'Reason through this problem',
    'Extract from image',
    'Automate this task',
    'Summarize this document',
  ]

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleInputChange = (e: string) => {
    setInput(e)
    if (e.length > 0) {
      const filtered = quickSuggestions.filter((s) =>
        s.toLowerCase().includes(e.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)

      // Real-time capability detection
      const analysis = advancedIntentRouter.analyzeIntent(
        e,
        attachments.map((a) => a.type)
      )
      setSelectedCapability(analysis)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedCapability(null)
    }
  }

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setLoading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const attachment = await multiProviderAPI.addFileAttachment(file)
        setAttachments((prev) => [...prev, attachment])
      }
    } catch (error) {
      console.error('Failed to attach file:', error)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
    multiProviderAPI.removeAttachment(attachmentId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && selectedCapability) {
      multiProviderAPI.selectProvider(selectedProvider)
      onIntentDetection(input, selectedCapability)
      setInput('')
      setAttachments([])
      setSelectedCapability(null)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    const analysis = advancedIntentRouter.analyzeIntent(
      suggestion,
      attachments.map((a) => a.type)
    )
    setSelectedCapability(analysis)
    setShowSuggestions(false)
  }

  const enabledProviders = multiProviderAPI.getEnabledProviders()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {/* Main command input */}
      <div className="w-full max-w-3xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
            What do you want to do?
          </h1>
          <p className="text-slate-500 text-sm">
            Describe your task. AI will automatically select the best capability and provider.
          </p>
        </div>

        {/* Provider selector */}
        {enabledProviders.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900/30 border border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="flex-1 bg-transparent text-slate-300 text-sm focus:outline-none"
            >
              {enabledProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Command input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Sparkles size={20} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => input.length > 0 && setShowSuggestions(true)}
              placeholder="e.g., 'write code to analyze sales data', 'create a workflow', 'reason through this problem'..."
              className="w-full pl-12 pr-24 py-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
                title="Attach file"
              >
                <Upload size={18} />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || !selectedCapability}
                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md z-50">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
                >
                  <span>{suggestion}</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </form>

        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileAttach}
          className="hidden"
          accept="image/*,.pdf,.json,.csv,.txt,.py,.js,.ts,.jsx,.tsx"
        />

        {/* Attachments display */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-300 truncate">{attachment.name}</span>
                    <span className="text-xs text-slate-600">
                      ({(attachment.size / 1024).toFixed(1)}KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="p-1 rounded hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capability preview */}
        {selectedCapability && (
          <div className="px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-slate-200">
                  {selectedCapability.capability.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-slate-400">
                    {(selectedCapability.confidence * 100).toFixed(0)}% match
                  </span>
                </div>
                <span className="text-xs text-slate-500">→ {selectedCapability.provider}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">{selectedCapability.description}</p>
          </div>
        )}

        {/* Quick actions */}
        <div className="space-y-3">
          <p className="text-xs text-slate-600 uppercase tracking-wider">Quick actions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickSuggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 rounded-lg bg-slate-900/30 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-sm flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities hint */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={onShowCapabilities}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            <Zap size={16} />
            <span>Explore all capabilities</span>
          </button>
        </div>
      </div>
    </div>
  )
}
