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
          path: '/image/{blobname}',
          config: {
            auth: {
              strategy: 'token',
              mode: 'optional'

            },
            handler: require('./get')(options)
          }
        }
      );

      server.route(
        {
          method: 'POST',
          path: '/image',
          config: {
            payload: {
              output: 'stream',
              parse: true,
              allow: 'multipart/form-data',
              maxBytes: 20971520 // 20 MB
            },
            auth: 'token',
            handler: require('./post')(options)
          }
        }
      );

      server.route(
        {
          method: 'DELETE',
          path: '/image/{blobname}',
          config: {
            auth: 'token',
            handler: require('./delete')(options)
          }
        }
      );

      console.log('Content Mgr', 'api images load complete');
      resolve();
    }
  );
};


