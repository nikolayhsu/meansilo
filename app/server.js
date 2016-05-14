"use strict";

// App Settings

var appName = "My New App"
var adminUsername = "admin";
var adminPassword = "password";
var appHostname = "localhost";
var appPort = 8888;
var mongoHostname = "localhost";
var mongoPort = 27017;
var mongoDBName = "meansilodb";
var mongoSecret = "34680346e41c11e597309a79f06e9478";

// Modules

var express = require('express');
var app = express();
var crypto = require('crypto');
var mongojs = require('mongojs');
var db = mongojs(mongoHostname + ':' + mongoPort + '/' + mongoDBName, ['mycollection']);
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ObjectId = require('mongodb').ObjectID;
var md5sum = crypto.createHash('md5');
var bodyParser = require('body-parser');
var path_module = require('path');

app.use(session({
	secret: mongoSecret,
	resave: true,
    saveUninitialized: true,
    rolling: true,
    maxAge: 60000,
	store: new MongoStore({
		url: 'mongodb://'+mongoHostname+'/',
		db: mongoDBName,
		host: mongoHostname,
		port: mongoPort
	})
}));

// Insert the admin, or reset its password

db.collection('users').update({ "username" : adminUsername }
							, { "username" : adminUsername , "password" : adminPassword , "userlevel" : 1 }
							, { upsert: true } 
							);


app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);

app.use("/admin", function(req, res, next){
	
	if (req.session.username === undefined) {
		
		var fileNameParts = req.originalUrl.split('/');
		var fileName = fileNameParts[fileNameParts.length - 1];

		if (fileName.indexOf(".") > 1) { 
			res.writeHead(401);
			res.end('401: Unauthorized', 'UTF-8');
		} else {
			res.redirect('/login');
		}

	} else {
		app.use(express.static(__dirname + "/admin"));
		next();
	}

});

app.use(function (req, res, next) {

	var isLoggedIn = (req.session.username !== undefined);

	// look in the public folder for static files

	req.app.use(express.static(__dirname + "/public"));

	// if we are logged in, allow static files in the admin folder

	if (isLoggedIn) {
		req.app.use("/admin" , express.static(__dirname + "/admin"));
	}

	if (req.originalUrl == "/") {
		res.redirect("/home");
	}

	next();
	
});

app.get(['/:name','/:dir/:name'], function (req, res, next) {

	var fileNameSplit = req.params.name.split('.');
	var fileName = ( req.params.name !== undefined ? req.params.name : "home" ) + ".html";
	var dirName = req.params.dir !== undefined ? req.params.dir : "public";
	var isLoggedIn = (req.session.username !== undefined);
	
	if ( dirName === "admin" && req.params.name === "users" && req.session.userlevel > 2 ) {

		res.writeHead(401);
		res.end('401: Unauthorized', 'UTF-8');

	} else if (( req.params.name === "login" && isLoggedIn) || req.params.name === "admin" ) {

		res.redirect('/admin/home');
		res.end();

	} else if (req.params.name === "logout") {
	
		req.session.destroy();
		res.redirect('/login');
		res.end();
	
	} else {

		// we are only converting pretty URLs to .html

		if (fileNameSplit.length === 1) { 

			res.render(__dirname + '/' + dirName + '/' + fileName , {
				jsFile : '/controllers/' + req.params.name + '.js'
				, dirname : __dirname
				, loggedIn : isLoggedIn
				, username : req.session.username
				, userlevel : req.session.userlevel
				, appName : appName
				, path : '/' + dirName + '/' + req.params.name
			});

		} else if (fileNameSplit.length > 1 && fileNameSplit[1] === "html") {
			
			// redirect .html to pretty urls

			if (dirName !== undefined && dirName !== "public") {

				res.redirect("/" + dirName + "/" + fileNameSplit[0]);

			} else {

				res.redirect(301, "/" + fileNameSplit[0]);

			}

		} else {
			
			// move on to deliver static files
			next();

		}

	}

});

// Dynamic Module Loding ( Look maa, no config )

function loadModules(path) {
	fs.lstat(path, function(err, stat) {
		if (stat.isDirectory()) {
			fs.readdir(path, function(err, files) {
				var f, l = files.length;
				for (var i = 0; i < l; i++) {
					f = path_module.join(path, files[i]);
					loadModules(f);
				}
			});
		} else {
			require(path)(app, db);
		}
	});
}

loadModules(path_module.join(__dirname, 'public' , 'modules'));
loadModules(path_module.join(__dirname, 'admin' , 'modules'));

app.listen(appPort, appHostname);

console.log('Node.JS Server Started (express!) running on port: ' + appPort);

var backgroundProcess = setInterval(function() {
  
	// console.log('backgroundProcess');
	
}, 10000);