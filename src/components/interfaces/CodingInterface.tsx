import { ModelCapability } from '../../lib/models-database'
import { Code2, Terminal, FileTree } from 'lucide-react'

interface CodingInterfaceProps {
  model: ModelCapability
}

export default function CodingInterface({ model }: CodingInterfaceProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-gradient mb-2">{model.name}</h2>
        <p className="text-slate-400">{model.description}</p>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left panel - Chat */}
        <div className="flex-1 flex flex-col border-r border-slate-800">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center text-slate-500 mt-20">
              <Code2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Coding interface coming soon</p>
            </div>
          </div>
          <div className="p-4 border-t border-slate-800">
            <textarea
              placeholder="Describe your coding task..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Right panel - Code editor */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
            <Code2 size={18} className="text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Code Editor</span>
          </div>
          <div className="flex-1 overflow-auto">
            <pre className="p-4 text-slate-400 text-sm font-mono">
{`// Your code will appear here
function example() {
  return "Ready to code!";
}`}
            </pre>
          </div>
        </div>

        {/* Right panel - Terminal */}
        <div className="w-64 flex flex-col border-l border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
            <Terminal size={18} className="text-green-400" />
            <span className="text-sm font-medium text-slate-300">Terminal</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm text-slate-400">
            <div>$ Ready for input...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
