const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe, limited API to the renderer (index.html)
contextBridge.exposeInMainWorld('electronAPI', {
  analyze: (payload) => ipcRenderer.invoke('analyze', payload),
  isElectron: true,
});
