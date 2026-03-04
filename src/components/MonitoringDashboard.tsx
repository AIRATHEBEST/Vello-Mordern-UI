import { useState, useEffect } from 'react'
import { analytics } from '../lib/analytics'
import { Activity, AlertCircle, TrendingUp, Download } from 'lucide-react'

export default function MonitoringDashboard() {
  const [summary, setSummary] = useState(analytics.getSummary())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(analytics.getSummary())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleExport = () => {
    const data = analytics.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString()}.json`
    a.click()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg"
      >
        <Activity size={18} />
        <span className="text-sm font-medium">Monitor</span>
      </button>

      {/* Dashboard Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Analytics Dashboard</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Session Info */}
          <div className="p-3 bg-slate-800/50 rounded-lg space-y-2">
            <div className="text-xs text-slate-400">Session ID</div>
            <div className="text-xs font-mono text-slate-300 break-all">{summary.session_id}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Events */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-blue-400" />
                <span className="text-xs text-slate-400">Events</span>
              </div>
              <div className="text-2xl font-bold text-blue-300">{summary.total_events}</div>
            </div>

            {/* Metrics */}
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-green-400" />
                <span className="text-xs text-slate-400">Metrics</span>
              </div>
              <div className="text-2xl font-bold text-green-300">{summary.total_metrics}</div>
            </div>

            {/* Errors */}
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={14} className="text-red-400" />
                <span className="text-xs text-slate-400">Errors</span>
              </div>
              <div className="text-2xl font-bold text-red-300">{summary.total_errors}</div>
            </div>
          </div>

          {/* Recent Events */}
          {summary.events.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">Recent Events</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {summary.events.slice(-5).reverse().map((event, i) => (
                  <div key={i} className="text-xs p-2 bg-slate-800/50 rounded">
                    <div className="text-slate-300">{event.event_type}</div>
                    <div className="text-slate-500 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Errors */}
          {summary.errors.length > 0 && (
            <div className="space-y-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="text-xs font-semibold text-red-400 uppercase">Recent Errors</div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {summary.errors.slice(-3).map((error, i) => (
                  <div key={i} className="text-xs text-red-300">
                    <div>{error.error_type}</div>
                    <div className="text-red-400 text-xs">{error.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-sm font-medium"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      )}
    </div>
  )
}
