'use strict';

const Boom = require('boom');
const ASQ = require('asynquence-contrib');
const azure = require('azure-storage');
const shortid = require('shortid');
const fileutil = require('../lib/util');
const blobSvc = azure.createBlobService();
const FILE_CONTAINER_NAME = process.env.FILE_CONTAINER_NAME || 'files';
const TMP_FILE_FOLDER = './temp_files/';

module.exports = function (options) {
  var opt = options;
  console.log('files get', 'init');
  fileutil.clearTempFolder(TMP_FILE_FOLDER); // called once on init

  return function (request, reply) {

    console.log('Content mgr', 'Files', 'Get');
    let filename = request.params.blobname;
    let tempname = [TMP_FILE_FOLDER, shortid.generate(), filename].join('');

    if (!filename) {
      reply(Boom.badRequest());

    } else {

      ASQ((done) => {

        // fetch from blob
        console.log('Content mgr', 'Files', 'Get Blob', filename);

        console.time(tempname);
        blobSvc.getBlobToLocalFile(
          FILE_CONTAINER_NAME,
          filename,
          tempname,
          done.errfcb);

      }).then((done) => {

        // resize if needed
        console.timeEnd(tempname);
        reply.file(tempname);

        done();

        // clear the temp image
        setTimeout(fileutil.clearTempFile(tempname), process.env.UNLINK_TIMEOUT || 2000);

      }).or((err) => {

        // manage errors
        if (err.name === 'StorageError' && err.message === 'NotFound') {
          reply(Boom.notFound());
        } else {
          console.error(err);
          reply(err);
          throw err;
        }

      });
    }

  };
};

