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
} from 'lucide-react'
import { ollamaAPI, OllamaModel, OllamaConnectionResult } from '../lib/ollama-api'

interface OllamaSettingsProps {
  onModelSelect?: (modelName: string) => void
  selectedModel?: string
}

export default function OllamaSettings({ onModelSelect, selectedModel }: OllamaSettingsProps) {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [connectionResult, setConnectionResult] = useState<OllamaConnectionResult | null>(null)
  const [models, setModels] = useState<OllamaModel[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [showCORSFix, setShowCORSFix] = useState(false)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  useEffect(() => {
    const savedUrl = localStorage.getItem('ollama_base_url')
    if (savedUrl) setOllamaUrl(savedUrl)
    // Auto-check on mount
    handleCheck(savedUrl || 'http://localhost:11434')
  }, [])

  const handleCheck = useCallback(async (urlOverride?: string) => {
    const url = urlOverride ?? ollamaUrl
    ollamaAPI.setBaseUrl(url)
    setIsChecking(true)
    setConnectionResult(null)

    const result = await ollamaAPI.checkConnectivityDetailed()
    setConnectionResult(result)

    if (result.connected && result.models) {
      setModels(result.models)
    } else {
      // Try to get cached models even on failure
      const cached = ollamaAPI.getCachedModels()
      if (cached.length > 0) setModels(cached)
    }

    // Show CORS fix automatically if CORS issue detected
    if (result.corsIssue) setShowCORSFix(true)

    setIsChecking(false)
  }, [ollamaUrl])

  const handleUrlChange = (newUrl: string) => {
    setOllamaUrl(newUrl)
    ollamaAPI.setBaseUrl(newUrl)
  }

  const copyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopiedCommand(cmd)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch {
      // Fallback for non-secure contexts
    }
  }

  const isConnected = connectionResult?.connected === true
  const hasCORSIssue = connectionResult?.corsIssue === true

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Ollama Server URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ollamaUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="http://localhost:11434"
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
      </div>

      {/* Connection Status */}
      {connectionResult && (
        <div
          className={`rounded-lg p-3 border text-sm ${
            isConnected
              ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300'
              : hasCORSIssue
              ? 'bg-amber-950/50 border-amber-700/50 text-amber-300'
              : 'bg-red-950/50 border-red-700/50 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi size={15} className="text-emerald-400 flex-shrink-0" />
            ) : hasCORSIssue ? (
              <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            ) : (
              <WifiOff size={15} className="text-red-400 flex-shrink-0" />
            )}
            <span className="font-medium">
              {isConnected
                ? `Connected — Ollama ${connectionResult.version ?? ''}`
                : hasCORSIssue
                ? 'Ollama is running but CORS is blocking the connection'
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

      {/* CORS Fix Panel */}
      {(hasCORSIssue || !isConnected) && (
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
  const sizeLabel = ollamaAPI.constructor
    ? (OllamaAPI_formatModelSize(model.size))
    : ''

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
              <span>{OllamaAPI_formatModelSize(model.size)}</span>
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
}: {
  cmd: string
  copiedCommand: string | null
  onCopy: (cmd: string) => void
}) {
  const isCopied = copiedCommand === cmd
  const displayCmd = cmd.split('\n')[0] + (cmd.includes('\n') ? ' …' : '')

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

// Helper since we can't call static method via instance easily in JSX
function OllamaAPI_formatModelSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`
  return `${bytes} B`
}
