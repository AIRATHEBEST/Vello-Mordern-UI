// Vello AI Intelligence OS Content Script
// Injects overlay into Vello.ai

(function() {
  // Only run on vello.ai
  if (!window.location.hostname.includes('vello.ai')) {
    return;
  }

  // Create container for overlay
  const container = document.createElement('div');
  container.id = 'vello-ai-overlay-root';
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: #0f172a;
    border-left: 1px solid #1e293b;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow-y: auto;
  `;

  document.body.appendChild(container);

  // Load overlay app
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('scripts/overlay.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
})();
