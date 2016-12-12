'use strict';

module.exports = {
  key: process.env.JWT_KEY || 'jwt-secret-key-here',
  verifyOptions: {algorithms: ['HS256']} // only allow HS256 algorithm
};
