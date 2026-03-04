import { ModelCapability } from '../../lib/models-database'
import { Globe, Link2, BarChart3 } from 'lucide-react'

export default function ResearchInterface({ model }: { model: ModelCapability }) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-gradient mb-2">{model.name}</h2>
        <p className="text-slate-400">{model.description}</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <Globe size={48} className="mx-auto mb-4 opacity-50" />
          <p>Research interface coming soon</p>
        </div>
      </div>
    </div>
  )
}
