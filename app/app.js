//jshint esversion:6
const app = (function () {
  'use strict';
  const csv = require('fast-csv'),
    path = require('path'),
    api = require('./api/api');

  const run = function (inputPath) {
    let codes = [];
    const startPath = path.resolve(inputPath);

    const parsedPath = path.parse(inputPath);
    const endPath = path.resolve(parsedPath.dir, parsedPath.name + '_filled' + parsedPath.ext);

    csv.fromPath(startPath)
      .on("data", function (data) {
        codes.push(data.pop());
      }).on("end", function () {
        codes.shift();

        getData(codes)
          .then(function (fullData) {
            return setData(fullData, endPath);
          })
          .then(function () {
            console.log("done!");
          });

      });
  };

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

  const setData = function (fullData, endPath) {
    return new Promise(function (resolve, reject) {
      csv.writeToPath(endPath, fullData, {
        headers: true
      }).on('finish', function () {
        resolve();
      });
    });
  };

  return {
    run: run
  };
})();

module.exports = app;