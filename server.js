var express = require('express');
var passport = require('passport');

var app = express();

app.get('/', function(req, res) {
   res.send('SOSMentor start page');
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("SOSMentor listening at http://%s:%s", host, port);

});
