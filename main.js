// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain  } = require('electron');
const path = require('path');
const mqtt = require('mqtt');
const fetch = require('electron-fetch').default;
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
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  let mqttConfig = JSON.parse(process.env.MQTT);
  connect (mqttConfig.host, mqttConfig.port, mqttConfig.clientId, mqttConfig.username, mqttConfig.password );
  subscribe("picframe/overlay", 0);
  loadOverlay();

  //mainWindow.webContents.openDevTools()
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  setTimeout(createWindow, 1000); // ther seems to be a timing issue for transparent windows.
  
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

// mqtt part
let client = null
  
const options = {
  keepalive: 30,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000
}
  
/**
 * Connect to mqqt server
 *
 * @param {string} host
 * @param {string} port - default 1883 for tls it's 8883 Todo implemnt TLS
 * @param {string} clientId
 * @param {string} username
 * @param {string} password
 * @return {void} Nothing
 */
function connect (host, port, clientId, username, password ) {
  const connectUrl = `mqtt://${host.value}:${port.value}`
  options.clientId = clientId.value || `mqttjs_${Math.random().toString(16).substr(2, 8)}`
  options.username = username.value
  options.password = password.value
  console.log('connecting mqtt client')
  client = mqtt.connect(connectUrl, options)
  client.on('error', (err) => {
    console.error('Connection error: ', err)
    client.end()
  })
  client.on('reconnect', () => {
    console.log('Reconnecting...')
  })
  client.on('connect', () => {
    console.log('Client connected:' + options.clientId)
  })
}

/**
 * Subscribe to a topic on which messages will be recieved
 *
 * @param {string} topic - topic on which the message is recieved
 * @param {int} qos - quality of service
 * @return {void} Nothing
 */
function subscribe (topic, qos) {
  if (client.connected) {
    client.subscribe(topic.value, { qos: parseInt(qos.value, 10) }, (error, res) => {
       if (error) {
         console.error('Subscribe error: ', error)
       } else {
         console.log('Subscribed: ', res)
       }
    })
  }
}

/**
 * Callback when a mqtt message is recieved on a prior subscribed topic
 *
 * @param {string} topic - topic on which the message is recieved
 * @param {string} message - the message itself
 * @return {void} Nothing
 */
client.on('message', (topic, message) => {
  console.log(`Recieved message ${message} on topic ${topic}.`);
})