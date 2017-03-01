// jshint esversion:6
const api = (function () {
  const $ = require('cheerio');

  const postform = require('./postform');

  const getInfo = function (cod) {
    return new Promise(function (resolve, reject) {
      let code = "";
      if (cod === undefined) {
        reject("No code has been passed!");
      } else {
        if (~cod.toLowerCase().indexOf('ro')) {
          code = cod.substring(2, cod.length);
        } else {
          code = cod;
        }
      }

      postform.postData({
          'cod': code
        })
        .then(function (res) {

          let result = {
            taxCode: cod,
            name: '',
            county: '',
            address: '',
            phone: '',
            fax: '',
            zipCode: '',
            tradeRegisterCode: '',
            companyState: ''
          };

          var main = null;
          if (res.body) {

            $("#main TABLE TR TD", res.body).each(function (idx, obj) {

              main = $(obj).text();
              if (main.indexOf('Denumire platitor') != -1) {
                result.name = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Adresa:') != -1) {
                result.address = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Judetul:') != -1) {
                result.county = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Numar de inmatriculare la Registrul') != -1) {
                result.tradeRegisterCode = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Codul postal:') != -1) {
                result.zipCode = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Telefon:') != -1) {
                result.phone = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Fax:') != -1) {
                result.fax = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }

              if (main.indexOf('Stare societate:') != -1) {
                result.companyState = $(obj).next().text().replace(/([\r\n\t])+/g, "").trim();
              }
            });

            if (result.name.length !== 0) {
              resolve(result);
            } else {
              reject("Can not identify company!");
            }
          } else {
            reject("Can not identify company with code: " + cod);
          }
        }).catch(function (res) {
          reject(res);
        });
    });
  };

  return {
    getInfo: getInfo
  };
})();

module.exports = api;