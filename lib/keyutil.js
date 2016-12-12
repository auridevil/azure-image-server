'use strict';

// used to generate sample key

const jwt = require('jsonwebtoken');
const authObj = {
  username: 'test'
}
const secret = require('./auth').key;

console.log([
  'token:[',
  jwt.sign(authObj, secret, {algorithm: 'HS256'}),
  ']']
  .join('')
);