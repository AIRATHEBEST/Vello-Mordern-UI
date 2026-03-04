import { ModelCapability } from '../lib/models-database'
import ReasoningInterface from './interfaces/ReasoningInterface'
import CodingInterface from './interfaces/CodingInterface'
import ResearchInterface from './interfaces/ResearchInterface'
import CreativeInterface from './interfaces/CreativeInterface'
import VisionInterface from './interfaces/VisionInterface'
import FastInterface from './interfaces/FastInterface'

interface SpecializedInterfaceProps {
  model: ModelCapability
}

export default function SpecializedInterface({ model }: SpecializedInterfaceProps) {
  switch (model.category) {
    case 'deep-reasoning':
      return <ReasoningInterface model={model} />
    case 'coding-technical':
      return <CodingInterface model={model} />
    case 'web-research':
      return <ResearchInterface model={model} />
    case 'creative-character':
      return <CreativeInterface model={model} />
    case 'vision-analysis':
      return <VisionInterface model={model} />
    case 'fast-lightweight':
      return <FastInterface model={model} />
    default:
      return <FastInterface model={model} />
  }
}
