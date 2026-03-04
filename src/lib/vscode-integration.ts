/**
 * VS Code Integration for Vello AI
 * Allows Vello to communicate with a VS Code extension
 */

export class VSCodeIntegration {
  private static instance: VSCodeIntegration
  private isConnected: boolean = false

  private constructor() {
    // Listen for messages from VS Code if running inside a webview
    window.addEventListener('message', (event) => {
      const message = event.data
      switch (message.command) {
        case 'setContext':
          console.log('Context received from VS Code:', message.text)
          break
        case 'applyCode':
          console.log('Applying code to editor:', message.code)
          break
      }
    })
  }

  public static getInstance(): VSCodeIntegration {
    if (!VSCodeIntegration.instance) {
      VSCodeIntegration.instance = new VSCodeIntegration()
    }
    return VSCodeIntegration.instance
  }

  /**
   * Send code to VS Code to be inserted into the editor
   */
  public async applyCodeToEditor(code: string): Promise<boolean> {
    try {
      // Check if we are in a VS Code webview
      const vscode = (window as any).acquireVsCodeApi ? (window as any).acquireVsCodeApi() : null
      if (vscode) {
        vscode.postMessage({
          command: 'applyCode',
          code: code
        })
        return true
      }
      
      // Fallback: Copy to clipboard if not in VS Code
      await navigator.clipboard.writeText(code)
      return false
    } catch (error) {
      console.error('Failed to apply code to editor:', error)
      return false
    }
  }

  /**
   * Check if running inside VS Code
   */
  public isInsideVSCode(): boolean {
    return !!(window as any).acquireVsCodeApi
  }
}

export const vscodeIntegration = VSCodeIntegration.getInstance()
