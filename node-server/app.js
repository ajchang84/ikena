require('dotenv').load();

const express = require('express');
const app = express();
const session = require('cookie-session');
const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const knex = require("./db/knex");
// const request = require("request");
var Router = require('react-router').Router
var Route = require('react-router').Route
var hashHistory = require('react-router').hashHistory
var Link = require('react-router').Link

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
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
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
    callbackURL: "https://ikena.herokuapp.com/auth/reddit/callback",
    scope: ['identity', 'edit', 'flair', 'history', 'modconfig',
            'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits',
            'privatemessages', 'read', 'report', 'save', 'submit', 
            'subscribe', 'vote', 'wikiedit', 'wikiread']
  },
  function(accessToken, refreshToken, profile, done) {
  // console.log(accessToken)
  // var options = {
  //   uri: 'https://oauth.reddit.com/api/v1/me',
  //   method: 'GET',
  //   headers: {
  //     'Authorization' : "bearer " + accessToken
  //   },
  // };

  // request(options, function(error, response, body) {
  //   debugger;
  //   console.log(body)
  // });

    // knex('users').where({redditId: profile.id}).first().then((user) =>{
    //   if (!user) {
    //     knex('users').insert({redditId: profile.id}).then(function(user){
    //       user.access_token = accessToken;
    //       user.name = profile.name;
    //       return done(null, user);
    //     });
    //   }
    //   else {
        user.access_token = accessToken;
        user.name = profile.name;
        return done(null, user);
    //   }
    // })
  }
));

app.use('/auth', require('./routes/auth'));

app.get('/', function(req, res) {
  res.render('index', {user: req.user});
});

app.get('/api/isAuth', function(req, res) {
  if (req.isAuthenticated()) res.json( {'isAuth': true, 'profile': req.user} );
  else res.json( {'isAuth': false} )
})

app.get('/api/profile', function(req, res) {
  if (req.isAuthenticated()) res.json( {'profile': req.user} );
})

app.get('*', function(req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port 3000...")
});