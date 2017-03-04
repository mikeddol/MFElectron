//jshint esversion:6
const csv = require('fast-csv'),
  path = require('path');

const api = require('./api/api');
let codes = [];
const myPath = path.resolve(__dirname, "clienti.csv");
const endPath = path.resolve(__dirname, "clientiFull.csv");

csv.fromPath(myPath)
  .on("data", function (data) {
    codes.push(data.pop());
  }).on("end", function () {
    codes.shift();

    getData(codes)
      .then(function (fullData) {
        return setData(fullData);
      })
      .then(function () {
        console.log("done!");
      });

  });

const getData = function (codes) {
  const bulkData = codes.map(function (code) {
    return api.getInfo(code)
      .then(function (res) {
        return res;
      }).catch(function (err) {
        return err;
      });
  });

  return Promise.all(bulkData)
    .then(function (values) {
      return values;
    }).catch(function (err) {
      return err;
    });
};

const setData = function (fullData) {
  return new Promise(function (resolve, reject) {
    csv.writeToPath(endPath, fullData, {
      headers: true
    }).on('finish', function () {
      resolve();
    });
  });
};