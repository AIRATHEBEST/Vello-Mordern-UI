# Vello AI Intelligence Operating System - Deployment Guide

## Overview

The Vello AI Intelligence OS is a sophisticated overlay system that transforms Vello.ai into an AI Intelligence Operating System with intelligent model routing, specialized interfaces, and cognitive augmentation tools.

**Two Deployment Options:**
1. **Standalone Web App** - Use as a companion app alongside Vello.ai
2. **Browser Extension** - Overlay directly on Vello.ai interface

---

## Option 1: Standalone Web App

### Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev
# Opens at http://localhost:3001

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment to Vercel/Netlify

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "preview"]
```

---

## Option 2: Browser Extension

### Building the Extension

```bash
# Build extension
npm run build:extension

# Output: dist-extension/
```

### Installation (Chrome/Edge)

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist-extension/` folder
5. Extension appears in your toolbar

### Installation (Firefox)

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from `dist-extension/`
4. Extension is now active

### Publishing to Chrome Web Store

1. Create developer account at https://chrome.google.com/webstore/devconsole
2. Upload `dist-extension/` as ZIP
3. Add screenshots and description
4. Submit for review

---

## Architecture

### Core Components

```
vello-overlay-app/
├── src/
│   ├── lib/
│   │   ├── models-database.ts      # 30 AI models with capabilities
│   │   ├── intent-router.ts        # Intent detection & routing
│   │   └── orchestration-engine.ts # Multi-model pipelines
│   ├── store/
│   │   └── overlayStore.ts         # Zustand state management
│   ├── components/
│   │   ├── Header.tsx              # Intent detector & mode selector
│   │   ├── ModelSelector.tsx       # Model browser
│   │   ├── SpecializedInterface.tsx # Router to specialized UIs
│   │   ├── CognitiveTools.tsx      # Augmentation tools
│   │   └── interfaces/
│   │       ├── ReasoningInterface.tsx
│   │       ├── CodingInterface.tsx
│   │       ├── ResearchInterface.tsx
│   │       ├── CreativeInterface.tsx
│   │       ├── VisionInterface.tsx
│   │       └── FastInterface.tsx
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global styles
├── manifest.json                   # Extension manifest
├── index.html                      # HTML template
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind configuration
└── package.json                    # Dependencies
```

### State Management (Zustand)

```typescript
useOverlayStore() provides:
- selectedModel: Current AI model
- selectedMode: Cognitive mode (Architect, Engineer, etc.)
- lastIntent: Analyzed user intent
- conversationHistory: Chat messages
- preferences: User settings
```

### Intent Detection Flow

```
User Input
    ↓
IntentRouter.analyzeIntent()
    ↓
Score against 6 intent categories
    ↓
Suggest optimal model + confidence score
    ↓
Recommend cognitive mode
    ↓
Optionally suggest multi-model orchestration
```

---

## Features

### 1. Intelligent Model Routing

- Analyzes user intent from natural language
- Suggests optimal model with reasoning
- Provides alternate model suggestions
- Confidence scoring (0-1)

### 2. 30 AI Models Classified by True Capabilities

**Deep Reasoning:**
- GPT o3, Claude Opus, DeepSeek R1

**Coding & Technical:**
- DeepSeek 2.5, GPT 5/5.1, Gemini 2.5 Pro

**Web Research:**
- Perplexity Sonar Web, Vello Web

**Creative:**
- MythoMax, Nous Hermes

**Vision Analysis:**
- GPT 4 Vision, Gemini 2.5 Pro

**Fast & Lightweight:**
- GPT 4o Mini, Llama 3 Small

### 3. Specialized Interfaces

Each model category has a tailored UI:

- **🧠 Reasoning** - Thinking depth, tree of thought, assumptions, constraints
- **💻 Coding** - Monaco editor, terminal, file tree, refactor mode
- **🌐 Research** - Citations, sources, timeline, fact-checking
- **🎨 Creative** - Tone slider, genre, character sheets, story arc
- **👁 Vision** - Object detection, OCR, image critique
- **⚡ Fast** - Quick mode, brainstorm burst, rapid compare

### 4. Cognitive Augmentation Tools

- **Assumption Editor** - Identify and challenge assumptions
- **Bias Detector** - Detect cognitive biases
- **Constraint Panel** - Define problem constraints
- **Decision Tree** - Visualize decision paths
- **Proof Validator** - Verify logical proofs
- **Risk Modeler** - Identify and quantify risks
- **Scenario Planner** - Explore future scenarios
- **Synthesis Engine** - Combine multiple perspectives

### 5. Multi-Model Orchestration

Pre-built pipelines for complex tasks:

