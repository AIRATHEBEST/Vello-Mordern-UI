# Vello AI - Ollama Tunnel Setup Guide

This guide explains how to securely connect your local Ollama instance to the Vello AI web application, especially when the Vello app is hosted on a secure domain (HTTPS) like Vercel. Direct connections from HTTPS to local HTTP services are blocked by browsers due to **Mixed Content** restrictions and **CORS** policies.

To overcome this, you need to expose your local Ollama instance to the internet via a secure HTTPS tunnel. This document provides instructions for popular tunneling services.

## How it Works

1.  **Ollama Runs Locally:** Your Ollama desktop app or server continues to run on your local machine, typically on `http://localhost:11434`.
2.  **Tunneling Service:** A tunneling service (like ngrok, zrok, or Cloudflare Tunnel) creates a secure, public HTTPS URL that forwards requests to your local Ollama instance.
3.  **Vello Connects Securely:** The Vello AI app, running on Vercel, can then connect to this public HTTPS URL without encountering Mixed Content or CORS issues.

## Setup Instructions

Choose one of the following options to set up your Ollama tunnel. Keep the tunnel running in a terminal while you are using Vello AI.

### Option 1: ngrok (Easiest)

ngrok is a popular service for exposing local servers to the internet. It's straightforward to set up and provides a stable public URL.

1.  **Sign Up & Download:**
    *   Go to [ngrok.com](https://ngrok.com) and sign up for a free account.
    *   Follow the instructions to download the ngrok client for your operating system.
    *   Connect your ngrok account by running the provided `ngrok config add-authtoken <YOUR_AUTH_TOKEN>` command in your terminal.

2.  **Start Ollama:** Ensure your Ollama desktop app or server is running locally.

3.  **Run ngrok:** Open a new terminal or command prompt and run the following command:
    ```bash
    ngrok http 11434
    ```

4.  **Copy HTTPS URL:** ngrok will display a public HTTPS URL (e.g., `https://abc123.ngrok.io`). Copy this URL.

5.  **Configure Vello AI:**
    *   Open the Vello AI app (e.g., `https://vello-mordern-ui.vercel.app`).
    *   Click the ⚙️ (settings) button in the bottom-right corner.
    *   Select **Ollama Local** as the API Provider.
    *   Choose **Tunnel** as the Connection Mode.
    *   Paste the copied HTTPS ngrok URL into the **Tunnel URL** field.
    *   Click **Connect** to verify the connection.

### Option 2: zrok (Open Source Alternative)

zrok is an open-source, self-hosted alternative to ngrok, offering similar functionality.

1.  **Install zrok:**
    *   On macOS, you can install with Homebrew:
        ```bash
        brew install zrok
        ```
    *   For other operating systems, refer to the [zrok installation guide](https://zrok.io/docs/getting-started/install/).

2.  **Start Ollama:** Ensure your Ollama desktop app or server is running locally.

3.  **Run zrok:** Open a new terminal or command prompt and run the following command:
    ```bash
    zrok share http 11434
    ```

4.  **Copy URL:** zrok will generate a public URL. Copy this URL.

5.  **Configure Vello AI:** Follow step 5 from the ngrok instructions above, pasting your zrok URL instead.

### Option 3: Cloudflare Tunnel (Requires Cloudflare Account)

Cloudflare Tunnel (using `cloudflared`) is another robust option, especially if you already use Cloudflare for your domain.

1.  **Install `cloudflared`:**
    *   Download `cloudflared` from the [Cloudflare Developers website](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).
    *   Follow the installation instructions for your operating system.

2.  **Start Ollama:** Ensure your Ollama desktop app or server is running locally.

3.  **Run Cloudflare Tunnel:** Open a new terminal or command prompt and run the following command:
    ```bash
    cloudflared tunnel --url http://localhost:11434
    ```

4.  **Copy HTTPS URL:** Cloudflare Tunnel will provide a public HTTPS URL. Copy this URL.

5.  **Configure Vello AI:** Follow step 5 from the ngrok instructions above, pasting your Cloudflare Tunnel URL instead.

---

**Tip:** After setting up your tunnel, remember to keep the terminal window where the tunneling service is running open. Closing it will disconnect your Vello AI app from your local Ollama instance.
