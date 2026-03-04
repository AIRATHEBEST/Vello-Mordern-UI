import { useState } from 'react'
import { useOverlayStore } from '../store/overlayStore'
import { Sparkles, Settings, HelpCircle, Brain } from 'lucide-react'

interface HeaderProps {
  onIntentDetection: (input: string) => void
}

export default function Header({ onIntentDetection }: HeaderProps) {
  const [searchInput, setSearchInput] = useState('')
  const { selectedMode, setSelectedMode } = useOverlayStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onIntentDetection(searchInput)
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="px-4 py-4 space-y-4">
        {/* Logo and title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Vello AI</h1>
              <p className="text-xs text-slate-400">Intelligence OS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost p-2" title="Help">
              <HelpCircle size={20} />
            </button>
            <button className="btn btn-ghost p-2" title="Settings">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Intent detector input */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Describe what you want to do... (e.g., 'prove this theorem', 'write code', 'research this topic')"
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <p className="text-xs text-slate-500 px-3">
            AI will detect your intent and suggest the best model
          </p>
        </form>

        {/* Cognitive mode selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cognitive Mode
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'architect', icon: '🏗️', label: 'Architect' },
              { id: 'engineer', icon: '⚙️', label: 'Engineer' },
              { id: 'researcher', icon: '🔬', label: 'Researcher' },
              { id: 'philosopher', icon: '🧠', label: 'Philosopher' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id as any)}
                className={`p-2 rounded-lg text-center text-xs font-medium transition-all ${
                  selectedMode === mode.id
                    ? 'bg-blue-500/30 border border-blue-500 text-blue-300'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-lg mb-1">{mode.icon}</div>
                <div className="text-xs">{mode.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
