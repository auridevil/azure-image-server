'use strict';
console.log('Starting up...');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

const Hapi = require('hapi');
const server = new Hapi.Server();
const assert = require('assert');

// check env
assert(process.env.AZURE_STORAGE_CONNECTION_STRING, 'AZURE_STORAGE_CONNECTION_STRING must be defined');

// server connection
server.connection({
  host: HOST,
  port: PORT
});

const options = {
  server: server
};

server.register({register: require('hapi-auth-jwt')});
server.register({register: require('inert')});
server.auth.strategy('token', 'jwt', require('./lib/auth'));

require('./images/index.js')(options)
  .then(
    () => {
      require('./files/index.js')(options)
        .then(
          () => {
            // start server
            server.start((startErr) => {
              if (startErr) {
                throw startErr;
              }
              // unlink all temp files here
              console.log('Server running at:', server.info.uri);
            });
          }
        );
    });

