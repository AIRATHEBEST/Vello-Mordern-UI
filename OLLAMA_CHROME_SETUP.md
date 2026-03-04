# Vello AI - Ollama & Chrome Extension Setup Guide

## Overview

This guide covers:
1. **Ollama Integration** - Run local LLMs on your PC
2. **Chrome Extension** - Use Vello AI on any website
3. **Testing & Verification** - Ensure everything works correctly

---

## Part 1: Ollama Setup

### Prerequisites
- Windows, macOS, or Linux
- At least 8GB RAM (16GB recommended)
- ~20GB disk space for models

### Installation Steps

#### Step 1: Install Ollama
1. Download Ollama from [ollama.ai](https://ollama.ai)
2. Run the installer and follow the setup wizard
3. Restart your computer

#### Step 2: Start Ollama Server
```bash
# On Windows (Command Prompt or PowerShell)
ollama serve

# On macOS/Linux (Terminal)
ollama serve
```

You should see:
```
Listening on 127.0.0.1:11434
```

#### Step 3: Pull Models
Open a new terminal and download models:

```bash
# Download Llama 2 (7B - ~4GB)
ollama pull llama2

# Download Mistral (7B - ~4GB)
ollama pull mistral

# Download Neural Chat (7B - ~4GB)
ollama pull neural-chat

# Download Orca Mini (3B - ~2GB, fastest)
ollama pull orca-mini

# Download CodeLlama (7B - ~4GB, for coding)
ollama pull codellama
```

#### Step 4: Verify Installation
```bash
# List installed models
ollama list

# Test a model
ollama run llama2 "Hello, what is your name?"
```

---

## Part 2: Chrome Extension Setup

### Installation Steps

#### Step 1: Build the Extension
```bash
cd /home/ubuntu/Vello-Mordern-UI
npm run build
```

#### Step 2: Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Navigate to `/home/ubuntu/Vello-Mordern-UI/dist` and select it
5. The extension should now appear in your extensions list

#### Step 3: Configure Extension
1. Click the Vello AI extension icon (🤖)
2. Click the ⚙️ settings button
3. Choose API Provider:
   - **Vello**: For cloud-based models (requires API key)
   - **Ollama**: For local models (requires Ollama running)
4. If using Ollama, ensure URL is `http://localhost:11434`

---

## Part 3: Testing & Verification

### Test 1: Verify Ollama Connection

#### In the Vello App:
1. Open [https://vello-mordern-ui.vercel.app](https://vello-mordern-ui.vercel.app)
2. Click the ⚙️ settings button (bottom-right)
3. Select **Ollama Local** as provider
4. Enter Ollama URL: `http://localhost:11434`
5. Click **Check Status**
6. You should see: ✅ Connected with available models count

#### Expected Output:
```
Status: Connected
Models available: 5
```

### Test 2: Send a Message with Ollama

1. In the Vello app, select a model from the sidebar
2. Type a message in the input field
3. Press Enter or click Send
4. Wait for response (first response may take 10-30 seconds as model loads)

#### Test Prompts:
- "What is machine learning?"
- "Write a Python function to calculate factorial"
- "Explain quantum computing in simple terms"
- "Create a haiku about artificial intelligence"

### Test 3: Chrome Extension Popup

1. Click the Vello AI extension icon
2. Select a model from the dropdown
3. Type a message and send
4. Verify response appears in chat

### Test 4: Content Script (Overlay)

1. Visit any website (e.g., Google, Wikipedia)
2. Use keyboard shortcut: **Ctrl+Shift+V** (Windows) or **Cmd+Shift+V** (Mac)
3. A Vello AI chat box should appear in the bottom-right
4. Type a message and verify it works

### Test 5: Context Menu

1. Select any text on a webpage
2. Right-click and choose **"Ask Vello AI"**
3. The extension popup should open with the selected text

---

## Part 4: Real Data Testing

### Feature 1: Natural Language Conversation
**Test**: Multi-turn conversation with context retention

```
User: "What is the capital of France?"
Expected: "The capital of France is Paris."

Follow-up: "What is its population?"
Expected: Should reference Paris from previous message
```

### Feature 2: Code Generation
**Test**: Generate and explain code

```
Prompt: "Write a Python function to reverse a string"
Expected: 
```python
def reverse_string(s):
    return s[::-1]
```
```

### Feature 3: Content Creation
**Test**: Generate blog post content

```
Prompt: "Write a short blog post about AI in healthcare"
Expected: Well-structured blog post with introduction, body, and conclusion
```

### Feature 4: Data Analysis
**Test**: Analyze and summarize data

```
Prompt: "Analyze this data: [1, 2, 3, 4, 5] and tell me the average"
Expected: "The average of [1, 2, 3, 4, 5] is 3"
```

### Feature 5: Web Research Simulation
**Test**: Answer questions requiring knowledge

```
Prompt: "What are the latest AI trends in 2024?"
Expected: Detailed response about current AI developments
```

---

## Part 5: Troubleshooting

### Issue: "Ollama Connection Failed"
**Solution**:
1. Ensure Ollama is running: `ollama serve`
2. Check URL is correct: `http://localhost:11434`
3. Try in browser: `http://localhost:11434/api/tags`
4. If using remote Ollama, use its IP: `http://192.168.x.x:11434`

### Issue: "No Models Available"
**Solution**:
1. Pull models: `ollama pull llama2`
2. Verify: `ollama list`
3. Restart Ollama server

### Issue: "Response Takes Too Long"
**Solution**:
1. Use smaller models (orca-mini, neural-chat)
2. Increase RAM allocation
3. Close other applications
4. Check CPU usage: models run on CPU by default

### Issue: "Chrome Extension Not Loading"
**Solution**:
1. Ensure `dist` folder exists: `npm run build`
2. Check manifest.json is valid
3. Reload extension: Click refresh icon on extension
4. Clear cache: Ctrl+Shift+Delete

### Issue: "API Key Not Working"
**Solution**:
1. Get key from [vello.ai/api](https://vello.ai/api)
2. Paste in settings (without spaces)
3. Click "Check Status"
4. Try sending a message

---

## Part 6: Performance Optimization

### For Faster Responses:
1. Use smaller models:
   - `orca-mini` (3B) - Fastest
   - `neural-chat` (7B) - Balanced
   - `mistral` (7B) - Good quality

2. Reduce context:
   - Clear chat history between tests
   - Use shorter prompts

3. System optimization:
   - Close unnecessary applications
   - Increase RAM allocation to Ollama
   - Use GPU acceleration (if available)

### Model Comparison:

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| orca-mini | 3GB | ⚡⚡⚡ | ⭐⭐ | Quick responses |
| neural-chat | 4GB | ⚡⚡ | ⭐⭐⭐ | Balanced |
| mistral | 4GB | ⚡⚡ | ⭐⭐⭐ | General purpose |
| llama2 | 4GB | ⚡ | ⭐⭐⭐⭐ | Quality responses |
| codellama | 4GB | ⚡ | ⭐⭐⭐⭐ | Code generation |

---

## Part 7: Advanced Configuration

### Custom Ollama Server (Remote)
If running Ollama on a different machine:

```javascript
// In extension settings, use:
http://192.168.1.100:11434
// Replace with your server's IP
```

### Environment Variables
Create `.env.local` in project root:
```env
VITE_OLLAMA_URL=http://localhost:11434
VITE_VELLO_API_KEY=your_api_key_here
```

### API Provider Switching
The app supports switching between providers:
1. **Vello.ai**: Cloud-based, requires API key
2. **Ollama**: Local, free, no API key needed
3. **Custom**: Add your own provider in `src/lib/api-provider.ts`

---

## Part 8: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+V | Toggle Vello AI overlay |
| Ctrl+Shift+C | Quick chat |
| Enter | Send message |
| Escape | Close overlay |

---

## Part 9: API Integration Examples

### Using Ollama API Directly
```javascript
// Send message to Ollama
const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama2',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: false
  })
})

const data = await response.json()
console.log(data.message.content)
```

### Using Vello API
```javascript
// Send message to Vello
const response = await fetch('https://vello.ai/api/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'gpt-o3',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
})

const data = await response.json()
console.log(data.choices[0].message.content)
```

---

## Part 10: Deployment

### Deploy to Production
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Or push to GitHub and enable auto-deploy
git push origin main
```

### Package Extension for Distribution
```bash
# Create extension package
zip -r vello-extension.zip dist/

# Upload to Chrome Web Store
# https://chrome.google.com/webstore/developer/dashboard
```

---

## Support & Resources

- **Ollama Docs**: https://github.com/ollama/ollama
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Vello.ai**: https://vello.ai
- **GitHub**: https://github.com/AIRATHEBEST/Vello-Mordern-UI

---

## Verification Checklist

- [ ] Ollama installed and running
- [ ] At least one model pulled (`ollama list` shows models)
- [ ] Chrome extension loaded in developer mode
- [ ] Extension popup opens and shows models
- [ ] Can send message and receive response
- [ ] Overlay works with keyboard shortcut
- [ ] Context menu "Ask Vello AI" works
- [ ] All 5 feature tests pass
- [ ] No mock data in responses
- [ ] Real API responses are being used

---

## Next Steps

1. **Test all features** using the testing guide above
2. **Customize the extension** - Add your branding
3. **Deploy to production** - Use Vercel or your own server
4. **Publish to Chrome Web Store** - Make it available to users
5. **Monitor usage** - Track analytics and user feedback

---

**Last Updated**: March 4, 2026
**Version**: 1.0.0
