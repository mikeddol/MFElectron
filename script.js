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
        return setHeaders(fullData);
      })
      .then(function (fullData) {
        return setData(fullData);
      })
      .then(function () {
        console.log("done!");
      });

  });

const setHeaders = function (companies) {
  return new Promise(function (resolve, reject) {
    const refactoredCompanies = companies.map(function (company) {
      let newCompany = {};
      for (let key in company) {
        if (!company.hasOwnProperty(key)) continue;

        switch (key) {
        case 'taxCode':
          newCompany['CUI'] = company[key];
          break;
        case 'name':
          newCompany['Nume'] = company[key];
          break;
        case 'address':
          newCompany['Adresa'] = company[key];
          break;
        case 'tradeRegisterCode':
          newCompany['Numar inmatriculare'] = company[key];
          break;
        case 'zipCode':
          newCompany['Cod postal'] = company[key];
          break;
        case 'phone':
          newCompany['Telefon'] = company[key];
          break;
        case 'fax':
          newCompany['Fax'] = company[key];
          break;
        case 'companyState':
          newCompany['Stare societate'] = company[key];
          break;
        default:
          break;
        }
      }
      return newCompany;
    });
    resolve(refactoredCompanies);
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

  return Promise.all(bulkData).then(function (values) {
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