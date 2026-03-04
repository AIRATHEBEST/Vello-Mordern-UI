/**
 * Vercel Edge Proxy for Ollama
 * 
 * This API route acts as a server-side proxy that:
 * 1. Accepts requests from the Vello frontend
 * 2. Forwards them to the user's ngrok tunnel (or local Ollama)
 * 3. Returns the response without CORS restrictions
 * 
 * This bypasses all browser CORS/security restrictions because
 * it's a server-to-server connection, not a browser-to-server connection.
 */

import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST and GET requests
  if (!['GET', 'POST', 'DELETE', 'OPTIONS'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  try {
    // Get the target URL from query parameter
    const targetUrl = req.query.url as string
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing url parameter' })
    }

    // Validate that the URL is a tunnel or localhost (ngrok, localtunnel, zrok, cloudflare, localhost)
    const isValidTunnel = targetUrl.includes('ngrok') || 
                          targetUrl.includes('loca.lt') ||  // LocalTunnel
                          targetUrl.includes('zrok') ||
                          targetUrl.includes('cloudflare') ||
                          targetUrl.includes('localhost') || 
                          targetUrl.includes('127.0.0.1')
    
    if (!isValidTunnel) {
      return res.status(400).json({ error: 'Invalid target URL' })
    }

    // Prepare the request body
    let body: string | undefined
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      body = JSON.stringify(req.body)
    }

    // Make the request to the target Ollama server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vello-Ollama-Proxy/1.0',
      },
      body,
    })

    // Get the response data
    const data = await response.text()

    // Set CORS headers on the response
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')

    // Return the response from Ollama
    return res.status(response.status).send(data)
  } catch (error: any) {
    console.error('Proxy error:', error)
    return res.status(500).json({
      error: 'Proxy request failed',
      message: error.message,
    })
  }
}
