var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var request = require('request');

var contourTestData;
request('http://preview-app.contour7.be/gateway/programme/complete', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    contourTestData = body;// Show the HTML for the Google homepage. 
  }
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var io  = socket_io();
app.io  = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/map', routes);
app.use('/users', users);

//APPCACHE
/*app.get('/manifest.appcache', function(req, res){
    res.set("Content-Type", "text/cache-manifest");
    res.set("Cache-Control", "no-store, no-cache");
    res.sendFile(path.join(__dirname, 'manifest.appcache'));
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.on('connection', function (socket) {
  socket.emit('getJson', contourTestData);
});


module.exports = app;
