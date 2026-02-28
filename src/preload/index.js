import { contextBridge, ipcRenderer } from 'electron'

try {
  const { electronAPI } = require('@electron-toolkit/preload')
  contextBridge.exposeInMainWorld('electron', electronAPI)
} catch {
  // Fallback: 
  contextBridge.exposeInMainWorld('electron', {})
}

// Expose FOCOS site-blocking API under window.focos
contextBridge.exposeInMainWorld('focos', {
  /**
   * Block a list of domains by editing the OS hosts file.
   * @param {string[]} sites - Array of domain strings, e.g. ['facebook.com']
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  blockSites: (sites) => ipcRenderer.invoke('block-sites', sites),

  /**
   * Remove all FOCOS-managed entries from the hosts file.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  unblockSites: () => ipcRenderer.invoke('unblock-sites'),

  /**
   * Simple connectivity check.
   * @returns {Promise<'pong'>}
   */
  ping: () => ipcRenderer.invoke('ping'),

  /**
   * Check whether the app is running with admin/root privileges.
   * Useful for showing a warning in the UI on Windows.
   * @returns {Promise<boolean>}
   */
  isElevated: () => ipcRenderer.invoke('is-elevated'),
})