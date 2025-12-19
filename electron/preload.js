// Preload script for Electron
// This runs in a sandboxed environment with access to some Node.js APIs

const { contextBridge, ipcRenderer } = require('electron');

// Expose platform info and file APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  
  // File operations
  saveFile: (data, defaultFilename, filters) => 
    ipcRenderer.invoke('save-file', { data, defaultFilename, filters }),
  
  openFile: (filters) => 
    ipcRenderer.invoke('open-file', { filters }),
  
  // Dialog operations
  showPrompt: (message, defaultValue) =>
    ipcRenderer.invoke('show-prompt', { message, defaultValue }),
  
  showMessage: (type, title, message, buttons) =>
    ipcRenderer.invoke('show-message', { type, title, message, buttons }),
  
  showConfirm: (message) =>
    ipcRenderer.invoke('show-confirm', { message })
});

// Log when preload script runs
console.log('Electron preload script loaded');
console.log('Platform:', process.platform);
console.log('Electron version:', process.versions.electron);
