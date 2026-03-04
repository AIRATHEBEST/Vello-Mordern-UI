import { useState, useEffect } from 'react'
import { useOverlayStore } from './store/overlayStore'
import { advancedIntentRouter, IntentAnalysis } from './lib/advanced-intent-router'
import MinimalHeader from './components/MinimalHeader'
import EnhancedCommandCenter from './components/EnhancedCommandCenter'
import CapabilitiesModal from './components/CapabilitiesModal'
import ProviderConfigPanel from './components/ProviderConfigPanel'
import MonitoringDashboard from './components/MonitoringDashboard'
import APISettings from './components/APISettings'
import { analytics } from './lib/analytics'

export default function App() {
  const [showCapabilities, setShowCapabilities] = useState(false)
  const [showProviderConfig, setShowProviderConfig] = useState(false)
  const [lastIntent, setLastIntent] = useState<string>('')
  const [lastAnalysis, setLastAnalysis] = useState<IntentAnalysis | null>(null)
  const { setLastIntent: storeLastIntent } = useOverlayStore()

  useEffect(() => {
    // Initialize API provider settings
    const savedProvider = localStorage.getItem('selected_provider')
    if (!savedProvider) {
      localStorage.setItem('selected_provider', 'ollama')
    }

    analytics.trackEvent('app_loaded', {
      timestamp: Date.now(),
    })
  }, [])

  const handleIntentDetection = (input: string, analysis: IntentAnalysis) => {
    setLastIntent(input)
    setLastAnalysis(analysis)
    storeLastIntent(analysis)
    analytics.trackEvent('intent_detected', {
      capability: analysis.capability,
      provider: analysis.provider,
      confidence: analysis.confidence,
    })
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Minimal header */}
        <MinimalHeader
          onShowCapabilities={() => setShowCapabilities(true)}
          onShowProviderConfig={() => setShowProviderConfig(true)}
        />

        {/* Command center - the heart of the interface */}
        <EnhancedCommandCenter
          onIntentDetection={handleIntentDetection}
          onShowCapabilities={() => setShowCapabilities(true)}
        />
      </div>

      {/* Capabilities modal overlay */}
      {showCapabilities && (
        <CapabilitiesModal onClose={() => setShowCapabilities(false)} />
      )}

      {/* Provider configuration panel */}
      {showProviderConfig && (
        <ProviderConfigPanel onClose={() => setShowProviderConfig(false)} />
      )}

      {/* Monitoring and settings */}
      <MonitoringDashboard />
      <APISettings />
    </div>
  )
}
