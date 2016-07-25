// Reddit OAuth
const express = require('express');
const router = express.Router();
const session = require('cookie-session');
const passport = require('passport');

const crypto = require('crypto');

router.get('/reddit', function(req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent',
  })(req, res, next);
});

router.get('/reddit/callback', function(req, res, next){
  if (req.query.state == req.session.state){
    passport.authenticate('reddit', {
      successRedirect: '/',
      failureRedirect: '/fail'
    })(req, res, next);
  }
  else {
    next( new Error(403) );
  }
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;