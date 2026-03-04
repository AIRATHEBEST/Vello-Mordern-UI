/**
 * Advanced Intent Router
 * Analyzes user prompts and automatically selects the best capability and provider
 */

export interface IntentAnalysis {
  capability: string
  confidence: number
  provider: string
  requiresFiles: boolean
  fileTypes: string[]
  systemPrompt: string
  description: string
}

class AdvancedIntentRouter {
  private intentPatterns = {
    autonomous_execution: {
      keywords: [
        'execute',
        'run',
        'automate',
        'workflow',
        'pipeline',
        'process',
        'task',
        'schedule',
      ],
      patterns: [/execute.*task/i, /run.*workflow/i, /automate/i],
    },
    text_generation: {
      keywords: [
        'write',
        'generate',
        'create',
        'compose',
        'article',
        'blog',
        'essay',
        'report',
        'document',
      ],
      patterns: [/write.*article/i, /generate.*text/i, /compose/i],
    },
    code_execution: {
      keywords: [
        'code',
        'python',
        'javascript',
        'typescript',
        'function',
        'script',
        'program',
        'debug',
      ],
      patterns: [/write.*code/i, /generate.*python/i, /debug/i],
    },
    data_handling: {
      keywords: [
        'data',
        'analyze',
        'csv',
        'json',
        'excel',
        'dataset',
        'statistics',
        'process',
      ],
      patterns: [/analyze.*data/i, /process.*csv/i, /data.*analysis/i],
    },
    web_automation: {
      keywords: [
        'browse',
        'scrape',
        'extract',
        'website',
        'web',
        'url',
        'fetch',
        'crawl',
      ],
      patterns: [/browse.*website/i, /scrape/i, /extract.*web/i],
    },
    ai_reasoning: {
      keywords: [
        'reason',
        'analyze',
        'think',
        'problem',
        'solve',
        'logic',
        'explain',
        'understand',
      ],
      patterns: [/reason.*through/i, /analyze.*problem/i, /explain/i],
    },
    multimodal: {
      keywords: ['image', 'photo', 'screenshot', 'visual', 'diagram', 'picture', 'video'],
      patterns: [/analyze.*image/i, /extract.*screenshot/i, /visual/i],
    },
    haptics: {
      keywords: ['gesture', 'hand', 'motion', 'haptic', 'vr', 'ar', 'touch', 'finger'],
      patterns: [/track.*hand/i, /gesture/i, /haptic/i],
    },
    workflow_automation: {
      keywords: [
        'workflow',
        'automate',
        'integration',
        'api',
        'connect',
        'sync',
        'trigger',
      ],
      patterns: [/automate.*workflow/i, /integrate.*api/i],
    },
    memory_personalization: {
      keywords: [
        'remember',
        'preference',
        'save',
        'profile',
        'personalize',
        'customize',
        'settings',
      ],
      patterns: [/remember/i, /save.*preference/i, /personalize/i],
    },
    deliverables: {
      keywords: [
        'generate',
        'export',
        'download',
        'create',
        'build',
        'component',
        'output',
      ],
      patterns: [/generate.*component/i, /create.*deliverable/i],
    },
    collaboration: {
      keywords: [
        'team',
        'share',
        'workspace',
        'collaborate',
        'member',
        'permission',
        'access',
      ],
      patterns: [/create.*workspace/i, /share.*team/i, /collaborate/i],
    },
  }

  private providerSelectionRules = {
    multimodal: ['openai', 'anthropic', 'gemini'],
    reasoning: ['openai', 'anthropic'],
    code: ['openai', 'anthropic'],
    default: ['ollama', 'openai', 'anthropic'],
  }

  /**
   * Analyze user intent and select capability
   */
  analyzeIntent(prompt: string, attachedFileTypes: string[] = []): IntentAnalysis {
    let bestCapability = 'autonomous_execution'
    let highestConfidence = 0

    // Score each capability
    for (const [capability, patterns] of Object.entries(this.intentPatterns)) {
      const score = this.scoreCapability(prompt, patterns)
      if (score > highestConfidence) {
        highestConfidence = score
        bestCapability = capability
      }
    }

    // Boost score if files are attached
    if (attachedFileTypes.length > 0) {
      if (attachedFileTypes.some((t) => t === 'image')) {
        if (highestConfidence < 0.8) {
          bestCapability = 'multimodal'
          highestConfidence = 0.85
        }
      }
      if (attachedFileTypes.some((t) => t === 'data')) {
        if (highestConfidence < 0.7) {
          bestCapability = 'data_handling'
          highestConfidence = 0.8
        }
      }
      if (attachedFileTypes.some((t) => t === 'code')) {
        if (highestConfidence < 0.8) {
          bestCapability = 'code_execution'
          highestConfidence = 0.85
        }
      }
    }

    // Determine required provider
    const provider = this.selectProvider(bestCapability)

    // Determine if files are needed
    const requiresFiles = this.checkIfFilesNeeded(prompt, bestCapability)
    const fileTypes = this.getRequiredFileTypes(bestCapability)

    // Generate system prompt for the capability
    const systemPrompt = this.generateSystemPrompt(bestCapability)

    return {
      capability: bestCapability,
      confidence: Math.min(highestConfidence, 1),
      provider,
      requiresFiles,
      fileTypes,
      systemPrompt,
      description: `Using ${bestCapability} with ${provider} provider`,
    }
  }

