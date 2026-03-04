# Vello AI - VS Code Integration Guide

## Overview

This guide explains how to integrate Vello AI with your VS Code environment for a seamless coding experience.

---

## Part 1: VS Code Integration

### Option 1: Webview Integration (Recommended)
You can run Vello AI directly inside a VS Code webview panel.

#### Step 1: Install "Vello AI" VS Code Extension (Manual)
1. Open VS Code and go to the Extensions view (Ctrl+Shift+X)
2. Search for "Vello AI" (if published) or use the manual installation below.

#### Step 2: Manual Installation (Development)
1. Clone the Vello repository to your local machine:
   ```bash
   git clone https://github.com/AIRATHEBEST/Vello-Mordern-UI.git
   ```
2. Open the project in VS Code
3. Install the "Vello AI Integration" extension from the local extension folder (provided in the repo).

---

## Part 2: Feature Support

### 1. Code Injection
Vello AI can now inject code directly into your active VS Code editor.
- **How to use**: Click the "Apply to Editor" button next to any code block in the Vello chat.
- **Requirement**: Vello must be running inside a VS Code webview or connected via the bridge.

### 2. Context Awareness
Vello AI can read your current file context to provide better suggestions.
- **How to use**: Right-click any file in VS Code and select "Analyze with Vello AI".

---

## Part 3: Fixing Ollama Connection

If your Ollama is running but Vello says "Disconnected", it's almost certainly a **CORS (Cross-Origin Resource Sharing)** issue.

### The Fix: Set OLLAMA_ORIGINS

#### On Windows (PowerShell):
```powershell
# 1. Close Ollama (Right-click icon in tray -> Quit)
# 2. Set the environment variable
[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')
# 3. Restart Ollama from the Start Menu
```

#### On macOS:
```bash
# 1. Close Ollama
# 2. Run in Terminal:
launchctl setenv OLLAMA_ORIGINS "*"
# 3. Restart Ollama
```

#### On Linux (systemd):
```bash
# 1. Edit the service
sudo systemctl edit ollama.service
# 2. Add under [Service]:
# Environment="OLLAMA_ORIGINS=*"
# 3. Reload and restart:
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

---

## Part 4: Manus AI Integration

Vello now supports the **Manus AI API** (OpenAI-compatible).

1. Open **API Settings** (⚙️ icon bottom-right)
2. Select **Manus** as the provider
3. Enter your **Manus API Key**
4. Click **Check Status**

---

## Part 5: Feature Verification

| Feature | Status | Verification |
|---------|--------|--------------|
| Manus API | ✅ Ready | Integrated with OpenAI-compatible endpoint |
| Ollama Fix | ✅ Ready | CORS instructions added to UI |
| VS Code | ✅ Ready | Bridge module added for webview |
| Real Data | ✅ Ready | Mocks removed, real fetch calls only |

---

**Last Updated**: March 4, 2026
**Version**: 1.1.0
