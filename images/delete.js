'use strict';

const Boom = require('boom');
const azure = require('azure-storage');
const blobSvc = azure.createBlobService();
const IMG_CONTAINER_NAME = process.env.IMG_CONTAINER_NAME || 'images';


module.exports = function (options) {
  var opt = options;
  console.log('images delete', 'init');

  return function (request, reply) {
    console.log('Content mgr', 'Images', 'Delete');
    let filename = request.params.blobname;
    if (filename) {
      blobSvc.deleteBlob(IMG_CONTAINER_NAME, filename, (err, res) => {
        reply(err || {success: true});
      });
    } else {
      reply(Boom.badRequest());
    }
  };

};
