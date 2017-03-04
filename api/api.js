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
          let result = {};
          if (res.body) {
            $("#main TABLE TR", res.body).each(function (idx, obj) {
              const td = $('TD', $(obj));
              result[$(td[0]).text().trim()] = $(td[1]).text().replace(/([\r\n\t])+/g, "").trim();
            });

            if (Object.keys(result).length !== 0) {
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