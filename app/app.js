//jshint esversion:6
const app = (function () {
  'use strict';
  const csv = require('fast-csv'),
    path = require('path'),
    api = require('./api/api');

  let inputPath = '';

  const setInputPath = function (userInputPath) {
    return new Promise(function (resolve, reject) {
      if (!userInputPath && userInputPath.length === 0) {
        reject("Invalid input path!");
      }
      inputPath = userInputPath;
      resolve();
    });
  };

  const run = function () {
    return new Promise(function (resolve, reject) {
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
            .then(function (endPath) {
              resolve(endPath);
            })
            .catch(function (err) {
              reject(err);
            });
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
        resolve(endPath);
      });
    });
  };

  return {
    run: run,
    setInputPath: setInputPath
  };
})();

module.exports = app;