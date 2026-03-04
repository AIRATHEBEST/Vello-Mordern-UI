/**
 * Chrome Extension Popup Script
 */

const modelSelect = document.getElementById('modelSelect')
const messageInput = document.getElementById('messageInput')
const sendBtn = document.getElementById('sendBtn')
const messagesDiv = document.getElementById('messages')
const settingsBtn = document.getElementById('settingsBtn')
const settingsPanel = document.getElementById('settingsPanel')
const ollamaSettings = document.getElementById('ollamaSettings')
const ollamaUrlInput = document.getElementById('ollamaUrl')

let currentProvider = 'vello'
let messages = []

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSettings()
  loadModels()
  setupEventListeners()
})

function setupEventListeners() {
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('show')
  })

  document.querySelectorAll('[data-provider]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const provider = e.target.dataset.provider
      setProvider(provider)
    })
  })

  ollamaUrlInput.addEventListener('change', (e) => {
    chrome.storage.local.set({ ollamaUrl: e.target.value })
  })

  sendBtn.addEventListener('click', sendMessage)
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
  })

  modelSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      messageInput.disabled = false
      sendBtn.disabled = false
    }
  })
}

function loadSettings() {
  chrome.storage.local.get(['apiProvider', 'ollamaUrl'], (result) => {
    currentProvider = result.apiProvider || 'vello'
    const url = result.ollamaUrl || 'http://localhost:11434'
    ollamaUrlInput.value = url

    // Update UI
    document.querySelectorAll('[data-provider]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.provider === currentProvider)
    })

    ollamaSettings.style.display = currentProvider === 'ollama' ? 'block' : 'none'
  })
}

function setProvider(provider) {
  currentProvider = provider
  chrome.storage.local.set({ apiProvider: provider })

  document.querySelectorAll('[data-provider]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === provider)
  })

  ollamaSettings.style.display = provider === 'ollama' ? 'block' : 'none'
  messages = []
  messagesDiv.innerHTML = ''
  modelSelect.value = ''
  messageInput.disabled = true
  sendBtn.disabled = true

  loadModels()
}

async function loadModels() {
  modelSelect.innerHTML = '<option value="">Loading models...</option>'

  try {
    if (currentProvider === 'ollama') {
      const url = ollamaUrlInput.value || 'http://localhost:11434'
      const response = await fetch(`${url}/api/tags`)
      const data = await response.json()

      modelSelect.innerHTML = '<option value="">Select a model...</option>'
      if (data.models && data.models.length > 0) {
        data.models.forEach(model => {
          const option = document.createElement('option')
          option.value = model.name
          option.textContent = model.name
          modelSelect.appendChild(option)
        })
      } else {
        modelSelect.innerHTML = '<option value="">No models available</option>'
      }
    } else {
      // Vello models
      const models = [
        { id: 'gpt-o3', name: 'GPT o3 (OpenAI)' },
        { id: 'claude-opus', name: 'Claude Opus (Anthropic)' },
        { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro (Google)' },
        { id: 'deepseek-2-5', name: 'DeepSeek 2.5' },
        { id: 'gpt-4o-mini', name: 'GPT 4o Mini (OpenAI)' },
      ]

      modelSelect.innerHTML = '<option value="">Select a model...</option>'
      models.forEach(model => {
        const option = document.createElement('option')
        option.value = model.id
        option.textContent = model.name
        modelSelect.appendChild(option)
      })
    }
  } catch (error) {
    console.error('Error loading models:', error)
    modelSelect.innerHTML = '<option value="">Error loading models</option>'
  }
}

async function sendMessage() {
  const message = messageInput.value.trim()
  const model = modelSelect.value

  if (!message || !model) return

  // Add user message
  addMessage(message, 'user')
  messageInput.value = ''
  sendBtn.disabled = true

  try {
    // Get API key if Vello
    let apiKey = ''
    if (currentProvider === 'vello') {
      const result = await chrome.storage.local.get('velloApiKey')
      apiKey = result.velloApiKey || ''
    }

    // Send to API
    const url =
      currentProvider === 'ollama'
        ? ollamaUrlInput.value || 'http://localhost:11434'
        : 'https://vello.ai/api'

    const endpoint = currentProvider === 'ollama' ? '/api/chat' : '/chat/completions'
    const body =
      currentProvider === 'ollama'
        ? {
            model,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            stream: false,
          }
        : {
            model,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
          }

    const response = await fetch(`${url}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(currentProvider === 'vello' && apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    const assistantMessage =
      currentProvider === 'ollama' ? data.message.content : data.choices[0].message.content

    addMessage(assistantMessage, 'assistant')
  } catch (error) {
    console.error('Error sending message:', error)
    addMessage(`Error: ${error.message}`, 'assistant')
  } finally {
    sendBtn.disabled = false
    messageInput.focus()
  }
}

function addMessage(text, role) {
  messages.push({ role, content: text })

  const messageEl = document.createElement('div')
  messageEl.className = `message ${role}`
  messageEl.textContent = text
  messagesDiv.appendChild(messageEl)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}
