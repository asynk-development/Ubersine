const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const easyArray = require("./easyArray.js");
const saltRounds = 10;
const secretFile = require("./secretKey.json");
const https = require("https");

const connection = mysql.createConnection({
      host: "75.129.224.201",
      port: "3306",
      user: "ubersine",
      password: secretFile.mysql_password,
      database: "ubersine"
});

connection.on("connect", function(error) {
  if(error) {
    console.error(error.message);
    return;
  }
  console.log("Logged into pms DB...");
});

app.use(express.static('public'));
app.use(session({
    secret: secretFile.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function(request, response){
  response.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=540394344578940948&redirect_uri=http%3A%2F%2F75.129.224.201%3A35454%2Flogin%2Ftoken&response_type=code&scope=identify%20email`)
});

app.get('/login/token', function(request, response){
  let token = request.url.split('=')[1];
  response.redirect("/landing")
});

const listener = app.listen(35454, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
