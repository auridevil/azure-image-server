'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('promise');


module.exports = function (options) {
  var server = options.server;
  return new Promise(
    (resolve, reject) => {

      server.route(
        {
          method: 'GET',
          path: '/file/{blobname}',
          handler: require('./get.js')(options)
        }
      );

      server.route(
        {
          method: 'POST',
          path: '/file',
          config: {
            payload: {
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              maxBytes: 20971520 // 20 MB
            },
            handler: require('./post')(options)
          }
        }
      );

      server.route(
        {
          method: 'DELETE',
          path: '/file/{blobname}',
          handler: require('./delete.js')(options)
        }
      );

      console.log('Content Mgr', 'api files load complete');
      resolve();
    }
  );
};


