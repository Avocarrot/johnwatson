const assert = require('assert');
const winston = require('winston');
const os = require('os');

class SherlockEvent {
  constructor(level, message, meta) {
    this.level   = level || 'error';
    this.message = message;
    this.service = null;

    let hostname = meta.hostname || os.hostname();
    let env      = meta.env || process.env.NODE_ENV;
    this.meta    = Object.assign({ env, hostname }, meta);
  }
}

class Sherlock extends winston.transports.Http {
  constructor(service, options) {
    super(options);
    this.meta = { service };
  }

  log(level, msg, meta, callback) {
    if (typeof meta === 'function') {
      callback = meta;
      meta = {};
    }

    let options = new SherlockEvent(level, msg, meta);
    options.service = this.service;

    if (meta) {
      if (meta.path) {
        options.path = meta.path;
        delete meta.path;
      }

      if (meta.auth) {
        options.auth = meta.auth;
        delete meta.auth;
      }
    }

    this._request(options, (err, res) => {
      if (res && res.statusCode !== 200) {
        err = new Error('HTTP Status Code: ' + res.statusCode);
      }

      if (err && callback) return callback(err);

      // TODO: emit 'logged' correctly,
      // keep track of pending logs.
      this.emit('logged');

      if (callback) callback(null, true);
    });
  }
}
/**
 *
 * option.service: (require, String) Name of service
 * options.http:
 * - host: (Default: localhost) Remote host of the HTTP logging endpoint
 * - port: (Default: 80 or 443) Remote port of the HTTP logging endpoint
 * - path: (Default: /) Remote URI of the HTTP logging endpoint
 * - auth: (Default: None) An object representing the username and password for HTTP Basic Auth
 * - ssl: (Default: false) Value indicating if we should us HTTPS
 **/
module.exports = (options) => {
  assert(options.service, 'options.service as service name is required');

  const winston    = require('winston');
  const transports = [];
  const rewriters  = [
    (level, msg, meta) => {
      return meta;
    } 
  ];

  if (options.http) {
    transports.push(new Sherlock(options.service, options.http));
  }
  return new winston.Logger({ transports, rewriters });
};
