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

const compression = require('compression');
const port = 3000;
const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));


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
