/* jshint esversion: 6 */
var postForm = (function () {
  var Http = require('http');

  function getFormDataForPost(fields) {
    var post_data = [],
      length = 0,
      boundary = Math.random().toString();

    function encodeFieldPart(boundary, name, value) {

      var return_part = "------WebKitFormBoundary" + boundary +
        "\r\nContent-Disposition: form-data; name=\"" + name + "\"\r\n\r\n" + value;
      return return_part;
    }

    if (fields) {
      for (var key in fields) {
        var value = fields[key];
        post_data.push(encodeFieldPart(boundary, key, value));
        post_data.push("\r\n------WebKitFormBoundary" + boundary + "--");
      }
    }

    for (var i = 0; i < post_data.length; i++) {
      length += post_data[i].length;
    }

    var params = {
      postdata: post_data,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary' + boundary,
        'Content-Length': length
      }
    };
    return params;
  }

  function postData(fields, options, headers, callback) {

    var headerparams = getFormDataForPost(fields),
      totalheaders = headerparams.headers;

    for (var key in headers) {
      totalheaders[key] = headers[key];
    }

    var post_options = {
        host: options.host,
        port: options.port,
        path: options.path,
        method: options.method || 'POST',
        headers: totalheaders
      },
      request = Http.request(post_options, function (response) {
        response.body = '';
        response.setEncoding(options.encoding);

        response.on('data', function (chunk) {
          response.body += chunk;
        });

        response.on('end', function () {
          callback(null, response);
        });
      });

    for (var i = 0; i < headerparams.postdata.length; i++) {
      request.write(headerparams.postdata[i]);
    }
    request.end();
  }

  return {
    postData: postData
  };

})();


module.exports = postForm;