const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const session = require("express-session");
const easyArray = require("./easyArray.js");
const saltRounds = 10;
const secretFile = require("./secretKey.json");
const axios = require("axios");
const queryString = require("querystring");

var db;
MongoClient.connect("mongodb://97.90.112.19:27017", { useNewUrlParser:true }, (error, database) => {
  if(error) {
    throw error;
  }
  db = database.db("ubersine");
  console.log("Connected to database...");
});


app.use(express.static('public'));
app.use(session({
    secret: secretFile.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded";

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login', function(request, response){
  response.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=540394344578940948&redirect_uri=http%3A%2F%2F75.129.224.201%3A35454%2Flogin%2Ftoken&response_type=code&scope=identify%20email`);
});

app.get('/login/token', function(request, response){
  let code = request.query.code;
  let data = queryString.stringify({
    client_id:"540394344578940948",
    client_secret:secretFile.discord_secret,
    grant_type:"authorization_code",
    code:code,
    redirect_uri:"http://75.129.224.201:35454/login/token",
    scope:"identify email"
  });
  let tokenRequest = {
    url:"https://discordapp.com/api/oauth2/token",
    method:"post",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    data:data
  };
  axios(tokenRequest)
  .then(res => {
    let token = res.data.access_token;
    axios({
      url:"https://discordapp.com/api/users/@me",
      method:"get",
      headers:{
        Authorization:"Bearer " + token
      }
    })
    .then(res => {
      let id = res.data.id;
      let query = { id:id };
      db.collection("users").findOne(query, (error, user) => {
        if(error) throw error;
        if(!user) {
          query = { id:id,token:token };
          db.collection("users").insertOne(query, (error, result) => {
            if(error) throw error;
            // user has been created
          });
        }
      });
    })
    .catch(error => {});
  })
  .catch(error => {
    console.error(error.response);
  });
});

const listener = app.listen(35454, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
