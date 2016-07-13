require('dotenv').load();

const express = require('express');
const app = express();
const session = require('cookie-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const knex = require("./db/knex");

app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'pug');

app.use(session({
  name: 'session',
  keys: [process.env['SECRET']]
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serializeUser')
  //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from linkedin
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //here is where you will go to the database and get the user each time from it's id, after you set up your db
  done(null, obj);
});

passport.use(new RedditStrategy({
    clientID: process.env['REDDIT_CONSUMER_KEY'],
    clientSecret: process.env['REDDIT_CONSUMER_SECRET'],
    callbackURL: "http://localhost:3000/auth/reddit/callback",
    scope: ['identity', 'edit', 'flair', 'history', 'modconfig',
            'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits',
            'privatemessages', 'read', 'report', 'save', 'submit', 
            'subscribe', 'vote', 'wikiedit', 'wikiread']
  },
  function(accessToken, refreshToken, profile, done) {
    knex('users').where({redditId: profile.id}).first().then((user) =>{
      if (!user) {
        knex('users').insert({redditId: profile.id}).then(function(user){
          user.access_token = accessToken;
          return done(null, user);
        });
      }
      else {
        user.access_token = accessToken;
        return done(null, user);
      }
    })
  }
));

app.use('/auth', require('./routes/auth'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('*', function(req, res) {
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Listening on port 3000...")
});