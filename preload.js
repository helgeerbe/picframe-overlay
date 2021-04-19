const { contextBridge } = require("electron");

const config = require('dotenv').config();

contextBridge.exposeInMainWorld(
  "api", {
    // expose process.env.ENV to renderer
    readConfig: () => {
      return config.parsed;
    }
  }
);
