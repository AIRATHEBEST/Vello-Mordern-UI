import { ModelCapability, MODEL_DATABASE } from './models-database'

export interface OrchestrationStep {
  modelId: string
  model: ModelCapability
  role: string
  prompt: string
  expectedOutput: string
  dependsOn?: number[]
}

export interface OrchestrationPipeline {
  id: string
  name: string
  description: string
  steps: OrchestrationStep[]
  totalEstimatedTime: number
  totalEstimatedCost: number
}

export class OrchestrationEngine {
  /**
   * Create a reasoning pipeline for complex problems
   */
  createReasoningPipeline(problem: string): OrchestrationPipeline {
    return {
      id: 'reasoning-pipeline',
      name: 'Deep Reasoning Pipeline',
      description: 'Multi-step reasoning with verification and synthesis',
      steps: [
        {
          modelId: 'gpt-o3',
          model: MODEL_DATABASE['gpt-o3'],
          role: 'Primary Reasoner',
          prompt: `Analyze this problem deeply and provide step-by-step reasoning:\n\n${problem}`,
          expectedOutput: 'Detailed reasoning with assumptions and logical steps',
        },
        {
          modelId: 'claude-opus',
          model: MODEL_DATABASE['claude-opus'],
          role: 'Assumption Validator',
          prompt: `Review the reasoning above and identify any hidden assumptions or logical gaps. Challenge the reasoning.`,
          expectedOutput: 'List of assumptions and potential weaknesses',
          dependsOn: [0],
        },
        {
          modelId: 'gemini-2-5-pro',
          model: MODEL_DATABASE['gemini-2-5-pro'],
          role: 'Alternative Perspective',
          prompt: `Provide a completely different approach or perspective to solve this problem.`,
          expectedOutput: 'Alternative solution or viewpoint',
          dependsOn: [0],
        },
        {
          modelId: 'gpt-4o-mini',
          model: MODEL_DATABASE['gpt-4o-mini'],
          role: 'Synthesizer',
          prompt: `Synthesize the above reasoning approaches into a comprehensive solution.`,
          expectedOutput: 'Unified solution combining all perspectives',
          dependsOn: [0, 1, 2],
        },
      ],
      totalEstimatedTime: 180, // seconds
      totalEstimatedCost: 1.30,
    }
  }

  /**
   * Create a coding pipeline for complex implementations
   */
  createCodingPipeline(requirement: string): OrchestrationPipeline {
    return {
      id: 'coding-pipeline',
      name: 'Code Generation & Review Pipeline',
      description: 'Generate, review, and optimize code',
      steps: [
        {
          modelId: 'deepseek-2-5',
          model: MODEL_DATABASE['deepseek-2-5'],
          role: 'Code Generator',
          prompt: `Generate production-ready code for:\n\n${requirement}`,
          expectedOutput: 'Complete, working code implementation',
        },
        {
          modelId: 'gpt-5-1',
          model: MODEL_DATABASE['gpt-4o-mini'],
          role: 'Code Reviewer',
          prompt: `Review the generated code for quality, security, and best practices. Suggest improvements.`,
          expectedOutput: 'Code review with suggestions',
          dependsOn: [0],
        },
        {
          modelId: 'gpt-4o-mini',
          model: MODEL_DATABASE['gpt-4o-mini'],
          role: 'Optimizer',
          prompt: `Optimize the code for performance and readability.`,
          expectedOutput: 'Optimized code version',
          dependsOn: [0, 1],
        },
      ],
      totalEstimatedTime: 90,
      totalEstimatedCost: 0.50,
    }
  }

  /**
   * Create a research pipeline for comprehensive analysis
   */
  createResearchPipeline(topic: string): OrchestrationPipeline {
    return {
      id: 'research-pipeline',
      name: 'Comprehensive Research Pipeline',
      description: 'Multi-source research with fact-checking',
      steps: [
        {
          modelId: 'perplexity-sonar-web',
          model: MODEL_DATABASE['perplexity-sonar-web'],
          role: 'Web Researcher',
          prompt: `Research the following topic comprehensively with citations:\n\n${topic}`,
          expectedOutput: 'Researched findings with sources',
        },
        {
          modelId: 'gpt-4o-mini',
          model: MODEL_DATABASE['gpt-4o-mini'],
          role: 'Fact Checker',
          prompt: `Verify the facts and identify any contradictions or unsupported claims.`,
          expectedOutput: 'Fact-check report',
          dependsOn: [0],
        },
        {
          modelId: 'claude-opus',
          model: MODEL_DATABASE['claude-opus'],
          role: 'Synthesizer',
          prompt: `Synthesize all research into a comprehensive report with clear conclusions.`,
          expectedOutput: 'Final research report',
          dependsOn: [0, 1],
        },
      ],
      totalEstimatedTime: 120,
      totalEstimatedCost: 0.75,
    }
  }

  /**
   * Create a creative pipeline for story generation
   */
  createCreativePipeline(prompt: string): OrchestrationPipeline {
    return {
      id: 'creative-pipeline',
      name: 'Creative Generation Pipeline',
      description: 'Multi-perspective creative generation',
      steps: [
        {
          modelId: 'mythomax',
          model: MODEL_DATABASE['mythomax'],
          role: 'Creative Generator',
          prompt: `Generate creative content:\n\n${prompt}`,
          expectedOutput: 'Initial creative work',
        },
        {
          modelId: 'claude-opus',
          model: MODEL_DATABASE['claude-opus'],
          role: 'Refiner',
          prompt: `Refine and improve the creative work while maintaining the original vision.`,
          expectedOutput: 'Refined version',
          dependsOn: [0],
        },
        {
          modelId: 'gpt-4o-mini',
          model: MODEL_DATABASE['gpt-4o-mini'],
          role: 'Enhancer',
          prompt: `Add depth, nuance, and polish to make it exceptional.`,
          expectedOutput: 'Enhanced final version',
          dependsOn: [0, 1],
        },
      ],
      totalEstimatedTime: 60,
      totalEstimatedCost: 0.30,
    }
  }

  /**
   * Get recommended pipeline for a task
   */
  getPipelineForTask(taskType: string, input: string): OrchestrationPipeline | null {
    switch (taskType) {
      case 'reasoning':
        return this.createReasoningPipeline(input)
      case 'coding':
        return this.createCodingPipeline(input)
      case 'research':
        return this.createResearchPipeline(input)
      case 'creative':
        return this.createCreativePipeline(input)
      default:
        return null
    }
  }

  /**
   * Format pipeline for display
   */
  formatPipelineForDisplay(pipeline: OrchestrationPipeline): string {
    let output = `${pipeline.name}\n`
    output += `${pipeline.description}\n\n`
    output += `Steps:\n`

    pipeline.steps.forEach((step, index) => {
      output += `${index + 1}. ${step.role} (${step.model.name})\n`
      if (step.dependsOn) {
        output += `   Depends on: Step ${step.dependsOn.map(i => i + 1).join(', ')}\n`
      }
    })

    output += `\nEstimated Time: ${pipeline.totalEstimatedTime}s\n`
    output += `Estimated Cost: $${pipeline.totalEstimatedCost.toFixed(2)}\n`

    return output
  }
}

export const orchestrationEngine = new OrchestrationEngine()
