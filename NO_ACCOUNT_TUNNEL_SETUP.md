# Vello AI - No-Account Tunnel Setup (LocalTunnel / zrok)

This guide shows how to expose your local Ollama to the internet **without creating any accounts** using LocalTunnel or zrok.

## Why No-Account Tunnels?

- **100% Free Forever** — No signup, no tokens, no limits
- **One Command** — Just run a single command
- **No Browser Warnings** — Unlike ngrok, no interruptions
- **Works with Vello** — Automatically connects via our Vercel Edge Proxy

---

## Option 1: LocalTunnel (Recommended)

LocalTunnel is the easiest: no account, no config, just run one command.

### Setup:

1. **Install LocalTunnel** (one-time):
   ```bash
   npm install -g localtunnel
   ```

2. **Start your Ollama** (if not already running):
   ```bash
   ollama serve
   ```

3. **Run LocalTunnel** (in a new terminal):
   ```bash
   lt --port 11434
   ```

4. **Copy the URL** that appears (e.g., `https://abc123.loca.lt`)

5. **In Vello:**
   - Open [https://vello-mordern-ui.vercel.app](https://vello-mordern-ui.vercel.app)
   - Click ⚙️ → **Ollama Local** → **Tunnel**
   - Paste your LocalTunnel URL
   - Click **Connect**

Your models will appear instantly! ✓

---

## Option 2: zrok (Open Source Alternative)

zrok is completely open-source and requires no account.

### Setup:

1. **Install zrok**:
   - **macOS**: `brew install zrok`
   - **Windows**: Download from [zrok.io](https://zrok.io)
   - **Linux**: Download from [zrok.io](https://zrok.io)

2. **Start your Ollama** (if not already running):
   ```bash
   ollama serve
   ```

3. **Run zrok** (in a new terminal):
   ```bash
   zrok share http 11434
   ```

4. **Copy the URL** that appears

5. **In Vello:**
   - Open [https://vello-mordern-ui.vercel.app](https://vello-mordern-ui.vercel.app)
   - Click ⚙️ → **Ollama Local** → **Tunnel**
   - Paste your zrok URL
   - Click **Connect**

---

## Option 3: Cloudflare Tunnel (Free, No Account Required)

Cloudflare Tunnel is also free and doesn't require an account for basic usage.

### Setup:

1. **Install cloudflared**:
   ```bash
   brew install cloudflare/cloudflare/cloudflared
   ```

2. **Start your Ollama** (if not already running):
   ```bash
   ollama serve
   ```

3. **Run Cloudflare Tunnel** (in a new terminal):
   ```bash
   cloudflared tunnel --url http://localhost:11434
   ```

4. **Copy the URL** that appears

5. **In Vello:**
   - Open [https://vello-mordern-ui.vercel.app](https://vello-mordern-ui.vercel.app)
   - Click ⚙️ → **Ollama Local** → **Tunnel**
   - Paste your Cloudflare Tunnel URL
   - Click **Connect**

---

## Troubleshooting

**Q: The tunnel URL keeps changing every time I run the command.**
- **LocalTunnel**: Each run generates a new URL. To keep the same URL, you can use `lt --port 11434 --subdomain myollama` (if available).
- **zrok**: Each run generates a new URL. This is normal for free tier.

**Q: I'm getting connection errors in Vello.**
- Make sure your Ollama is running: `ollama serve`
- Make sure the tunnel is still running (don't close the terminal)
- Refresh Vello and try connecting again

**Q: Can I use these tunnels permanently?**
- Yes! Just keep the tunnel running in a terminal while you use Vello.
- For permanent setups, consider running the tunnel in a `screen` or `tmux` session.

---

## Keep Your Tunnel Running

The tunnel must stay running while you use Vello. If you close the terminal, the tunnel stops and Vello will disconnect.

**Pro Tip:** Use `screen` or `tmux` to keep the tunnel running in the background:

```bash
# Start a new screen session
screen -S ollama-tunnel

# Run the tunnel (e.g., LocalTunnel)
lt --port 11434

# Press Ctrl+A then D to detach (tunnel keeps running)

# To reconnect later:
screen -r ollama-tunnel
```

---

## Summary

| Service | Setup Time | Account Required | Cost | Best For |
|---------|-----------|------------------|------|----------|
| **LocalTunnel** | 2 min | No | Free | Easiest, no config |
| **zrok** | 3 min | No | Free | Open source lovers |
| **Cloudflare** | 3 min | No* | Free | Enterprise-grade |

*Cloudflare Tunnel may require an account for advanced features, but basic tunneling is free.

Choose **LocalTunnel** if you want the simplest setup! 🚀
