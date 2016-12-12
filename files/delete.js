'use strict';

const Boom = require('boom');
const azure = require('azure-storage');
const blobSvc = azure.createBlobService();
const FILE_CONTAINER_NAME = process.env.FILE_CONTAINER_NAME || 'files';


module.exports = function (options) {
  var opt = options;
  console.log('files delete', 'init');

  return function (request, reply) {
    console.log('Content mgr', 'Files', 'Delete');
    let filename = request.params.blobname;
    if (filename) {
      blobSvc.deleteBlob(FILE_CONTAINER_NAME, filename, (err, res) => {
        reply(err || {success: true});
      });
    } else {
      reply(Boom.badRequest());
    }
  };

};
