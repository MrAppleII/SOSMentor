var express = require('express');
var router = express.Router();

module.exports = function(passport) {
  router.get('/', function (req, res) {
    res.render('index', { user: req.user });
  });

  router.get('/login', function (req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/chat',
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}
