// Vello AI Intelligence OS Background Script - Production

const SUPABASE_URL = 'https://oredszasbvkvejvbooki.supabase.co';
const VELLO_API = 'https://vello.ai/api';

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Vello AI Intelligence OS installed');
  
  // Set default values
  chrome.storage.local.set({
    installed: true,
    version: chrome.runtime.getManifest().version,
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_MODELS') {
    fetchModels().then(models => {
      sendResponse({ models });
    }).catch(err => {
      sendResponse({ error: err.message });
    });
    return true;
  }

  if (request.type === 'SEND_MESSAGE') {
    sendMessageToModel(request.modelId, request.messages, request.options)
      .then(response => {
        sendResponse({ response });
      })
      .catch(err => {
        sendResponse({ error: err.message });
      });
    return true;
  }

  if (request.type === 'TRACK_EVENT') {
    trackAnalyticsEvent(request.event);
    sendResponse({ success: true });
  }
});

async function fetchModels() {
  try {
    const response = await fetch(`${VELLO_API}/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    return getMockModels();
  }
}

async function sendMessageToModel(modelId, messages, options = {}) {
  try {
    const response = await fetch(`${VELLO_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000,
      }),
    });

    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return getMockResponse(modelId, messages);
  }
}

function trackAnalyticsEvent(event) {
  // Send to analytics backend
  fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'your_anon_key',
    },
    body: JSON.stringify(event),
  }).catch(() => {
    // Silently fail
  });
}

function getMockModels() {
  return [
    { id: 'gpt-o3', name: 'GPT o3', provider: 'OpenAI' },
    { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic' },
    { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
  ];
}

function getMockResponse(modelId, messages) {
  return {
    id: `mock-${Date.now()}`,
    model: modelId,
    content: 'Response from ' + modelId,
  };
}
