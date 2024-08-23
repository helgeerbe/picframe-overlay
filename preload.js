const { contextBridge, ipcRenderer } = require('electron/renderer');

const config = require('dotenv').config();

contextBridge.exposeInMainWorld(
  "api", {
    // expose process.env.ENV to renderer
    readConfig: () => {
      return config.parsed;
    },
    // expose update of image meta data to renderer
    onUpdateImage: (callback) => {
      ipcRenderer.on('update-image', (_event, value) => callback(value))
    },
    triggerUpdateImage: (message) => {
      ipcRenderer.send('trigger-update-image')
    }
  }
);
