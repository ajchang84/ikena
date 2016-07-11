const express = require('express');
const app = express();

app.use(express.static(__dirname + '/../public'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('index');
});

app.get('login', function(req, res) {
  
})

app.get('*', function(req, res) {
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Listening on port 3000...")
});