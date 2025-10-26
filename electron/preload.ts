import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  onMainMessage: (callback: (value: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, value) => callback(value))
  },
})

