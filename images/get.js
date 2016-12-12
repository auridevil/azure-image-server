'use strict';

const Boom = require('boom');
const ASQ = require('asynquence-contrib');
const azure = require('azure-storage');
const shortid = require('shortid');
const fileutil = require('../lib/util');
const blobSvc = azure.createBlobService();
const IMG_CONTAINER_NAME = process.env.IMG_CONTAINER_NAME || 'images';
const TMP_IMAGE_FOLDER = './temp_img/';

module.exports = function (options) {
  var opt = options;
  console.log('images get', 'init');
  fileutil.clearTempFolder(TMP_IMAGE_FOLDER); // called once on init


  return function (request, reply) {

    console.log('Content mgr', 'Images', 'Get');
    let filename = request.params.blobname;
    let tempname = [TMP_IMAGE_FOLDER, shortid.generate(), filename].join('');
    let cachename = [TMP_IMAGE_FOLDER, request.query.w || 'nW', 'x', request.query.h || 'nH', filename].join('');
    if (filename) {

      try {
        // try get the scaled version
        fileutil.accessSync(cachename);
        console.log('Content mgr', 'Images', 'Get Image from cache');
        reply.file(cachename);

      } catch (fileNotCachedError) {

        ASQ((done) => {

          // fetch from blob
          console.log('Content mgr', 'Images', 'Get Blob', filename);

          console.time(tempname);
          blobSvc.getBlobToLocalFile(
            IMG_CONTAINER_NAME,
            filename,
            tempname,
            done.errfcb);

        }).then((done, res, res2) => {

          // resize if needed
          console.timeEnd(tempname);
          if (res2.isSuccessful) {
            resize(tempname, request.query, request.auth.isAuthenticated, cachename, done.errfcb);
          } else {
            done();
          }

        }).then((done, result) => {

          // reply the img
          if (result) {
            reply.file(cachename);
          } else {
            reply.file(tempname);
          }

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

    } else {
      reply(Boom.badRequest());
    }
  };
};


/** resize image if width is set */
function resize(filename, args, auth, savename, callback) {
  try {
    if (auth && args.w && args.h && args.w<4000 && args.h<4000) {
      return require('sharp')(filename).resize(args.w * 1, args.h * 1).toFile(savename, callback);
    } else if (auth && args.w && args.w<4000 && (!args.h)) {
      return require('sharp')(filename).resize(args.w * 1).toFile(savename, callback);
    } else {
      return callback();
    }
  }catch(exception){
    console.log('Sharp not available for resizing',exception);
    return callback();
  }
}

