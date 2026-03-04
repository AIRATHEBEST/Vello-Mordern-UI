/**
 * Chrome Extension Background Service Worker
 * Handles messaging, storage, and background tasks
 */

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open welcome page on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html'),
    })
  }
})

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getApiProvider') {
    chrome.storage.local.get('apiProvider', (result) => {
      sendResponse({ provider: result.apiProvider || 'vello' })
    })
    return true
  }

  if (request.action === 'setApiProvider') {
    chrome.storage.local.set({ apiProvider: request.provider }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  if (request.action === 'getOllamaUrl') {
    chrome.storage.local.get('ollamaUrl', (result) => {
      sendResponse({ url: result.ollamaUrl || 'http://localhost:11434' })
    })
    return true
  }

  if (request.action === 'setOllamaUrl') {
    chrome.storage.local.set({ ollamaUrl: request.url }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  if (request.action === 'getVelloApiKey') {
    chrome.storage.local.get('velloApiKey', (result) => {
      sendResponse({ key: result.velloApiKey || '' })
    })
    return true
  }

  if (request.action === 'setVelloApiKey') {
    chrome.storage.local.set({ velloApiKey: request.key }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  if (request.action === 'checkOllama') {
    const url = request.url || 'http://localhost:11434'
    fetch(`${url}/api/tags`)
      .then(response => {
        sendResponse({ connected: response.ok })
      })
      .catch(() => {
        sendResponse({ connected: false })
      })
    return true
  }
})

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-vello') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id || 0, {
          action: 'toggleVello',
        })
      }
    })
  }

  if (command === 'quick-chat') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id || 0, {
          action: 'quickChat',
        })
      }
    })
  }
})

// Handle context menu
chrome.contextMenus.create({
  id: 'vello-chat',
  title: 'Ask Vello AI',
  contexts: ['selection'],
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'vello-chat' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'quickChat',
      selectedText: info.selectionText,
    })
  }
})
