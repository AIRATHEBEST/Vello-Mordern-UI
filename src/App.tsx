import { useState, useEffect } from 'react'
import { useOverlayStore } from './store/overlayStore'
import { intentRouter } from './lib/intent-router'
import MinimalHeader from './components/MinimalHeader'
import CommandCenter from './components/CommandCenter'
import CapabilitiesModal from './components/CapabilitiesModal'
import MonitoringDashboard from './components/MonitoringDashboard'
import APISettings from './components/APISettings'
import { analytics } from './lib/analytics'

export default function App() {
  const [showCapabilities, setShowCapabilities] = useState(false)
  const [lastIntent, setLastIntent] = useState<string>('')
  const { setLastIntent: storeLastIntent } = useOverlayStore()

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
    setLastIntent(input)
    storeLastIntent(analysis)
    analytics.trackEvent('intent_detected', {
      intent: analysis.intent,
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
        <MinimalHeader onShowCapabilities={() => setShowCapabilities(true)} />

        {/* Command center - the heart of the interface */}
        <CommandCenter
          onIntentDetection={handleIntentDetection}
          onShowCapabilities={() => setShowCapabilities(true)}
        />
      </div>

      {/* Capabilities modal overlay */}
      {showCapabilities && (
        <CapabilitiesModal onClose={() => setShowCapabilities(false)} />
      )}

      {/* Monitoring and settings */}
      <MonitoringDashboard />
      <APISettings />
    </div>
  )
}
