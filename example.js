const watson = require('./index.js')({ service: 'test', http: { level: 'error', host: 'requestb.in', path: '/10c40eu1', ssl: true } });

const err = new Error('Something went wrong');

watson.log('error', err.message, {
  env: process.env.NODE_ENV || 'dev',
  stack: err.stack,
  request: {}
});
