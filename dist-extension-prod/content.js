// Vello AI Intelligence OS Content Script - Production
// Injects overlay into Vello.ai with real API integration

(function() {
  // Only run on vello.ai
  if (!window.location.hostname.includes('vello.ai')) {
    return;
  }

  console.log('🚀 Vello AI Intelligence OS initialized');

  // Create container for overlay
  const container = document.createElement('div');
  container.id = 'vello-ai-overlay-root';
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-left: 1px solid #334155;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow-y: auto;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
  `;

  document.body.appendChild(container);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #vello-ai-overlay-root * {
      box-sizing: border-box;
    }
    
    #vello-ai-overlay-root {
      scrollbar-width: thin;
      scrollbar-color: #475569 #1e293b;
    }
    
    #vello-ai-overlay-root::-webkit-scrollbar {
      width: 8px;
    }
    
    #vello-ai-overlay-root::-webkit-scrollbar-track {
      background: #1e293b;
    }
    
    #vello-ai-overlay-root::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 4px;
    }
    
    #vello-ai-overlay-root::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  `;
  document.head.appendChild(style);

  // Load overlay app
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('scripts/overlay.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PAGE_INFO') {
      sendResponse({
        url: window.location.href,
        title: document.title,
        selectedText: window.getSelection().toString(),
      });
    }
  });

  console.log('✅ Vello AI Intelligence OS overlay ready');
})();
