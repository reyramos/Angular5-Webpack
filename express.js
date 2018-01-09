/**
 * Created by ramor11 on 9/8/2016.
 */
// Validates that the dist build was successful
// by serving the files in the "dist" directory
// via the simplest possible Express application
//
// npm install express-http-proxy express compression

const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');


var helpers = require('./config/helpers');
var compression = require('compression');
var port = 3000;
var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/**', proxy({
  target: 'http://localhost:9998',
  secure: false,
  changeOrigin: true,
  onProxyReq: function (proxyReq, req, res) {
  }
}));


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('express => http://localhost:' + port);
  }
});
