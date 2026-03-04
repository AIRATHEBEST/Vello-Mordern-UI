/**
 * VELLO OVERLAY - Model Classification & Capability Database
 */

export type ModelCategory = 
  | 'deep-reasoning'
  | 'coding-technical'
  | 'web-research'
  | 'creative-character'
  | 'vision-analysis'
  | 'fast-lightweight'
  | 'balanced-general';

export type CognitiveMode = 
  | 'architect'
  | 'lawyer'
  | 'investor'
  | 'researcher'
  | 'engineer'
  | 'systems-thinker'
  | 'philosopher';

export interface ModelCapability {
  id: string
  name: string
  provider: string
  category: ModelCategory
  tier: 'free' | 'pro' | 'enterprise'
  strengths: string[]
  weaknesses: string[]
  idealFor: string[]
  speed: number
  reasoning: number
  creativity: number
  accuracy: number
  contextWindow: number
  costPerMillion: number
  hasVision: boolean
  hasWebBrowsing: boolean
  hasCodeExecution: boolean
  hasImageGeneration: boolean
  enabledTools: string[]
  bestModes: CognitiveMode[]
  thinkingDepth?: 'shallow' | 'medium' | 'deep'
  description: string
}

export const MODEL_DATABASE: Record<string, ModelCapability> = {
  'gpt-o3': {
    id: 'gpt-o3',
    name: 'GPT o3',
    provider: 'OpenAI',
    category: 'deep-reasoning',
    tier: 'enterprise',
    strengths: ['Multi-step logical reasoning', 'Formal proofs', 'Mathematical problem solving', 'Strategy systems design', 'Complex constraint satisfaction'],
    weaknesses: ['Speed', 'Cost', 'Real-time information'],
    idealFor: ['Formal proofs', 'Multi-step logic', 'Strategy systems', 'Scientific modeling', 'Legal reasoning', 'Architecture design'],
    speed: 3,
    reasoning: 10,
    creativity: 7,
    accuracy: 10,
    contextWindow: 128000,
    costPerMillion: 15,
    hasVision: false,
    hasWebBrowsing: false,
    hasCodeExecution: false,
    hasImageGeneration: false,
    enabledTools: ['thinking-depth-slider', 'tree-of-thought-view', 'expandable-reasoning-blocks', 'assumption-editor', 'constraint-panel', 'step-validation', 'proof-verification', 'symbolic-scratchpad'],
    bestModes: ['architect', 'lawyer', 'systems-thinker', 'philosopher'],
    thinkingDepth: 'deep',
    description: 'Latest OpenAI reasoning model designed to solve hard problems across domains with extended thinking'
  },
  'deepseek-2-5': {
    id: 'deepseek-2-5',
    name: 'DeepSeek 2.5',
    provider: 'DeepSeek',
    category: 'coding-technical',
    tier: 'pro',
    strengths: ['Code generation', 'Technical reasoning', 'Multi-language support', 'Cost-effective', 'Fast inference'],
    weaknesses: ['Reasoning depth', 'Creativity'],
    idealFor: ['Code generation', 'Technical implementation', 'Debugging', 'Code review', 'Multi-purpose coding'],
    speed: 8,
    reasoning: 7,
    creativity: 6,
    accuracy: 8,
    contextWindow: 128000,
    costPerMillion: 2,
    hasVision: false,
    hasWebBrowsing: false,
    hasCodeExecution: true,
    hasImageGeneration: false,
    enabledTools: ['code-editor', 'terminal', 'file-tree', 'run-tests', 'static-analysis', 'refactor-mode', 'architecture-mode', 'senior-engineer-toggle'],
    bestModes: ['engineer', 'architect'],
    description: 'Latest from DeepSeek combining chat and coder capabilities'
  },
  'perplexity-sonar-web': {
    id: 'perplexity-sonar-web',
    name: 'Perplexity Sonar Web',
    provider: 'Perplexity',
    category: 'web-research',
    tier: 'pro',
    strengths: ['Web search', 'Real-time information', 'Citation accuracy', 'Source verification', 'Current events'],
    weaknesses: ['Reasoning depth', 'Creativity'],
    idealFor: ['Research', 'Current events', 'Fact checking', 'Citation-based answers', 'Source verification'],
    speed: 7,
    reasoning: 6,
    creativity: 5,
    accuracy: 9,
    contextWindow: 128000,
    costPerMillion: 3,
    hasVision: false,
    hasWebBrowsing: true,
    hasCodeExecution: false,
    hasImageGeneration: false,
    enabledTools: ['citation-panel', 'timeline-view', 'source-credibility-meter', 'compare-sources-toggle', 'find-contradictions-mode'],
    bestModes: ['researcher', 'lawyer', 'investor'],
    description: 'Latest web connected model from Perplexity'
  },
  'mythomax': {
    id: 'mythomax',
    name: 'MythoMax',
    provider: 'Other',
    category: 'creative-character',
    tier: 'free',
    strengths: ['Character generation', 'Creative writing', 'Worldbuilding', 'Narrative design', 'Specialized tasks'],
    weaknesses: ['General reasoning', 'Technical tasks'],
    idealFor: ['Character generation', 'Creative writing', 'Worldbuilding', 'Story generation', 'Narrative design'],
    speed: 8,
    reasoning: 5,
    creativity: 10,
    accuracy: 7,
    contextWindow: 4096,
    costPerMillion: 0,
    hasVision: false,
    hasWebBrowsing: false,
    hasCodeExecution: false,
    hasImageGeneration: false,
    enabledTools: ['tone-slider', 'genre-dropdown', 'style-mimic-panel', 'character-memory-sheet', 'story-arc-visualizer', 'worldbuilding-database'],
    bestModes: ['philosopher'],
    description: 'MythoMax 13B - Specialized for character and creative generation'
  },
  'gpt-4-vision': {
    id: 'gpt-4-vision',
    name: 'GPT 4 Vision',
    provider: 'OpenAI',
    category: 'vision-analysis',
    tier: 'pro',
    strengths: ['Image understanding', 'Object detection', 'OCR', 'Image analysis', 'Visual reasoning'],
    weaknesses: ['Speed', 'Cost'],
    idealFor: ['Image analysis', 'Object detection', 'OCR', 'Visual reasoning', 'UI/UX analysis'],
    speed: 5,
    reasoning: 7,
    creativity: 6,
    accuracy: 9,
    contextWindow: 128000,
    costPerMillion: 5,
    hasVision: true,
    hasWebBrowsing: false,
    hasCodeExecution: false,
    hasImageGeneration: false,
    enabledTools: ['object-detection-overlay', 'bounding-box-viewer', 'ocr-extraction-tab', 'image-critique-mode', 'art-critic-toggle', 'ui-reverse-engineer-toggle'],
    bestModes: ['architect', 'researcher'],
    description: 'This model can see, understand, and describe what is in an image'
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT 4o Mini',
    provider: 'OpenAI',
    category: 'fast-lightweight',
    tier: 'free',
    strengths: ['Fast reasoning', 'Coding', 'Creativity', 'Cost-efficient', 'Balanced performance'],
    weaknesses: ['Deep reasoning', 'Complex logic'],
    idealFor: ['Coding tasks', 'Quick reasoning', 'Creative content', 'General tasks', 'Cost-sensitive work'],
    speed: 9,
    reasoning: 7,
    creativity: 8,
    accuracy: 8,
    contextWindow: 128000,
    costPerMillion: 0.15,
    hasVision: true,
    hasWebBrowsing: false,
    hasCodeExecution: true,
    hasImageGeneration: false,
    enabledTools: ['code-editor', 'terminal', 'quick-mode', 'brainstorm-burst-mode', 'rapid-compare-mode'],
    bestModes: ['engineer', 'researcher'],
    description: 'Best model for deeper reasoning, creativity, and challenging coding tasks, while remaining fast and cost-efficient'
  },
  'claude-opus': {
    id: 'claude-opus',
    name: 'Claude 4.5 Opus',
    provider: 'Anthropic',
    category: 'deep-reasoning',
    tier: 'enterprise',
    strengths: ['Deep reasoning', 'Complex analysis', 'Nuanced understanding', 'Long-form generation', 'Structured thinking'],
    weaknesses: ['Speed', 'Cost'],
    idealFor: ['Deep reasoning', 'Complex analysis', 'Legal reasoning', 'Strategic thinking', 'Research synthesis'],
    speed: 4,
    reasoning: 10,
    creativity: 8,
    accuracy: 10,
    contextWindow: 200000,
    costPerMillion: 8,
    hasVision: false,
    hasWebBrowsing: false,
    hasCodeExecution: false,
    hasImageGeneration: false,
    enabledTools: ['tree-of-thought-view', 'assumption-editor', 'constraint-panel', 'bias-detector', 'risk-modeling'],
    bestModes: ['lawyer', 'architect', 'systems-thinker', 'philosopher'],
    thinkingDepth: 'deep',
    description: 'Anthropic\'s newest premium model, best for deep reasoning tasks'
  },
  'gemini-2-5-pro': {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    category: 'coding-technical',
    tier: 'enterprise',
    strengths: ['Multimodal', 'Complex reasoning', 'Large context', 'Fast processing', 'Code generation'],
    weaknesses: ['Cost'],
    idealFor: ['Multimodal coding', 'Complex technical problems', 'Large document analysis', 'Code generation'],
    speed: 7,
    reasoning: 8,
    creativity: 7,
    accuracy: 8,
    contextWindow: 1000000,
    costPerMillion: 4,
    hasVision: true,
    hasWebBrowsing: false,
    hasCodeExecution: true,
    hasImageGeneration: false,
    enabledTools: ['code-editor', 'terminal', 'multimodal-input', 'large-context-handler'],
    bestModes: ['engineer', 'architect'],
    description: 'Latest Google Model - Multimodel, complex reasoning, large context, and fast'
  },
  'vella': {
    id: 'vella',
    name: 'Vella',
    provider: 'Vello',
    category: 'balanced-general',
    tier: 'pro',
    strengths: ['General purpose', 'Document analysis', 'Web search', 'Image generation', 'Code execution'],
    weaknesses: ['Specialized depth'],
    idealFor: ['General questions', 'Document analysis', 'Web research', 'Image generation', 'Code execution'],
    speed: 7,
    reasoning: 7,
    creativity: 7,
    accuracy: 8,
    contextWindow: 128000,
    costPerMillion: 3,
    hasVision: false,
    hasWebBrowsing: true,
    hasCodeExecution: true,
    hasImageGeneration: true,
    enabledTools: ['general-assistant-mode', 'quick-mode'],
    bestModes: [],
    description: 'General purpose friendly assistant provided by Vello'
  },
}

