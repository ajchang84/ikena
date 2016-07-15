const express = require('express');
const router = express.Router();
const session = require('cookie-session');
const passport = require('passport');
// const request = require("request");

const crypto = require('crypto');

router.get('/reddit', function(req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent',
  })(req, res, next);
});

router.get('/reddit/callback', function(req, res, next){
  // var username = process.env['REDDIT_CONSUMER_KEY']
  // var password = process.env['REDDIT_CONSUMER_SECRET']
  // var options = {
  //   uri: 'https://ssl.reddit.com/api/v1/access_token',
  //   method: 'POST',
  //   headers: {
  //     'Authorization' : "Basic " + new Buffer(username + ":" + password, "utf8").toString("base64")
  //   },
  //   form: {
  //     redirect_uri: 'http://localhost:3000/auth/reddit/callback',
  //     code: req.query.code,
  //     grant_type: 'authorization_code'
  //   }
  // };

  // request(options, function(error, response, body) {
  //   console.log(req.query.code)
  //   console.log(options)
  //   console.log(body)
  // });

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

router.get('/success', function(req, res) {
  res.send('success')
})

router.get('/token', function(req,res){
  res.json(req.user)
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;