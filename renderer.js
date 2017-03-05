/* jshint esversion: 6 */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer;

const selectDirBtn = document.getElementById('select-directory');

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog');
});

ipc.on('selected-directory', function (event, path) {
  document.getElementById('selected-file').innerHTML = `You selected: ${path}`;
});