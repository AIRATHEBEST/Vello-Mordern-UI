import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

interface CommandCenterProps {
  onIntentDetection: (input: string) => void
  onShowCapabilities: () => void
}

export default function CommandCenter({
  onIntentDetection,
  onShowCapabilities,
}: CommandCenterProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickSuggestions = [
    'Analyze this data',
    'Write a blog post',
    'Generate Python code',
    'Create a workflow',
    'Reason through this problem',
    'Extract from image',
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
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onIntentDetection(input)
      setInput('')
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onIntentDetection(suggestion)
    setInput('')
    setShowSuggestions(false)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      {/* Main command input */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
            What do you want to do?
          </h1>
          <p className="text-slate-500 text-sm">
            Describe your task. AI will detect your intent and suggest the best approach.
          </p>
        </div>

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
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-lg"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight size={20} />
            </button>
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
