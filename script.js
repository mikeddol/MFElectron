/* jshint esversion: 6 */
const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow,
  mfApp = require('./app/app'),
  path = require('path'),
  url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

const ipc = require('electron').ipcMain,
  dialog = require('electron').dialog;

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) {
      mfApp.run(files.pop());
      event.sender.send('selected-directory', files);
    }
  });
});