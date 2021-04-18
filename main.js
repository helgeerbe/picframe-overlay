const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

let mainWindow = null;

function onAppReady() {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    kiosk: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });




  fetch('https://picframe.erbehome.de:9000/?fade_time')  
    .then(res => res.json())
    .then(function(data) {
      if (data["fade_time"] == 10) {
        mainWindow.loadFile('clock.html');
        console.log(data);
      }
      else {
        mainWindow.loadFile('weather.html');
      }
    })
    .catch(function() {
      console.log("Can't connect to PictureFrame webserver.");
    });


  

  const shortcut = globalShortcut.register('Control+Space', () => {
    mainWindow.show();
  });

  if (!shortcut) { console.log('Registration failed.'); }

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}



app.on('ready', () => setTimeout(onAppReady, 500));
