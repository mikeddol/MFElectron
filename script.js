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
    getLocations(codes);
  });
stream.pipe(csvStream);



const getLocations = function (codes) {
  const locations = codes.map(function (cod) {
    return api.getInfo(cod)
      .then(function (res) {
        return res;
      }).catch(function (err) {
        console.error(err);
      });
  });

  Promise.all(locations).then(function (values) {
    console.log(values);
  });
};