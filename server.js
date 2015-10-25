var express = require('express');
var app = express();
var expressSession = require('express-session');
var expressHbs = require('express3-handlebars');
var mongoUrl = 'mongodb://localhost:27017/dbname';
var MongoStore = require('connect-mongo')(expressSession);
var mongo = require('./mongo');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var morgan = require('morgan');
var db = require('./db');

var app = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || 8081;


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use('local', new Strategy(
  { passReqToCallback: true },
  function(req, username, password, cb) {
    db.users.findOne({ username: username }, function(err, user) {
      if (err) { return cb(err); }
      if (!user) {
        return cb(null, false, req.flash('loginMessage', 'No user found'));
      }
      if (user.password != password) {
        return cb(null, false, req.flash('loginMessage', 'Wrong password'));
      }

      return cb(null, user);
    });
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findOne({ _id: db.ObjectId(id) }, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var setupVariables = function() {
    //  Set the environment variables we need.
    if (typeof ipaddress === "undefined") {
        //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
        //  allows us to run/test the app locally.
        console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
        ipaddress = "127.0.0.1";
    };
};

/**
 *  Initialize the server (express) and create the routes and register
 *  the handlers.
 */
initializeServer = function() {
    app.set('views', __dirname+'/views');
    app.set('view engine', 'ejs');

    app.use(morgan('dev'));

    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({
      secret: 'yaassss study',
      resave: false,
      saveUninitialized: true
    }));
    app.use(flash());

    // Initialize Passport and restore authentication state, if any, from the
    // session.
    app.use(passport.initialize());
    app.use(passport.session());


    app.use('/index', require('./routes/index')(passport));
    /*app.get('/index', function(req, res) {
      res.render('index');
    });*/

    app.use('/chat', require('./routes/chat')(passport));
    /*app.get('/chat', function(req, res) {
      res.render('chat');
   });*/

   app.use('/profile', require('./routes/profile')(passport));
    /*app.get('/profile', function(req, res) {
      res.render('profile');
   });*/
};

var initialize = function() {
   setupVariables();
   initializeServer();
};

/**
 *  Start the server (starts up the sample application).
 */
var start = function() {
    //  Start the app on the specific interface (and port).
    app.listen(port, ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
      Date(Date.now() ), ipaddress, port);
    });
};

initialize();
start();

module.exports = app;
