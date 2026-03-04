/**
 * Chrome Extension Content Script
 * Injects Vello AI interface into web pages
 */

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleVello') {
    toggleVelloOverlay()
    sendResponse({ success: true })
  }

  if (request.action === 'quickChat') {
    showQuickChat(request.selectedText)
    sendResponse({ success: true })
  }
})

// Create and manage Vello overlay
function toggleVelloOverlay() {
  let overlay = document.getElementById('vello-ai-overlay')

  if (overlay) {
    overlay.remove()
  } else {
    createVelloOverlay()
  }
}

function createVelloOverlay() {
  // Create container
  const container = document.createElement('div')
  container.id = 'vello-ai-overlay'
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    background: linear-gradient(to bottom right, #0f172a, #0f172a);
    border: 1px solid #334155;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    color: #e2e8f0;
  `

  // Create header
  const header = document.createElement('div')
  header.style.cssText = `
    background: linear-gradient(to right, #2563eb, #9333ea);
    padding: 16px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `
  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🤖</span>
      <span style="font-weight: bold;">Vello AI</span>
    </div>
    <button id="vello-close" style="
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      padding: 0;
    ">×</button>
  `

  // Create messages area
  const messagesArea = document.createElement('div')
  messagesArea.id = 'vello-messages'
  messagesArea.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 480px;
  `

  // Create input area
  const inputArea = document.createElement('div')
  inputArea.style.cssText = `
    padding: 12px;
    border-top: 1px solid #334155;
    display: flex;
    gap: 8px;
  `

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Ask Vello AI...'
  input.style.cssText = `
    flex: 1;
    padding: 8px 12px;
    background: #1e293b;
    border: 1px solid #475569;
    border-radius: 6px;
    color: white;
    font-size: 14px;
  `

  const sendBtn = document.createElement('button')
  sendBtn.innerHTML = '→'
  sendBtn.style.cssText = `
    padding: 8px 12px;
    background: #2563eb;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: bold;
  `

  // Assemble overlay
  container.appendChild(header)
  container.appendChild(messagesArea)
  inputArea.appendChild(input)
  inputArea.appendChild(sendBtn)
  container.appendChild(inputArea)

  // Add to page
  document.body.appendChild(container)

  // Add event listeners
  document.getElementById('vello-close')?.addEventListener('click', () => {
    container.remove()
  })

  sendBtn.addEventListener('click', () => {
    const message = input.value.trim()
    if (message) {
      addMessage(message, 'user')
      input.value = ''
      simulateResponse(message)
    }
  })

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click()
    }
  })
}

function addMessage(text: string, role: 'user' | 'assistant') {
  const messagesArea = document.getElementById('vello-messages')
  if (!messagesArea) return

  const messageEl = document.createElement('div')
  messageEl.style.cssText = `
    padding: 8px 12px;
    border-radius: 8px;
    max-width: 80%;
    word-wrap: break-word;
    ${
      role === 'user'
        ? 'background: #2563eb; color: white; align-self: flex-end;'
        : 'background: #334155; color: #e2e8f0; align-self: flex-start;'
    }
  `
  messageEl.textContent = text
  messagesArea.appendChild(messageEl)
  messagesArea.scrollTop = messagesArea.scrollHeight
}

function simulateResponse(userMessage: string) {
  // Simulate AI response
  const responses = [
    'I can help you with that! What specific information do you need?',
    'That\'s an interesting question. Let me think about it...',
    'I\'m here to assist. Can you provide more details?',
    'Great question! Here\'s what I think...',
  ]

  setTimeout(() => {
    const response = responses[Math.floor(Math.random() * responses.length)]
    addMessage(response, 'assistant')
  }, 500)
}

function showQuickChat(selectedText: string) {
  toggleVelloOverlay()
  const input = document.querySelector('#vello-ai-overlay input') as HTMLInputElement
  if (input && selectedText) {
    input.value = `Explain: ${selectedText}`
    input.focus()
  }
}

// Inject styles
const style = document.createElement('style')
style.textContent = `
  #vello-ai-overlay {
    display: flex;
    flex-direction: column;
  }

  #vello-messages {
    display: flex;
    flex-direction: column;
  }

  #vello-ai-overlay input:focus {
    outline: none;
    border-color: #2563eb;
  }

  #vello-ai-overlay button:hover {
    opacity: 0.9;
  }
`
document.head.appendChild(style)

// Log that content script is loaded
console.log('Vello AI Chrome Extension loaded')
