/* TODO
  1. Move passport/session middleware to seperate file in helpers
  2. Move API routes to seperate file in routes
  3. Change HTTP verbs for upvoting and downvoting API calls
  4. Incorporate react router through node module, not through html script links
*/

const express = require('express');
const app = express();
const session = require('cookie-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const knex = require("./db/knex");
const request = require("request");

/* react router */

// var Router = require('react-router').Router
// var Route = require('react-router').Route
// var hashHistory = require('react-router').hashHistory
// var Link = require('react-router').Link

app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

if(process.env.NODE_ENV !== "production"){
  require('dotenv').load();
}

app.use(session({
  name: 'session',
  keys: [process.env['SECRET']]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// TODO: move to helpers
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new RedditStrategy({
    clientID: process.env['REDDIT_CONSUMER_KEY'],
    clientSecret: process.env['REDDIT_CONSUMER_SECRET'],
    callbackURL: "https://ikena.herokuapp.com/auth/reddit/callback",
    // callbackURL: "http://localhost:3000/auth/reddit/callback",
    scope: ['identity', 'history', 'read', 'vote']
  },
  function(accessToken, refreshToken, profile, done) {

    knex('users').where({redditId: profile.id}).first().then((user) =>{
      if (!user) {
        knex('users').insert({redditId: profile.id}).then(function(user){
          user.access_token = accessToken;
          user.name = profile.name;
          return done(null, user);
        });
      }
      else {
        user.access_token = accessToken;
        user.name = profile.name;
        return done(null, user);
      }
    })
  }
));
// end TODO: move to helpers

// routes
app.use('/auth', require('./routes/auth'));

// serve html at root
app.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

// TODO: move to routes
// check if user is authenticated
app.get('/api/isAuth', function(req, res) {
  if (req.isAuthenticated()) res.json( {'isAuth': true, 'profile': req.user} );
  else res.json( {'isAuth': false} )
})

// responds with properties on user session
app.get('/api/profile', function(req, res) {
  if (req.isAuthenticated()) res.json( {'profile': req.user} );
})

// responds with user voting history on posts
app.get('/api/history', function(req, res) {
  if (req.isAuthenticated()) {
    knex('users').join('posts', 'users.id', 'posts.user_id')
      .where('users.id', req.user.id)
      .then((posts) => {
        res.send(posts)
      })
  }
})

// TODO: change verb to PUT, inserts upvoted posts to database 
app.get('/api/upvote/:id', function(req, res){
  if (req.isAuthenticated()) {
    knex('posts').insert({'post':req.params.id, 'upvoted': true, 'user_id': req.user.id})
      .then((post) => {
        res.send(post)
      })
  }
})

// TODO: change verb to PATCH, updates upvoted status of posts in database
app.get('/api/upvoteupdate/:id', function(req, res){
  if (req.isAuthenticated()) {
    knex('posts').update({'upvoted': true}).where('posts.post', req.params.id)
      .then((post) => {
        res.send(post)
      })
  }
})

// TODO: change verb to PUT, inserts downvoted posts to database 
app.get('/api/downvote/:id', function(req, res){
  if (req.isAuthenticated()) {
    knex('posts').insert({'post':req.params.id, 'upvoted': false, 'user_id': req.user.id})
      .then((post) => {
        res.send(post)
      })
  }
})

// TODO: change verb to PATCH, updates downvoted status of posts in database
app.get('/api/downvoteupdate/:id', function(req, res){
  if (req.isAuthenticated()) {
    knex('posts').update({'upvoted': false}).where('posts.post', req.params.id)
      .then((post) => {
        res.send(post)
      })
  }
})
// end TODO: move to routes

// catch other routes
app.get('*', function(req, res) {
  res.redirect('/');
});

// listener
app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port 3000...")
});