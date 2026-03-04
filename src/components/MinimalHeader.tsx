import { Zap, Settings, HelpCircle } from 'lucide-react'

interface MinimalHeaderProps {
  onShowCapabilities: () => void
}

export default function MinimalHeader({ onShowCapabilities }: MinimalHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/30 bg-black/50 backdrop-blur-md">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-sm font-semibold text-slate-100">Vello</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onShowCapabilities}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200"
            title="Capabilities"
          >
            <Zap size={18} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200"
            title="Help"
          >
            <HelpCircle size={18} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
