// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain  } = require('electron');
const path = require('path');
const mqtt = require('mqtt');
const config = require('dotenv').config();
const fs = require('fs')

var mainWindow = null;

function createWindow () {
  let overlay_image = JSON.parse(process.env.IMAGE);
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: overlay_image.width,
    height: overlay_image.height,
    frame: false, // no window decorations
    transparent: true,
    autoHideMenuBar: true,
    webPreferences: {
      offscreen: true
    }
  });

  mainWindow.hide();
  
  let mqttConfig = JSON.parse(process.env.MQTT);
  connect (mqttConfig.host, mqttConfig.port, mqttConfig.clientId, mqttConfig.username, mqttConfig.password );
  loadOverlay(-1);

  mainWindow.webContents.on('crashed', (e) => {
    app.relaunch();
    app.quit()
  });

  //mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('paint', (event, dirty, image) => {
    fs.writeFileSync(overlay_image.file, image.toPNG())
  })
  mainWindow.webContents.setFrameRate(60)
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




/**
 * loads the selected overlay
 *
 * @param {int} overlay - 0=empty, 1=clock, 2=weather
 * @return {void} Nothing
 */
function loadOverlay(overlay) {
  switch (overlay) {
    case 1:
      console.log("Load clock overlay");
      mainWindow.loadFile('clock.html');
      break;
    case 2:
      console.log("Load weather overlay");
      mainWindow.loadFile('weather.html');
      break;
    default:
      console.log("Load empty overlay");
      mainWindow.loadFile('empty.html');
  }
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
  const connectUrl = `mqtt://${host}:${port}`
  options.clientId = clientId || `mqttjs_${Math.random().toString(16).substr(2, 8)}`
  options.username = username
  options.password = password
  console.log('connecting mqtt client')
  client = mqtt.connect(connectUrl, options)
  client.on('error', (err) => {
    console.error('Connection error: ', err)
  })
  client.on('reconnect', () => {
    console.log('Reconnecting...')
  })
  client.on('connect', () => {
    console.log('Client connected:' + options.clientId);
    console.log(`Subscribe to topic "picframe/overlay"`);
    subscribe("picframe/overlay", 0);
  })
  client.on('message', (topic, message) => {
    console.log(`Recieved message ${message} on topic ${topic}.`);
    loadOverlay(parseInt(message, 10));
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
    client.subscribe(topic, { qos: parseInt(qos, 10) }, (error, res) => {
       if (error) {
         console.error('Subscribe error: ', error)
       } else {
         console.log('Subscribed: ', res)
       }
    })
  }
}