import { create } from 'zustand'
import { ModelCapability, CognitiveMode, MODEL_DATABASE, COGNITIVE_MODES } from '../lib/models-database'
import { IntentAnalysis } from '../lib/intent-router'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    mode?: CognitiveMode
    tokens?: number
  }
}

export interface OverlayState {
  // Current selections
  selectedModel: ModelCapability | null
  selectedMode: CognitiveMode | null
  selectedCategory: string | null
  
  // UI state
  isOrchestrating: boolean
  isComparing: boolean
  showAdvancedTools: boolean
  sidebarOpen: boolean
  
  // Intent analysis
  lastIntent: IntentAnalysis | null
  
  // Tool-specific state
  reasoningDepth: 'shallow' | 'medium' | 'deep'
  creativeTone: number // 0-100
  codeEditorContent: string
  
  // Session data
  conversationHistory: Message[]
  
  // Settings
  preferences: {
    prioritizeSpeed: boolean
    prioritizeAccuracy: boolean
    prioritizeCost: boolean
    autoDetectIntent: boolean
    showMetrics: boolean
  }
  
  // Actions
  setSelectedModel: (model: ModelCapability | null) => void
  setSelectedMode: (mode: CognitiveMode | null) => void
  setSelectedCategory: (category: string | null) => void
  setOrchestrating: (value: boolean) => void
  setComparing: (value: boolean) => void
  setShowAdvancedTools: (value: boolean) => void
  setSidebarOpen: (value: boolean) => void
  setLastIntent: (intent: IntentAnalysis | null) => void
  setReasoningDepth: (depth: 'shallow' | 'medium' | 'deep') => void
  setCreativeTone: (tone: number) => void
  setCodeEditorContent: (content: string) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  updatePreference: (key: keyof OverlayState['preferences'], value: any) => void
}

export const useOverlayStore = create<OverlayState>((set) => ({
  // Initial state
  selectedModel: Object.values(MODEL_DATABASE)[0],
  selectedMode: null,
  selectedCategory: 'deep-reasoning',
  isOrchestrating: false,
  isComparing: false,
  showAdvancedTools: false,
  sidebarOpen: true,
  lastIntent: null,
  reasoningDepth: 'medium',
  creativeTone: 50,
  codeEditorContent: '',
  conversationHistory: [],
  preferences: {
    prioritizeSpeed: false,
    prioritizeAccuracy: true,
    prioritizeCost: false,
    autoDetectIntent: true,
    showMetrics: true,
  },

  // Actions
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setOrchestrating: (value) => set({ isOrchestrating: value }),
  setComparing: (value) => set({ isComparing: value }),
  setShowAdvancedTools: (value) => set({ showAdvancedTools: value }),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setLastIntent: (intent) => set({ lastIntent: intent }),
  setReasoningDepth: (depth) => set({ reasoningDepth: depth }),
  setCreativeTone: (tone) => set({ creativeTone: Math.max(0, Math.min(100, tone)) }),
  setCodeEditorContent: (content) => set({ codeEditorContent: content }),
  
  addMessage: (message) => set((state) => ({
    conversationHistory: [
      ...state.conversationHistory,
      {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date(),
      },
    ],
  })),
  
  clearHistory: () => set({ conversationHistory: [] }),
  
  updatePreference: (key, value) => set((state) => ({
    preferences: {
      ...state.preferences,
      [key]: value,
    },
  })),
}))
