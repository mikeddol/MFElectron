//jshint esversion:6
const api = require('./api/api');
const cod = "";

api.getInfo(cod)
  .then(function (res) {
    console.log(res);
  }).catch(function (err) {
    console.error(err);
  });