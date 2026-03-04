import { ModelCapability, MODEL_DATABASE, CognitiveMode } from './models-database'

export interface IntentAnalysis {
  primaryIntent: string
  secondaryIntents: string[]
  suggestedModel: ModelCapability
  alternateModels: ModelCapability[]
  orchestrationPipeline?: ModelCapability[]
  recommendedMode: CognitiveMode | null
  confidence: number
  reasoning: string
}

export interface UserContext {
  recentQueries?: string[]
  selectedMode?: CognitiveMode
  preferences?: {
    prioritizeSpeed?: boolean
    prioritizeAccuracy?: boolean
    prioritizeCost?: boolean
  }
}

const INTENT_KEYWORDS = {
  reasoning: [
    'prove', 'logic', 'formal', 'theorem', 'proof', 'deduce', 'infer',
    'reasoning', 'think', 'analyze', 'complex', 'strategy', 'design',
    'architecture', 'system', 'framework', 'model', 'theory'
  ],
  coding: [
    'code', 'program', 'function', 'debug', 'refactor', 'test', 'build',
    'implement', 'script', 'algorithm', 'data structure', 'optimize',
    'performance', 'architecture', 'design pattern'
  ],
  research: [
    'research', 'fact', 'check', 'verify', 'source', 'citation', 'evidence',
    'study', 'paper', 'current', 'recent', 'news', 'web', 'search',
    'information', 'data', 'statistics'
  ],
  creative: [
    'story', 'character', 'creative', 'write', 'imagine', 'generate',
    'fiction', 'narrative', 'world', 'build', 'describe', 'scene',
    'dialogue', 'plot', 'worldbuilding'
  ],
  vision: [
    'image', 'photo', 'picture', 'visual', 'see', 'look', 'describe',
    'analyze image', 'object', 'detect', 'recognize', 'ocr', 'text',
    'ui', 'design', 'screenshot'
  ],
  fast: [
    'quick', 'fast', 'simple', 'brief', 'quick answer', 'fast response',
    'lightweight', 'simple task', 'easy'
  ]
}

export class IntentRouter {
  private modelDatabase: Record<string, ModelCapability>
  
  constructor() {
    this.modelDatabase = MODEL_DATABASE
  }

  analyzeIntent(userInput: string, context?: UserContext): IntentAnalysis {
    const inputLower = userInput.toLowerCase()
    const words = inputLower.split(/\s+/)
    
    const intentScores = {
      reasoning: this.scoreIntent(words, INTENT_KEYWORDS.reasoning),
      coding: this.scoreIntent(words, INTENT_KEYWORDS.coding),
      research: this.scoreIntent(words, INTENT_KEYWORDS.research),
      creative: this.scoreIntent(words, INTENT_KEYWORDS.creative),
      vision: this.scoreIntent(words, INTENT_KEYWORDS.vision),
      fast: this.scoreIntent(words, INTENT_KEYWORDS.fast),
    }

    const sortedIntents = Object.entries(intentScores)
      .sort(([, a], [, b]) => b - a)

    const primaryIntent = sortedIntents[0][0]
    const secondaryIntents = sortedIntents
      .slice(1, 3)
      .filter(([, score]) => score > 0)
      .map(([intent]) => intent)

    const suggestedModel = this.getModelForIntent(primaryIntent, context)
    const alternateModels = this.getAlternateModels(primaryIntent, suggestedModel)
    const orchestrationPipeline = this.shouldOrchestrate(primaryIntent, userInput)
      ? this.getOrchestrationPipeline(primaryIntent)
      : undefined

    const recommendedMode = this.getRecommendedMode(primaryIntent, context)
    const confidence = Math.min(1, sortedIntents[0][1] / 5)

    return {
      primaryIntent,
      secondaryIntents,
      suggestedModel,
      alternateModels,
      orchestrationPipeline,
      recommendedMode,
      confidence,
      reasoning: this.generateReasoning(primaryIntent, suggestedModel, confidence)
    }
  }

  private scoreIntent(words: string[], keywords: string[]): number {
    let score = 0
    for (const word of words) {
      for (const keyword of keywords) {
        if (word.includes(keyword) || keyword.includes(word)) {
          score += 1
        }
      }
    }
    return score
  }

  private getModelForIntent(intent: string, context?: UserContext): ModelCapability {
    if (context?.selectedMode) {
      const modeModels = Object.values(this.modelDatabase)
        .filter(m => m.bestModes.includes(context.selectedMode!))
      
      if (modeModels.length > 0) {
        return modeModels[0]
      }
    }

    const intentModelMap: Record<string, string> = {
      reasoning: 'gpt-o3',
      coding: 'deepseek-2-5',
      research: 'perplexity-sonar-web',
      creative: 'mythomax',
      vision: 'gpt-4-vision',
      fast: 'gpt-4o-mini'
    }

    const modelId = intentModelMap[intent] || 'vella'
    return this.modelDatabase[modelId] || this.modelDatabase['vella']
  }

  private getAlternateModels(intent: string, primary: ModelCapability): ModelCapability[] {
    const category = primary.category
    const alternates = Object.values(this.modelDatabase)
      .filter(m => m.category === category && m.id !== primary.id)
      .sort((a, b) => {
        if (intent === 'reasoning') return b.reasoning - a.reasoning
        if (intent === 'coding') return b.speed - a.speed
        if (intent === 'research') return b.accuracy - a.accuracy
        if (intent === 'creative') return b.creativity - a.creativity
        if (intent === 'vision') return b.accuracy - a.accuracy
        return b.speed - a.speed
      })
      .slice(0, 2)

    return alternates
  }

  private shouldOrchestrate(intent: string, userInput: string): boolean {
    if (intent === 'reasoning') {
      const complexKeywords = [
        'design', 'strategy', 'architecture', 'system', 'framework',
        'complex', 'comprehensive', 'thorough', 'analyze from'
      ]
      return complexKeywords.some(kw => userInput.toLowerCase().includes(kw))
    }
    return false
  }

  private getOrchestrationPipeline(intent: string): ModelCapability[] {
    if (intent === 'reasoning') {
      return [
        this.modelDatabase['gpt-o3'],
        this.modelDatabase['claude-opus'],
        this.modelDatabase['gemini-2-5-pro'],
      ]
    }
    return []
  }

  private getRecommendedMode(intent: string, context?: UserContext): CognitiveMode | null {
    const intentModeMap: Record<string, CognitiveMode> = {
      reasoning: 'architect',
      coding: 'engineer',
      research: 'researcher',
      creative: 'philosopher',
      vision: 'architect',
      fast: 'engineer'
    }

    return intentModeMap[intent] || null
  }

  private generateReasoning(intent: string, model: ModelCapability, confidence: number): string {
    const confidenceText = confidence > 0.8 ? 'highly confident' : 
                          confidence > 0.5 ? 'reasonably confident' : 
                          'somewhat confident'

    const intentDescriptions: Record<string, string> = {
      reasoning: 'deep logical reasoning and complex analysis',
      coding: 'code generation and technical implementation',
      research: 'web research and information gathering',
      creative: 'creative writing and character development',
      vision: 'image analysis and visual understanding',
      fast: 'quick responses and simple tasks'
    }

    return `I'm ${confidenceText} this is a ${intentDescriptions[intent]} task. ${model.name} is optimized for this.`
  }
}

export const intentRouter = new IntentRouter()
