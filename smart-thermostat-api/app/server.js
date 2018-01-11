#!/usr/bin/env node

var app = require('./index');
var config = require('./config');

for (let i = 2; i < process.argv.length; i++) {
  if ((process.argv[i] === '--port' || process.argv[i] === '-P') && i + 1 < process.argv.length) {
    i++;
    config.express.port = process.argv[i];
  }
}

// logger
var bole = require('bole');

bole.output({level: 'debug', stream: process.stdout});
var log = bole('server');

log.info('server process starting');

app.listen(config.express.port, config.express.ip, (error) => {
  if (error) {
    throw new Error('Unable to listen for connections', error);
  }
  log.info('express is listening on http://' +
    config.express.ip + ':' + config.express.port);
});
