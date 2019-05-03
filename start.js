const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const easyArray = require("./easyArray.js");
const saltRounds = 10;
const secretFile = require("./secretKey.json");

const connection = mysql.createConnection({
      host: "75.129.224.201",
      port: "3306",
      user: "dev",
      // socketPath: "/var/run/mysqld/mysqld.sock",
      password: process.env.MYSQL_PASSWORD,
      database: "pms"
});

connection.on("connect", function(error) {
  if(error) {
    console.error(error.message);
    return;
  }
  console.log("Logged into pms DB...");
});



app.use(express.static('public'));
app.use(session({secret: secretFile.secret}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function(request, response){
    response.send("test")
});

const listener = app.listen(35454, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
