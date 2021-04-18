// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain  } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default
const config = require('dotenv').config();

console.log(`Your PictureFrame url is: ${process.env.PICFRAME_URL}`); 

var actual_overlay = -1;
var mainWindow = null;

function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // no window decorations
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    kiosk: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  loadOverlay()

  //mainWindow.webContents.openDevTools()
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  setTimeout(createWindow, 500); // ther seems to be a timing issue for transparent windows.
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) setTimeout(createWindow, 500)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function loadOverlay() {
  // load in picframe selected overlay
  fetch(process.env.PICFRAME_URL)  
  .then(res => res.json())
  .then(function(data) {
    if (actual_overlay != data["fade_time"] ) {
      actual_overlay = data["fade_time"];
      console.log('Actual selected overlay is %d.', actual_overlay);
      switch (actual_overlay) {
        case 11:
          console.log("Load clock overlay");
          mainWindow.loadFile('clock.html');
          break;
        case 12:
          console.log("Load weather overlay");
          mainWindow.loadFile('weather.html');
          break;
        default:
          console.log("Load empty overlay");
          mainWindow.loadFile('empty.html');
      }
    }
  })
  .catch(function() {
    console.log("Can't connect to PictureFrame webserver.");
  });

  // reload Overlay
  setTimeout(loadOverlay, 1000)
}

// send environment vars to renderer
ipcMain.on("toMain", (event, args) => {
  console.log(`Recieved: ${args}`);
    mainWindow.webContents.send("fromMain", config.parsed);
});