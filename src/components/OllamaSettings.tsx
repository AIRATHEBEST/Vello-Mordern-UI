import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw,
  Check,
  X,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Copy,
  CheckCheck,
  Globe,
  Lock,
} from 'lucide-react'
import { ollamaAPI, OllamaModel, OllamaConnectionResult } from '../lib/ollama-api'

interface OllamaSettingsProps {
  onModelSelect?: (modelName: string) => void
  selectedModel?: string
}

type ConnectionMode = 'local' | 'remote'

export default function OllamaSettings({ onModelSelect, selectedModel }: OllamaSettingsProps) {
  const [mode, setMode] = useState<ConnectionMode>('local')
  const [localUrl, setLocalUrl] = useState('http://localhost:11434')
  const [remoteUrl, setRemoteUrl] = useState('')
  const [connectionResult, setConnectionResult] = useState<OllamaConnectionResult | null>(null)
  const [models, setModels] = useState<OllamaModel[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [showCORSFix, setShowCORSFix] = useState(false)
  const [showTunnelGuide, setShowTunnelGuide] = useState(false)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [useCORSProxy, setUseCORSProxy] = useState(false)
  const [showExtensionGuide, setShowExtensionGuide] = useState(false)

  useEffect(() => {
    const savedUrl = localStorage.getItem('ollama_base_url') || 'http://localhost:11434'
    const isRemote = localStorage.getItem('ollama_is_remote') === 'true'
    const savedUseCORSProxy = localStorage.getItem('ollama_use_cors_proxy') === 'true'

    setUseCORSProxy(savedUseCORSProxy)

    // Auto-detect tunnel URLs and switch to Tunnel mode
    const isTunnelUrl = savedUrl.includes('ngrok') ||
      savedUrl.includes('loca.lt') ||
      savedUrl.includes('zrok') ||
      savedUrl.includes('trycloudflare.com') ||
      savedUrl.includes('cloudflare') ||
      (isRemote && savedUrl.startsWith('https://'))
    if (isTunnelUrl) {
      setMode('remote')
      setRemoteUrl(savedUrl)
    } else {
      setMode('local')
      setLocalUrl(savedUrl)
    }

    // Auto-check on mount
    handleCheck(savedUrl)
  }, [])

  const handleCheck = useCallback(async (urlOverride?: string) => {
    const url = urlOverride ?? (mode === 'local' ? localUrl : remoteUrl)
    if (!url) return

    ollamaAPI.setBaseUrl(url)
    setIsChecking(true)
    setConnectionResult(null)

    const result = await ollamaAPI.checkConnectivityDetailed()
    setConnectionResult(result)

    if (result.connected && result.models) {
      setModels(result.models)
    } else {
      const cached = ollamaAPI.getCachedModels()
      if (cached.length > 0) setModels(cached)
    }

    if (result.corsIssue) setShowCORSFix(true)
    if (result.mixedContentIssue) setShowTunnelGuide(true)

    setIsChecking(false)
  }, [mode, localUrl, remoteUrl])

  const handleModeChange = (newMode: ConnectionMode) => {
    setMode(newMode)
    setConnectionResult(null)
    setShowCORSFix(false)
    setShowTunnelGuide(false)
  }

  const copyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopiedCommand(cmd)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch {
      // Fallback
    }
  }

  const isConnected = connectionResult?.connected === true
  const hasCORSIssue = connectionResult?.corsIssue === true
  const hasMixedContentIssue = connectionResult?.mixedContentIssue === true

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Connection Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleModeChange('local')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'local'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Cpu size={13} />
            Local
          </button>
          <button
            onClick={() => handleModeChange('remote')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'remote'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Globe size={13} />
            Tunnel
          </button>
        </div>
      </div>

      {/* Local Mode */}
      {mode === 'local' && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Local Ollama URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="http://localhost:11434"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
            <button
              onClick={() => handleCheck()}
              disabled={isChecking}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {isChecking ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {isChecking ? 'Checking…' : 'Connect'}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            For local Ollama running on your PC. Requires CORS fix if on HTTPS site.
          </p>
        </div>
      )}

      {/* Remote Mode (Tunnel) */}
      {mode === 'remote' && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tunnel URL (LocalTunnel / ngrok / zrok / Cloudflare)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={remoteUrl}
              onChange={(e) => setRemoteUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="https://abc123.loca.lt or https://your-tunnel.ngrok.io"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
            <button
              onClick={() => handleCheck()}
              disabled={isChecking}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {isChecking ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {isChecking ? 'Checking…' : 'Connect'}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Use a tunnel to securely expose your local Ollama to the internet.{' '}
            <button
              onClick={() => setShowTunnelGuide(!showTunnelGuide)}
              className="text-purple-400 hover:underline"
            >
              Setup guide →
            </button>
          </p>
        </div>
      )}

      {/* CORS Proxy Toggle */}
      {mode === 'remote' && (
        <div className="space-y-2 rounded-lg bg-slate-800/50 border border-slate-700 p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCORSProxy}
              onChange={(e) => {
                const newValue = e.target.checked
                setUseCORSProxy(newValue)
                ollamaAPI.setUseCORSProxy(newValue)
                setTimeout(() => handleCheck(), 100)
              }}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-xs font-medium text-slate-300">Use CORS Proxy</span>
          </label>
          <p className="text-xs text-slate-500 pl-6">
            Enable if you see 403 errors. Routes through a public CORS proxy.
          </p>
        </div>
      )}

      {/* Browser Extension Guide (Easy Fix) */}
      {mode === 'remote' && (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowExtensionGuide(!showExtensionGuide)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-green-400" />
              <span className="font-medium">Easy Fix: Browser Extension (Free Forever)</span>
            </div>
            {showExtensionGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showExtensionGuide && (
            <div className="px-3 py-3 bg-slate-900 space-y-3 text-xs text-slate-300">
              <p className="text-slate-400">
                Install a free browser extension that disables CORS checks. This is the easiest, most reliable solution.
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-slate-200">Option 1: CORS Unblock (Recommended)</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400 ml-2">
                  <li>Go to <a href="https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloounmfbmnp" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Chrome Web Store</a></li>
                  <li>Click "Add to Chrome"</li>
                  <li>Click the extension icon in your toolbar</li>
                  <li>Toggle it ON (blue)</li>
                  <li>Refresh Vello and click Connect</li>
                </ol>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <p className="font-semibold text-slate-200">Option 2: Allow CORS</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400 ml-2">
                  <li>Go to <a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Chrome Web Store</a></li>
                  <li>Click "Add to Chrome"</li>
                  <li>Toggle it ON</li>
                  <li>Refresh Vello and click Connect</li>
                </ol>
              </div>
              <p className="text-slate-500 pt-2 border-t border-slate-700">
                <strong>Note:</strong> The extension only works on this site and only when you toggle it ON. It's completely safe and free forever.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Connection Status */}
      {connectionResult && (
        <div
          className={`rounded-lg p-3 border text-sm ${
            isConnected
              ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300'
              : hasMixedContentIssue || hasCORSIssue
              ? 'bg-amber-950/50 border-amber-700/50 text-amber-300'
              : 'bg-red-950/50 border-red-700/50 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi size={15} className="text-emerald-400 flex-shrink-0" />
            ) : hasMixedContentIssue || hasCORSIssue ? (
              <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            ) : (
              <WifiOff size={15} className="text-red-400 flex-shrink-0" />
            )}
            <span className="font-medium">
              {isConnected
                ? `Connected — Ollama ${connectionResult.version ?? ''}`
                : hasMixedContentIssue
                ? 'Mixed Content blocked: Use a tunnel'
                : hasCORSIssue
                ? 'Ollama is running but CORS is blocking'
                : 'Cannot connect to Ollama'}
            </span>
          </div>
          {!isConnected && connectionResult.error && (
            <p className="mt-1 text-xs opacity-80 pl-5">{connectionResult.error}</p>
          )}
          {isConnected && models.length > 0 && (
            <p className="mt-1 text-xs opacity-80 pl-5">
              {models.length} model{models.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>
      )}

      {/* CORS Fix Panel (Local Mode) */}
      {mode === 'local' && (hasCORSIssue || !isConnected) && (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowCORSFix(!showCORSFix)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="font-medium">Fix: Enable CORS for Ollama Desktop App</span>
            </div>
            {showCORSFix ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCORSFix && (
            <div className="px-3 py-3 bg-slate-900 space-y-3 text-xs text-slate-300">
              <p className="text-slate-400">
                The Ollama desktop app blocks browser requests by default. Run the command below
                for your OS, then restart Ollama.
              </p>

              {/* Windows */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Windows (CMD as Administrator):</p>
                <CopyableCommand
                  cmd={`setx OLLAMA_ORIGINS "*"`}
                  copiedCommand={copiedCommand}
                  onCopy={copyCommand}
                />
                <p className="text-slate-500 pl-1">Then restart the Ollama desktop app.</p>
              </div>

              {/* macOS */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">macOS (Terminal):</p>
                <CopyableCommand
                  cmd={`launchctl setenv OLLAMA_ORIGINS "*" && killall Ollama && open -a Ollama`}
                  copiedCommand={copiedCommand}
                  onCopy={copyCommand}
                />
              </div>

              {/* Linux */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Linux (systemd):</p>
                <CopyableCommand
                  cmd={`sudo systemctl edit ollama.service\n# Add: Environment="OLLAMA_ORIGINS=*"\nsudo systemctl daemon-reload && sudo systemctl restart ollama`}
                  copiedCommand={copiedCommand}
                  onCopy={copyCommand}
                />
              </div>

              <p className="text-slate-500 pt-1">
                After restarting, click <strong className="text-slate-300">Connect</strong> above
                to verify.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tunnel Setup Guide (Remote Mode) */}
      {mode === 'remote' && (
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowTunnelGuide(!showTunnelGuide)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-purple-400" />
              <span className="font-medium">Setup: Expose Ollama via Tunnel (1-click)</span>
            </div>
            {showTunnelGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTunnelGuide && (
            <div className="px-3 py-3 bg-slate-900 space-y-3 text-xs text-slate-300">
              <p className="text-slate-400">
                Choose a tunnel service to securely expose your local Ollama to the internet.
              </p>

              {/* LocalTunnel - Recommended */}
              <div className="space-y-1 rounded bg-purple-900/30 border border-purple-700/40 p-2">
                <p className="font-semibold text-purple-300">⭐ Option 1: LocalTunnel (Recommended — No Account)</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                  <li>Install: <code className="bg-slate-950 px-1 rounded text-purple-300">npm install -g localtunnel</code></li>
                  <li>Run: <code className="bg-slate-950 px-1 rounded text-purple-300">lt --port 11434</code></li>
                  <li>Copy the URL (e.g., <code className="bg-slate-950 px-1 rounded text-purple-300">https://abc123.loca.lt</code>)</li>
                  <li>Paste it above and click <strong>Connect</strong></li>
                </ol>
                <p className="text-slate-500 text-xs mt-1">If you see a "Bypass" page, click "Click to Continue" once in your browser.</p>
              </div>

              {/* ngrok */}
              <div className="space-y-1 rounded bg-slate-800 p-2">
                <p className="font-semibold text-slate-200">Option 2: ngrok</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                  <li>Sign up at <a href="https://ngrok.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">ngrok.com</a></li>
                  <li>Download ngrok and get your auth token</li>
                  <li>Run: <code className="bg-slate-950 px-1 rounded text-purple-300">ngrok http 11434</code></li>
                  <li>Copy the HTTPS URL and paste it above</li>
                </ol>
              </div>

              {/* zrok */}
              <div className="space-y-1 rounded bg-slate-800 p-2">
                <p className="font-semibold text-slate-200">Option 3: zrok (Open Source)</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                  <li>Install zrok: <CopyableCommand cmd="brew install zrok" copiedCommand={copiedCommand} onCopy={copyCommand} inline /></li>
                  <li>Run: <code className="bg-slate-950 px-1 rounded text-purple-300">zrok share http 11434</code></li>
                  <li>Copy the generated URL and paste it above</li>
                </ol>
              </div>

              {/* Cloudflare */}
              <div className="space-y-1 rounded bg-slate-800 p-2">
                <p className="font-semibold text-slate-200">Option 4: Cloudflare Tunnel</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                  <li>Install cloudflared: <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Download</a></li>
                  <li>Run: <code className="bg-slate-950 px-1 rounded text-purple-300">cloudflared tunnel --url http://localhost:11434</code></li>
                  <li>Copy the HTTPS URL and paste it above</li>
                </ol>
              </div>

              <p className="text-slate-500 pt-2 border-t border-slate-700">
                <strong>Tip:</strong> Keep the tunnel running in a terminal while using Vello.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Model List */}
      {models.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Your Ollama Models ({models.length})
            </label>
            <button
              onClick={() => handleCheck()}
              disabled={isChecking}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={11} className={isChecking ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {models.map((model) => (
              <ModelCard
                key={model.name}
                model={model}
                isSelected={selectedModel === model.name}
                onSelect={() => onModelSelect?.(model.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when connected but no models */}
      {isConnected && models.length === 0 && (
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4 text-center space-y-2">
          <Cpu size={24} className="text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400">No models found</p>
          <p className="text-xs text-slate-500">
            Pull a model with:{' '}
            <code className="bg-slate-900 px-1.5 py-0.5 rounded text-purple-300">
              ollama pull llama3.1
            </code>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: OllamaModel
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
        isSelected
          ? 'bg-purple-600/20 border-purple-500 text-purple-200'
          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-purple-600/50 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu size={14} className={isSelected ? 'text-purple-400' : 'text-slate-500'} />
          <span className="font-medium text-sm truncate">{model.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {model.size > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <HardDrive size={11} />
              <span>{formatModelSize(model.size)}</span>
            </div>
          )}
          {isSelected && <Check size={14} className="text-purple-400" />}
        </div>
      </div>
      {model.details && (
        <div className="mt-1 flex gap-2 text-xs text-slate-500">
          {model.details.parameter_size && (
            <span className="bg-slate-900 px-1.5 py-0.5 rounded">{model.details.parameter_size}</span>
          )}
          {model.details.quantization_level && (
            <span className="bg-slate-900 px-1.5 py-0.5 rounded">{model.details.quantization_level}</span>
          )}
          {model.details.family && (
            <span className="bg-slate-900 px-1.5 py-0.5 rounded capitalize">{model.details.family}</span>
          )}
        </div>
      )}
    </button>
  )
}

function CopyableCommand({
  cmd,
  copiedCommand,
  onCopy,
  inline,
}: {
  cmd: string
  copiedCommand: string | null
  onCopy: (cmd: string) => void
  inline?: boolean
}) {
  const isCopied = copiedCommand === cmd
  const displayCmd = cmd.split('\n')[0] + (cmd.includes('\n') ? ' …' : '')

  if (inline) {
    return (
      <button
        onClick={() => onCopy(cmd)}
        className="inline-flex items-center gap-1 bg-slate-950 rounded px-1.5 py-0.5 border border-slate-800 text-purple-300 text-xs hover:border-purple-600 transition-colors"
      >
        <code>{displayCmd}</code>
        {isCopied ? <CheckCheck size={11} className="text-emerald-400" /> : <Copy size={11} />}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-slate-950 rounded px-2 py-1.5 border border-slate-800">
      <code className="flex-1 text-purple-300 text-xs truncate">{displayCmd}</code>
      <button
        onClick={() => onCopy(cmd)}
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        title="Copy command"
      >
        {isCopied ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>
    </div>
  )
}

function formatModelSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`
  return `${bytes} B`
}