  /**
   * Score a capability based on prompt keywords and patterns
   */
  private scoreCapability(
    prompt: string,
    patterns: { keywords: string[]; patterns: RegExp[] }
  ): number {
    let score = 0

    // Check keywords
    const lowerPrompt = prompt.toLowerCase()
    const keywordMatches = patterns.keywords.filter((k) => lowerPrompt.includes(k))
    score += keywordMatches.length * 0.1

    // Check regex patterns
    const patternMatches = patterns.patterns.filter((p) => p.test(prompt))
    score += patternMatches.length * 0.3

    return Math.min(score, 1)
  }

  /**
   * Select the best provider for a capability
   */
  private selectProvider(capability: string): string {
    const rules = this.providerSelectionRules as Record<string, string[]>

    if (capability.includes('multimodal') || capability.includes('vision')) {
      return rules.multimodal[0]
    }
    if (capability.includes('reasoning') || capability.includes('analyze')) {
      return rules.reasoning[0]
    }
    if (capability.includes('code')) {
      return rules.code[0]
    }

    return 'ollama' // Default to Ollama
  }

  /**
   * Check if files are needed for this capability
   */
  private checkIfFilesNeeded(prompt: string, capability: string): boolean {
    const fileKeywords = ['file', 'upload', 'attach', 'image', 'document', 'data']
    const needsFiles =
      fileKeywords.some((k) => prompt.toLowerCase().includes(k)) ||
      capability === 'multimodal' ||
      capability === 'data_handling'

    return needsFiles
  }

  /**
   * Get required file types for a capability
   */
  private getRequiredFileTypes(capability: string): string[] {
    const fileTypeMap: Record<string, string[]> = {
      multimodal: ['image'],
      data_handling: ['data', 'document'],
      code_execution: ['code'],
      web_automation: ['document'],
      default: ['image', 'document', 'data', 'code'],
    }

    return fileTypeMap[capability] || fileTypeMap.default
  }

  /**
   * Generate a system prompt for the selected capability
   */
  private generateSystemPrompt(capability: string): string {
    const prompts: Record<string, string> = {
      autonomous_execution:
        'You are an autonomous task execution agent. Break down tasks into steps and execute them systematically.',
      text_generation:
        'You are a professional content writer. Generate high-quality, well-structured content.',
      code_execution:
        'You are an expert programmer. Write clean, efficient, well-documented code.',
      data_handling:
        'You are a data analyst. Analyze data thoroughly and provide actionable insights.',
      web_automation:
        'You are a web automation expert. Extract and process web data accurately.',
      ai_reasoning:
        'You are a logical reasoning expert. Analyze problems step-by-step with clear reasoning.',
      multimodal:
        'You are a multimodal AI. Analyze images, text, and other media to provide comprehensive insights.',
      haptics:
        'You are a haptic feedback specialist. Track motion and provide appropriate feedback.',
      workflow_automation:
        'You are a workflow automation expert. Design and execute efficient workflows.',
      memory_personalization:
        'You are a personalization expert. Remember and apply user preferences.',
      deliverables:
        'You are a software engineer. Generate production-ready code and deliverables.',
      collaboration:
        'You are a collaboration facilitator. Manage team workspaces and permissions.',
    }

    return prompts[capability] || prompts.autonomous_execution
  }

  /**
   * Get capability description
   */
  getCapabilityDescription(capability: string): string {
    const descriptions: Record<string, string> = {
      autonomous_execution: 'Execute tasks independently from start to finish',
      text_generation: 'Generate essays, articles, scripts, and reports',
      code_execution: 'Write, debug, and execute code',
      data_handling: 'Process and analyze datasets',
      web_automation: 'Browse websites and extract information',
      ai_reasoning: 'Solve complex problems with reasoning',
      multimodal: 'Analyze images and visual data',
      haptics: 'Track hand motion and haptic feedback',
      workflow_automation: 'Automate business workflows',
      memory_personalization: 'Remember preferences and personalize',
      deliverables: 'Generate code, docs, and reports',
      collaboration: 'Create shared workspaces',
    }

    return descriptions[capability] || 'Unknown capability'
  }
}

export const advancedIntentRouter = new AdvancedIntentRouter()
