#!/bin/bash

# Build Vello AI Intelligence OS Browser Extension
# Supports Chrome, Firefox, and Edge

set -e

echo "🔨 Building Vello AI Intelligence OS Browser Extension..."

# Clean previous builds
rm -rf dist-extension

# Create extension directory structure
mkdir -p dist-extension/icons
mkdir -p dist-extension/scripts
mkdir -p dist-extension/styles

# Copy manifest
cp manifest.json dist-extension/

# Build the main app
npm run build

# Copy built files to extension
cp dist/index.html dist-extension/popup.html
cp dist/assets/* dist-extension/scripts/ 2>/dev/null || true
cp dist/assets/* dist-extension/styles/ 2>/dev/null || true

# Create content script
cat > dist-extension/content.js << 'EOF'
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
EOF

# Create background script
cat > dist-extension/background.js << 'EOF'
// Vello AI Intelligence OS Background Script

chrome.runtime.onInstalled.addListener(() => {
  console.log('Vello AI Intelligence OS installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_MODELS') {
    // Fetch models from Supabase
    fetch('https://oredszasbvkvejvbooki.supabase.co/rest/v1/models', {
      headers: {
        'apikey': 'your_anon_key',
        'Authorization': 'Bearer your_anon_key'
      }
    })
      .then(r => r.json())
      .then(data => sendResponse({ models: data }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
EOF

# Create popup HTML
cat > dist-extension/popup.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Vello AI Intelligence OS</title>
  <style>
    body {
      width: 400px;
      margin: 0;
      padding: 0;
      background: #0f172a;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #root {
      height: 600px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="scripts/popup.js"></script>
</body>
</html>
EOF

# Create icons (placeholder)
mkdir -p dist-extension/icons
for size in 16 48 128; do
  # Create a simple SVG icon
  cat > "dist-extension/icons/icon-$size.svg" << 'ICON'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#3b82f6"/>
  <text x="64" y="70" font-size="60" font-weight="bold" fill="white" text-anchor="middle">V</text>
</svg>
ICON
done

# Create README for extension
cat > dist-extension/README.md << 'EOF'
# Vello AI Intelligence OS Browser Extension

## Installation

### Chrome/Edge
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder

### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

## Features

- Intelligent AI model routing
- Specialized interfaces for different tasks
- Cognitive augmentation tools
- Multi-model orchestration

## Usage

Visit https://vello.ai/app and the extension will automatically inject the overlay.

## Development

```bash
npm run build:extension
```

## Publishing

### Chrome Web Store
1. Create developer account
2. Upload `dist-extension/` as ZIP
3. Add screenshots and description
4. Submit for review

### Firefox Add-ons
1. Create developer account
2. Upload `dist-extension/` as ZIP
3. Submit for review
EOF

echo "✅ Extension built successfully!"
echo "📁 Location: dist-extension/"
echo ""
echo "📦 To publish:"
echo "  - Chrome: Upload to Chrome Web Store"
echo "  - Firefox: Upload to Firefox Add-ons"
echo "  - Edge: Upload to Edge Add-ons"
echo ""
echo "🧪 To test locally:"
echo "  - Chrome: chrome://extensions → Load unpacked → select dist-extension/"
echo "  - Firefox: about:debugging → Load Temporary Add-on → select manifest.json"
