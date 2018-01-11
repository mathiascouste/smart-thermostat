var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Body parser to be able to read the json in the request
app.use(bodyParser.json());

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('*', (req, res) => {
  res.status(200).send();
});

app.use('/api/temperature', require('./temperature/router'));

// FINALLY, use any error handlers
app.use(require('./errors/not-found'));

// Export the app instance for unit testing via supertest
module.exports = app;