- **Reasoning Pipeline** - GPT o3 → Claude Opus → Gemini → Synthesis
- **Coding Pipeline** - DeepSeek → Review → Optimize
- **Research Pipeline** - Perplexity → Fact Check → Synthesize
- **Creative Pipeline** - MythoMax → Refine → Enhance

### 6. Cognitive Modes

7 specialized reasoning modes:

- **🏗️ Architect** - System design, strategic planning
- **⚖️ Lawyer** - Legal reasoning, contracts, compliance
- **💰 Investor** - Business analysis, market research
- **🔬 Researcher** - Academic research, evidence synthesis
- **⚙️ Engineer** - Technical implementation, optimization
- **🌐 Systems Thinker** - Complex systems, feedback loops
- **🧠 Philosopher** - Conceptual analysis, ethics, first principles

---

## Configuration

### Environment Variables

```env
# Optional: API endpoints
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id

# Extension-specific
VITE_EXTENSION_ID=your-extension-id
```

### Customization

**Theme Colors** - Edit `tailwind.config.ts`:
```typescript
colors: {
  'primary': '#3B82F6',
  'secondary': '#A855F7',
  'accent': '#06B6D4',
}
```

**Model Database** - Edit `src/lib/models-database.ts`:
```typescript
export const MODEL_DATABASE: Record<string, ModelCapability> = {
  'your-model': {
    // Model configuration
  }
}
```

**Intent Keywords** - Edit `src/lib/intent-router.ts`:
```typescript
const INTENT_KEYWORDS = {
  'your-intent': ['keyword1', 'keyword2'],
}
```

---

## Usage Examples

### Example 1: Reasoning Task

1. Type: "Prove that this algorithm is correct"
2. System detects: **Reasoning** intent
3. Suggests: **GPT o3** with **Architect** mode
4. Loads: **Reasoning Interface** with thinking depth slider
5. User sets depth to "Deep" for thorough analysis
6. System shows: Assumption editor, constraint panel, reasoning tree

### Example 2: Coding Task

1. Type: "Write a React component for a data table"
2. System detects: **Coding** intent
3. Suggests: **DeepSeek 2.5** with **Engineer** mode
4. Loads: **Coding Interface** with Monaco editor
5. User sees: Code generation, terminal, refactor options
6. Can run tests and optimize performance

### Example 3: Research Task

1. Type: "Research the latest AI trends in 2024"
2. System detects: **Research** intent
3. Suggests: **Perplexity Sonar Web** with **Researcher** mode
4. Loads: **Research Interface** with citations
5. System shows: Sources, timeline, fact-checking results
6. User can compare sources and find contradictions

### Example 4: Multi-Model Orchestration

1. Type: "Design a comprehensive system architecture for a distributed database"
2. System detects: **Reasoning** + **Complex** intent
3. Suggests: **Orchestration Pipeline**
4. Runs:
   - GPT o3: Initial architecture design
   - Claude Opus: Validate assumptions
   - Gemini: Alternative approaches
   - Synthesis: Final unified design
5. Displays: Merged output with source attribution

---

## Performance Optimization

### Code Splitting

The app uses dynamic imports for specialized interfaces:

```typescript
const ReasoningInterface = lazy(() => import('./interfaces/ReasoningInterface'))
```

### State Management

Zustand provides minimal re-renders:

```typescript
const { selectedModel } = useOverlayStore()
// Only re-renders when selectedModel changes
```

### CSS Optimization

Tailwind CSS with PurgeCSS removes unused styles in production.

---

## Troubleshooting

### Dev Server Not Starting

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Extension Not Loading

1. Check `manifest.json` is valid JSON
2. Ensure `dist-extension/` folder exists
3. Try incognito mode (Chrome)
4. Check browser console for errors

### Models Not Appearing

1. Verify `src/lib/models-database.ts` is loaded
2. Check Zustand store initialization
3. Inspect browser console for errors

---

## API Integration

To connect to real Vello.ai API:

```typescript
// src/lib/api.ts
export async function sendMessage(model: string, message: string) {
  const response = await fetch('https://vello.ai/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, message })
  })
  return response.json()
}
```

---

## Support & Contributing

For issues, feature requests, or contributions:

1. Check existing documentation
2. Review GitHub issues
3. Submit detailed bug reports
4. Include browser/OS information

---

## License

MIT License - Feel free to use, modify, and distribute.

---

## Roadmap

- [ ] Real-time API integration with Vello.ai
- [ ] Advanced visualization for reasoning trees
- [ ] Custom model training
- [ ] Collaborative features
- [ ] Mobile app version
- [ ] Voice input support
- [ ] Export to PDF/Markdown
- [ ] Model performance benchmarking
