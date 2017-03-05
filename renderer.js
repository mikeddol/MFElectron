/* jshint esversion: 6 */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer,
  shell = require('electron').shell,
  Ladda = require('ladda');

const selectDirBtn = document.getElementById('select-directory'),
  performRqBtn = document.getElementById('perform-request'),
  selectedFile = document.getElementById('selected-file'),
  readyLocation = document.getElementById('ready-location'),
  laddaButton = Ladda.create(performRqBtn);

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog');
});

performRqBtn.addEventListener('click', function (event) {
  ipc.send('perform-request');
  laddaButton.start();
});

ipc.on('selected-directory', function (event, resPath) {
  selectedFile.innerHTML = `You selected: ${resPath}`;
  performRqBtn.disabled = false;
  performRqBtn.classList.remove('btn-error');
  performRqBtn.classList.add('btn-success');
});

ipc.on('target-directory', function (event, endPath) {
  selectedFile.innerHTML = `Your file is ready`;
  readyLocation.innerHTML = `View File in Folder`;
  laddaButton.stop();

  readyLocation.addEventListener('click', function (event) {
    shell.showItemInFolder(endPath);
  });
});