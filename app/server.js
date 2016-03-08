"use strict";

var express = require('express');
var app = express();
var crypto = require('crypto');
var mongojs = require('mongojs');
var db = mongojs('myApp', ['myApp']);
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ObjectId = require('mongodb').ObjectID;
var appPort = 8888;
var adminUserObj = { "username" : "admin" , "password" : "password" };
var md5sum = crypto.createHash('md5');
var bodyParser = require('body-parser');

// customjs

app.use(session({
	secret: '34680346e41c11e597309a79f06e9478',
	resave: true,
    saveUninitialized: true,
    rolling: true,
    maxAge: 60000,
	store: new MongoStore({
		url: 'mongodb://localhost/',
		db: 'myApp',
		host: 'localhost',
		port: 27017
	})
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
	
	var renderPublicPages = ['/index','/login']
		, renderPrivatePages = ['/user']
		, hour = 3600000
		, validHosts = ['localhost','127.0.0.1']
		, isLoggedIn = (req.session.username !== undefined);
	
	// only allow connections from valid hosts.
	
	if ( validHosts.indexOf(req.headers.host.split(':')[0]) < 0 ) {
		
		res.status(404);
		res.end();
		
	} else {
		
		// redirect if we land at the root

		if ( req.originalUrl === '/' ) {
		
			if (isLoggedIn) {
				res.redirect('/user');
			} else {
				res.redirect('/login');
			}
		
		}

		req.session.cookie.expires = new Date(Date.now() + hour);
		req.session.cookie.maxAge = hour;

		// make public static files available

		app.use(express.static(__dirname + "/public"));
		
		if (isLoggedIn) {
		
			app.use(express.static(__dirname + "/private"));

		}
		
		// privte pages will override public, if we are logged in

		if (isLoggedIn && renderPrivatePages.indexOf(req.originalUrl) >= 0) {
		
			app.engine('html', require('ejs').renderFile);
			res.render(req.originalUrl.slice( 1 ) + '.html' , {
				jsFile : __dirname + '/private/controllers' + req.originalUrl + '.js'
				, activePage : req.originalUrl.slice( 1 )
			});
		
		} else if (renderPublicPages.indexOf(req.originalUrl) >= 0) {
		
			app.engine('html', require('ejs').renderFile);
			res.render(req.originalUrl.slice( 1 ) + '.html' , {
				jsFile : __dirname + '/public/controllers' + req.originalUrl + '.js'
				, activePage : req.originalUrl.slice( 1 )
			});
		
		} else {

			fs.readFile('./app/public/' + req.originalUrl.slice( 1 ) + '.html', function(error, content) {
				if (error) {
					res.writeHead(500);
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.end(content, 'UTF-8');
				}
			});
		}
			
		next();
	
	}
	
});

app.post('/login' , function(req , res) {
	
	if (req.body.username !== undefined && req.body.password !== undefined) {
	
		db.collection('users').findOne(req.body , function(err , user){
		
			if (err) {
			
				console.log(err);
			
			} else if ( user !== null ) {
			
				req.session._id = user._id;
				req.session.username = user.username;
				
				res.json({logedin: true});
		
			} else {
		
				res.json({logedin: false});
		
			}
			
		});
	
	} else {
	
		res.json({logedin: false});
	
	}

});

app.get('/logout' , function(req , res) {
	
	req.session.destroy();

	res.redirect('/login');
	res.end();

});

app.post('/logout' , function(req , res) {

	req.session.destroy();

	res.json({logout: true});

});

app.listen(appPort);

// Insert the admin, or reset its password

db.collection('users').update(adminUserObj, adminUserObj , { upsert: true } );


console.log('Node.JS Server Started (express!) running on port: ' + appPort);

var backgroundProcess = setInterval(function() {
  
	console.log('backgroundProcess');
	
}, 10000);