import { useState, useEffect } from 'react'
import { useOverlayStore } from './store/overlayStore'
import { intentRouter } from './lib/intent-router'
import Header from './components/Header'
import ModelSelector from './components/ModelSelector'
import SpecializedInterface from './components/SpecializedInterface'
import MonitoringDashboard from './components/MonitoringDashboard'
import APISettings from './components/APISettings'
import { analytics } from './lib/analytics'
import { Menu, X } from 'lucide-react'

export default function App() {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const { sidebarOpen, setSidebarOpen, selectedModel, setLastIntent } = useOverlayStore()

  useEffect(() => {
    // Initialize API provider settings
    const savedProvider = localStorage.getItem('api_provider')
    if (!savedProvider) {
      localStorage.setItem('api_provider', 'vello')
    }

    analytics.trackEvent('app_loaded', {
      timestamp: Date.now(),
    })
  }, [])

  const handleIntentDetection = (input: string) => {
    const analysis = intentRouter.analyzeIntent(input)
    setLastIntent(analysis)
    analytics.trackEvent('intent_detected', {
      intent: analysis.intent,
      confidence: analysis.confidence,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <Header onIntentDetection={handleIntentDetection} />

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar toggle button (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-20 left-4 z-40 lg:hidden btn btn-secondary"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Model Selector Sidebar */}
          <div
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed lg:relative lg:translate-x-0 left-0 top-0 h-full w-80 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 z-30 lg:z-10 overflow-y-auto pt-20 lg:pt-0`}
          >
            <ModelSelector />
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            {selectedModel ? (
              <SpecializedInterface model={selectedModel} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gradient">Select a Model</h2>
                  <p className="text-slate-400">Choose a model from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <MonitoringDashboard />
      <APISettings />
    </div>
  )
}
