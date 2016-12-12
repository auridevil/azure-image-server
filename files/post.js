'use strict';

const Boom = require('boom');
const ASQ = require('asynquence-contrib');
const azure = require('azure-storage');
const blobSvc = azure.createBlobService();
const FILE_CONTAINER_NAME = process.env.FILE_CONTAINER_NAME || 'files';


module.exports = function (options) {
  var opt = options;
  console.log('files post', 'init');

  return function (request, reply) {
    console.log('Content mgr', 'Files', 'Post');
    let data = request.payload;
    if (data.file && validateContentType(data.file.hapi.headers['content-type'])) {
      let name = data.filename || data.file.hapi.filename;

      ASQ((done) => {

        // try to create container
        console.log('Create container');
        blobSvc.createContainerIfNotExists(FILE_CONTAINER_NAME, {publicAccessLevel: 'blob'}, done.errfcb);

      }).then((done) => {

        // create the file
        console.log('Create block blob');
        blobSvc.createBlockBlobFromText(
          FILE_CONTAINER_NAME,
          name,
          data.file._data,
          {
            contentType: data.file.hapi.headers['content-type']
          },
          done.errfcb);

      }).then((done) => {

        // respond
        reply(name);
        done();

      }).or((err) => {

        reply(err);
        throw err;

      });

    } else {
      reply(Boom.badRequest());
    }
  };
};


function validateContentType(contentType) {
  // return (
  //   (contentType === 'image/jpeg') ||
  //   (contentType === 'image/tiff')
  // );
  return true;
}
