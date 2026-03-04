# Vello AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Use Vello Cloud (Easiest)

1. **Open the App**
   - Visit: https://vello-mordern-ui.vercel.app

2. **Get API Key**
   - Sign up at https://vello.ai
   - Get your API key from settings

3. **Configure**
   - Click ⚙️ (bottom-right)
   - Select "Vello.ai" provider
   - Paste your API key
   - Click "Check Status"

4. **Start Chatting**
   - Select a model from the sidebar
   - Type your message
   - Press Enter

---

### Option 2: Use Ollama Local (Free & Private)

1. **Install Ollama**
   ```bash
   # Download from ollama.ai
   # Run installer
   ```

2. **Start Ollama**
   ```bash
   ollama serve
   ```

3. **Download a Model**
   ```bash
   # In a new terminal
   ollama pull llama2
   ```

4. **Open Vello App**
   - Visit: https://vello-mordern-ui.vercel.app

5. **Configure**
   - Click ⚙️ (bottom-right)
   - Select "Ollama Local" provider
   - URL: `http://localhost:11434`
   - Click "Check Status"

6. **Start Chatting**
   - Select a model
   - Type your message
   - Press Enter

---

### Option 3: Use Chrome Extension

1. **Build Extension**
   ```bash
   cd /home/ubuntu/Vello-Mordern-UI
   npm run build
   ```

2. **Load in Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `dist` folder
   - Extension appears in toolbar

3. **Configure**
   - Click extension icon (🤖)
   - Click ⚙️
   - Choose provider (Vello or Ollama)
   - Enter settings

4. **Use Anywhere**
   - Click extension icon to chat
   - Right-click text → "Ask Vello AI"
   - Press Ctrl+Shift+V to toggle overlay

---

## 📋 Feature Checklist

### ✅ Supported Features

- [x] **Natural Language Chat** - Talk to AI like a person
- [x] **Code Generation** - Write code in any language
- [x] **Content Creation** - Write blogs, emails, stories
- [x] **Data Analysis** - Analyze and visualize data
- [x] **Web Research** - Get information on any topic
- [x] **Multi-turn Conversations** - Context-aware responses
- [x] **Real-time Streaming** - See responses as they're generated
- [x] **Multiple Models** - Choose from different AI models
- [x] **Ollama Integration** - Run models locally
- [x] **Chrome Extension** - Use on any website
- [x] **Settings Management** - Configure API keys and URLs
- [x] **Dark Mode** - Beautiful dark interface

---

## 🧪 Quick Tests

### Test 1: Simple Question
```
You: "What is the capital of France?"
Expected: "The capital of France is Paris."
```

### Test 2: Code Generation
```
You: "Write a Python function to reverse a string"
Expected: Function code with explanation
```

### Test 3: Creative Writing
```
You: "Write a haiku about AI"
Expected: 5-7-5 syllable poem
```

### Test 4: Multi-turn Conversation
```
You: "What is machine learning?"
AI: Explains machine learning
You: "Give me an example"
AI: Provides example (should reference previous message)
```

---

## ⚙️ Configuration

### Vello.ai Provider
```
API Key: Get from https://vello.ai/api
Provider: Vello.ai
Models: GPT-4, Claude, Gemini, etc.
Cost: Depends on usage
```

### Ollama Provider
```
URL: http://localhost:11434
Provider: Ollama Local
Models: Llama2, Mistral, Neural Chat, etc.
Cost: Free (runs on your PC)
```

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle Vello overlay |
| `Ctrl+Shift+C` | Quick chat |
| `Enter` | Send message |
| `Escape` | Close overlay |

---

## 🐛 Troubleshooting

### "Models not loading"
- **Vello**: Check API key and internet
- **Ollama**: Ensure `ollama serve` is running

### "Response takes too long"
- Use smaller models (orca-mini, neural-chat)
- Close other applications
- Increase RAM

### "Extension not working"
- Rebuild: `npm run build`
- Reload extension in `chrome://extensions/`
- Check console for errors

---

## 📚 Learn More

- **Full Setup Guide**: See `OLLAMA_CHROME_SETUP.md`
- **API Documentation**: See `README.md`
- **GitHub**: https://github.com/AIRATHEBEST/Vello-Mordern-UI

---

## 🎯 Next Steps

1. ✅ Choose your provider (Vello or Ollama)
2. ✅ Configure API key or Ollama URL
3. ✅ Select a model
4. ✅ Send your first message
5. ✅ Test all features
6. ✅ Install Chrome extension
7. ✅ Share with others!

---

**Happy chatting! 🚀**
