# Cloudflare Worker Proxy for Ollama

This is a **30-second solution** that creates a free, serverless proxy to bypass ngrok's CORS restrictions.

## Why This Works

Your ngrok tunnel is blocking `OPTIONS` (pre-flight) requests with `403 Forbidden`. A Cloudflare Worker acts as a middleman that:
1. Accepts requests from Vello (on Vercel)
2. Strips CORS headers
3. Forwards to your ngrok tunnel
4. Returns the response without CORS blocks

## Setup (30 seconds)

### Step 1: Create a Cloudflare Worker
1. Go to [workers.cloudflare.com](https://workers.cloudflare.com)
2. Sign in (free account)
3. Click **Create a Service**
4. Name it: `ollama-proxy`
5. Click **Create Service**

### Step 2: Paste the Code
Replace the default code with this:

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Extract the target URL from query parameter
    const targetUrl = url.searchParams.get('target');
    if (!targetUrl) {
      return new Response('Missing target parameter', { status: 400 });
    }

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: request.method !== 'GET' ? request.body : undefined,
      });

      // Return response with CORS headers
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
```

### Step 3: Deploy
1. Click **Save and Deploy**
2. You'll get a URL like: `https://ollama-proxy.your-username.workers.dev`
3. Copy this URL

### Step 4: Configure Vello
1. Open [https://vello-mordern-ui.vercel.app](https://vello-mordern-ui.vercel.app)
2. Click ⚙️ → **Ollama Local** → **Tunnel**
3. Paste your **Cloudflare Worker URL** (not the ngrok URL):
   ```
   https://ollama-proxy.your-username.workers.dev?target=https://wenona-untracked-meridith.ngrok-free.dev
   ```
4. Click **Connect**

Your models should appear instantly! 🚀

---

## How It Works

- The Worker URL includes your ngrok tunnel as a `target` parameter
- The Worker fetches from ngrok and adds CORS headers
- Vello can now communicate without CORS blocks

## Keep Your ngrok Running

Remember to keep your ngrok tunnel running in the terminal:
```bash
ngrok http 11434
```

---

## Alternative: Use a Pre-Built Proxy

If you don't want to set up Cloudflare, you can use this pre-built proxy URL:
```
https://cors-proxy.manus.im?target=https://wenona-untracked-meridith.ngrok-free.dev
```

(Note: This is a public proxy and may have rate limits. Cloudflare Worker is recommended for reliability.)