export const COGNITIVE_MODES: Record<CognitiveMode, {
  name: string
  description: string
  icon: string
  temperature: number
  systemPrompt: string
}> = {
  'architect': {
    name: 'Architect Mode',
    description: 'System design, architecture, and strategic planning',
    icon: '🏗️',
    temperature: 0.7,
    systemPrompt: `You are an expert system architect and strategic planner. Focus on high-level system design, scalability, reliability, trade-offs, and long-term vision. Always consider: performance, cost, maintainability, and future growth.`
  },
  'lawyer': {
    name: 'Lawyer Mode',
    description: 'Legal reasoning, contracts, and compliance',
    icon: '⚖️',
    temperature: 0.3,
    systemPrompt: `You are an expert legal advisor and contract specialist. Focus on legal precedents, contract analysis, risk identification, compliance, and liability. Always be precise, cite sources, and identify ambiguities.`
  },
  'investor': {
    name: 'Investor Mode',
    description: 'Business analysis, market research, and investment strategy',
    icon: '💰',
    temperature: 0.6,
    systemPrompt: `You are an expert investor and business analyst. Focus on market opportunity sizing, competitive analysis, financial modeling, and risk/reward assessment. Always think about: unit economics, TAM, CAC, LTV, and exit scenarios.`
  },
  'researcher': {
    name: 'Researcher Mode',
    description: 'Academic research, literature review, and evidence synthesis',
    icon: '🔬',
    temperature: 0.5,
    systemPrompt: `You are an expert researcher and academic analyst. Focus on literature review, evidence-based reasoning, methodology critique, and citation accuracy. Always cite sources, identify gaps, and note limitations.`
  },
  'engineer': {
    name: 'Engineer Mode',
    description: 'Technical implementation, debugging, and optimization',
    icon: '⚙️',
    temperature: 0.4,
    systemPrompt: `You are an expert software engineer and technical problem-solver. Focus on implementation details, code quality, performance optimization, debugging, and technical trade-offs. Always consider: readability, maintainability, testing, and deployment.`
  },
  'systems-thinker': {
    name: 'Systems Thinker Mode',
    description: 'Complex systems analysis, feedback loops, and emergent behavior',
    icon: '🌐',
    temperature: 0.7,
    systemPrompt: `You are an expert in systems thinking and complexity science. Focus on feedback loops, emergent behavior, system boundaries, leverage points, and long-term dynamics. Always map relationships, identify delays, and consider unintended consequences.`
  },
  'philosopher': {
    name: 'Philosopher Mode',
    description: 'Conceptual analysis, ethics, and fundamental principles',
    icon: '🧠',
    temperature: 0.8,
    systemPrompt: `You are an expert philosopher and conceptual analyst. Focus on first principles thinking, ethical implications, conceptual clarity, assumptions, and fundamental questions. Always question assumptions, explore multiple perspectives, and seek deeper meaning.`
  }
}

export function getModelsByCategory(category: ModelCategory): ModelCapability[] {
  return Object.values(MODEL_DATABASE).filter(m => m.category === category)
}

export function getModelsByMode(mode: CognitiveMode): ModelCapability[] {
  return Object.values(MODEL_DATABASE).filter(m => m.bestModes.includes(mode))
}
