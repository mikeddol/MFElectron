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
    height: 600,
    center: true,
    maximizable: false,
    fullscreenable: false,
    resizable: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.setMenu(null);

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
    properties: ['openFile'],
    filters: [{
      name: 'Comma Separated Value Files',
      extensions: ['csv']
    }]
  }, function (files) {
    if (files && files.length === 1) {
      mfApp.setInputPath(files.pop())
        .then(function (resPath) {
          event.sender.send('selected-directory', resPath);
        }).catch(function (err) {
          console.log(err);
        });
    }
  });
});

ipc.on('perform-request', function (event) {
  mfApp.run()
    .then(function (endPath) {
      event.sender.send('target-directory', endPath);
    }).catch(function (err) {
      console.log(err);
    });
});