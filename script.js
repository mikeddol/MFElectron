//jshint esversion:6
const fs = require('fs'),
  csv = require('fast-csv');

const api = require('./api/api');
let codes = [];
let stream = fs.createReadStream("clienti.csv");

let csvStream = csv
  .parse()
  .on("data", function (data) {
    codes.push(data.pop());
  }).on("end", function () {
    codes.shift();
    getData(codes).then(function (res) {
      console.log(res);
    });
  });
stream.pipe(csvStream);

const getData = function (codes) {
  const bulkData = codes.map(function (code) {
    return api.getInfo(code)
      .then(function (res) {
        return res;
      }).catch(function (err) {
        return err;
      });
  });

  return Promise.all(bulkData).then(function (values) {
    return values;
  }).catch(function (err) {
    return err;
  });
};