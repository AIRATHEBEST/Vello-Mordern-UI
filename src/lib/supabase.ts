import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://oredszasbvkvejvbooki.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_ANON_KEY) {
  console.warn('Supabase anon key not configured. Set VITE_SUPABASE_ANON_KEY environment variable.')
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Database types
export interface Model {
  id: string
  model_id: string
  name: string
  provider: string
  description: string
  category: string
  capabilities: Record<string, any>
  performance_metrics: Record<string, any>
  pricing: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  intent: string | null
  selected_model_id: string | null
  cognitive_mode: string | null
  messages: any[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_id: string | null
  metadata: Record<string, any>
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  default_model_id: string | null
  default_cognitive_mode: string | null
  theme: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface OrchestrationPipeline {
  id: string
  name: string
  description: string | null
  pipeline_type: string
  steps: any[]
  estimated_time: number | null
  estimated_cost: number | null
  created_at: string
  updated_at: string
}

export interface PipelineExecution {
  id: string
  conversation_id: string
  pipeline_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  results: Record<string, any>
  error_message: string | null
  execution_time: number | null
  created_at: string
  updated_at: string
}

export interface CognitiveToolsUsage {
  id: string
  conversation_id: string
  tool_name: string
  tool_config: Record<string, any>
  results: Record<string, any>
  created_at: string
}

// API functions
export const api = {
  // Models
  async getModels() {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('provider', { ascending: true })
    if (error) throw error
    return data as Model[]
  },

  async getModelById(modelId: string) {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('model_id', modelId)
      .single()
    if (error) throw error
    return data as Model
  },

  async getModelsByCategory(category: string) {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('category', category)
    if (error) throw error
    return data as Model[]
  },

  // Conversations
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Conversation[]
  },

  async getConversation(conversationId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()
    if (error) throw error
    return data as Conversation
  },

  async createConversation(userId: string, title: string, intent?: string, modelId?: string, mode?: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        intent,
        selected_model_id: modelId,
        cognitive_mode: mode,
        messages: [],
        metadata: {},
      })
      .select()
      .single()
    if (error) throw error
    return data as Conversation
  },

  async updateConversation(conversationId: string, updates: Partial<Conversation>) {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single()
    if (error) throw error
    return data as Conversation
  },

  async deleteConversation(conversationId: string) {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
    if (error) throw error
  },

  // Messages
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data as Message[]
  },

  async createMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string, modelId?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        model_id: modelId,
        metadata: {},
      })
      .select()
      .single()
    if (error) throw error
    return data as Message
  },

  // User Preferences
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data as UserPreferences | null
  },

  async createUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        ...preferences,
      })
      .select()
      .single()
    if (error) throw error
    return data as UserPreferences
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) throw error
    return data as UserPreferences
  },

  // Orchestration Pipelines
  async getPipelines() {
    const { data, error } = await supabase
      .from('orchestration_pipelines')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as OrchestrationPipeline[]
  },

  async getPipelinesByType(pipelineType: string) {
    const { data, error } = await supabase
      .from('orchestration_pipelines')
      .select('*')
      .eq('pipeline_type', pipelineType)
    if (error) throw error
    return data as OrchestrationPipeline[]
  },

  async createPipeline(pipeline: Omit<OrchestrationPipeline, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orchestration_pipelines')
      .insert(pipeline)
      .select()
      .single()
    if (error) throw error
    return data as OrchestrationPipeline
  },

  // Pipeline Executions
  async createPipelineExecution(conversationId: string, pipelineId: string) {
    const { data, error } = await supabase
      .from('pipeline_executions')
      .insert({
        conversation_id: conversationId,
        pipeline_id: pipelineId,
        status: 'pending',
        results: {},
      })
      .select()
      .single()
    if (error) throw error
    return data as PipelineExecution
  },

  async updatePipelineExecution(executionId: string, updates: Partial<PipelineExecution>) {
    const { data, error } = await supabase
      .from('pipeline_executions')
      .update(updates)
      .eq('id', executionId)
      .select()
      .single()
    if (error) throw error
    return data as PipelineExecution
  },

  async getPipelineExecutions(conversationId: string) {
    const { data, error } = await supabase
      .from('pipeline_executions')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as PipelineExecution[]
  },

  // Cognitive Tools Usage
  async createToolUsage(conversationId: string, toolName: string, config?: Record<string, any>) {
    const { data, error } = await supabase
      .from('cognitive_tools_usage')
      .insert({
        conversation_id: conversationId,
        tool_name: toolName,
        tool_config: config || {},
        results: {},
      })
      .select()
      .single()
    if (error) throw error
    return data as CognitiveToolsUsage
  },

  async updateToolUsage(toolUsageId: string, results: Record<string, any>) {
    const { data, error } = await supabase
      .from('cognitive_tools_usage')
      .update({ results })
      .eq('id', toolUsageId)
      .select()
      .single()
    if (error) throw error
    return data as CognitiveToolsUsage
  },

  async getToolUsage(conversationId: string) {
    const { data, error } = await supabase
      .from('cognitive_tools_usage')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as CognitiveToolsUsage[]
  },
}
