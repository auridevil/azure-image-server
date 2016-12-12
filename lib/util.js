'use strict';

const fs = require('fs-extra');

module.exports = {

  /* clear a single temp file */
  clearTempFile: function (name) {
    var tempname = name;
    return function () {
      fs.unlink(tempname, (err) => {
        console.log('Content mgr', name, 'unlink tempfile', err || 'ok');
      });
    };
  },

  /* clear the temp folder on startup */
  clearTempFolder: function (folder) {
    fs.remove(folder, (err) => {
      console.log('Content mgr', folder, ' unlink folder on startup', err || 'ok');
      fs.mkdir(folder);
    });
  },

  /* access in sync to a file */
  accessSync: function (name) {
    return fs.accessSync(name);
  }

};
