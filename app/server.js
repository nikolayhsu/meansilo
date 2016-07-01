"use strict";

// App Settings

var appName = "My New App"
var appHostname = "0.0.0.0";
var appPort = 8888;

// Modules

var express = require('express');
var app = express();
var crypto = require('crypto');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ObjectId = require('mongodb').ObjectID;
var md5sum = crypto.createHash('md5');
var bodyParser = require('body-parser');
var path_module = require('path');
var mailer = require('nodemailer');

// Customised Modules

var db = require('./dbAccess');
var auth = require('./modules/auth');

db.initialise();

app.use(session({
	secret: db.mongoSecret(),
	resave: true,
    saveUninitialized: true,
    rolling: true,
    maxAge: 60000,
	store: new MongoStore({
		url: 'mongodb://'+ db.mongoHostname() + '/',
		db: db.mongoDBName(),
		host: db.mongoHostname(),
		port: db.mongoPort()
	})
}));

process.on('uncaughtException', function (err) {
    if (err) { 
    	console.log("============ An Error Occurred =============");
    	console.log(err, err.stack);
    }
});

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());

// Static Files

app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
app.use("/views", express.static(__dirname + '/views'));
app.use("/app", express.static(__dirname + '/app'));
app.use("/image", express.static(__dirname + '/image'));

// Request Handling

app.get('/logout', auth.logout);
app.get('/getLoginStatus', auth.getLoginStatus);

app.post('/login', function (req, res, next) {
	if(req.body.facebook_id)
		auth.loginFacebook(req, res);
	else
		auth.login(req, res);
});

app.post('/register', function (req, res, next) {
	if(req.body.facebook_id)
		auth.registerFacebook(req, res);
	else
		auth.register(req, res);
});

app.post('/forgotpassword', auth.forgotPassword);
app.post('/resetpassword', auth.resetPassword);

app.get('/', function (req, res, next) {
	var isLoggedIn = (req.session.user_id !== undefined);
	console.log(req.session.user_id);
	var renderObj =  {
		dirname : __dirname
		, loggedIn : isLoggedIn
		, username : req.session.username
		, userlevel : req.session.userlevel
		, nickname : req.session.nickname
		, appName : appName
	};

	res.render(__dirname + '/index.html', renderObj);
});

app.get('*', function (req, res, next) {
	res.redirect('/#404');
	res.end();
});

app.listen(appPort, appHostname);

console.log('Node.JS Server Started (express!) running on port: ' + appPort);

var backgroundProcess = setInterval(function() {
  
	// console.log('backgroundProcess');
	
}, 10000);