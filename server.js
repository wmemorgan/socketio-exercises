'use strict';
require('dotenv').load();

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const cookieParser= require('cookie-parser')
const app         = express();
const http        = require('http').Server(app);
const sessionStore= new session.MemoryStore();

const io = require('socket.io')(http)


fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));


mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, conn) => {
  
  const db = conn.db("wme-practicedb")
    if(err) console.log('Database error: ' + err);
    else { console.log(`Connected to: ${process.env.DATABASE}`)}
  
    auth(app, db);
    routes(app, db);
      
    http.listen(process.env.PORT || 3000);

  
    //start socket.io code
    var currentUsers = 0  
    io.on('connection', socket => {
      console.log('A user has connected')
      currentUsers++
      io.emit(`user count: ${currentUsers}`)
    })
  

    //end socket.io code
  
  
});
