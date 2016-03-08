"use strict";

var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('myApp', ['myApp']);
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ObjectId = require('mongodb').ObjectID;

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

app.use(express.static(__dirname + "/app/public"));

app.use(function (req, res, next) {
	
	var renderPages = ['/index']
		, hour = 3600000
		, validHosts = ['localhost','127.0.0.1'];
	
	// only allow connections from valid hosts.
	
	if ( validHosts.indexOf(req.headers.host.split(':')[0]) < 0 ) {
		
		res.status(404);
		res.end();
		
	} else {
	
		req.session.cookie.expires = new Date(Date.now() + hour);
		req.session.cookie.maxAge = hour;
		
		if (req.session.username === undefined) {
		
			if( req.originalUrl !== '/login' && req.originalUrl.indexOf('/download/') !== 0 !== 0 && req.originalUrl.indexOf('/images/') !== 0) {
				res.redirect('/login');
				res.end();
			} else {
				next();
			}
			
		} else if ( req.originalUrl === '/' ) {
		
			res.redirect('/home');
		
		} else {
		
			// we are logged in, so we can look in private for static files.
			
			if (renderPages.indexOf(req.originalUrl) >= 0) {
				app.engine('html', require('ejs').renderFile);
				res.render(req.originalUrl.slice( 1 ) + '.html' , {
					jsFile : '/controllers' + req.originalUrl + '.js'
					, activePage : req.originalUrl.slice( 1 )
				});
			} else {
				app.use(express.static(__dirname + "/app/private"));
			}
			
			next();
		
		}
	
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

app.get('/login', function(req , res) {

	fs.readFile('./app/public/login.html', function(error, content) {
		if (error) {
			res.writeHead(500);
			res.end();
		}
		else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(content, 'UTF-8');
		}
	});

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

app.listen(8888);

console.log('Node.JS Server Started (express!)');

var backgroundProcess = setInterval(function() {
  
	console.log('backgroundProcess');
	
}, 10000);