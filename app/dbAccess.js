var mongojs = require('mongojs');

var adminUsername = "admin";
var adminPassword = "password";
var adminUserId = "admin12345678"

var mongoHostname = "localhost";
var mongoPort = 27017;
var mongoDBName = "meansilodb";
var mongoSecret = "34680346e41c11e597309a79f06e9478";

module.exports = {
	db: function () {
		return mongojs(mongoHostname + ':' + mongoPort + '/' + mongoDBName, ['mycollection']);
	},
	mongoHostname: function () {
		return mongoHostname;
	},
	mongoPort: function () {
		return mongoPort;
	},
	mongoDBName: function () {
		return mongoDBName;
	},
	mongoSecret: function () {
		return mongoSecret;
	},
	initialise: function () {

		var db = mongojs(mongoHostname + ':' + mongoPort + '/' + mongoDBName, ['mycollection']);

		// Clear All Data in Collection 'users'
		db.collection('users').drop(function () {

			// Set Collection Indexes
			db.collection('users').createIndex({user_id: 1});
			db.collection('users').createIndex({username: 1});
			db.collection('users').createIndex({facebook_id: 1});

			// Create admin
			db.collection('users').find({ "username" : adminUsername }, function (err , user) {
				if (err) {
					console.log(err);	
				} else {
					if (user.length == 0) {
						console.log('creating admin user : ' + adminUsername );
						db.collection('users').update(
							{ "username": adminUsername }
							, { "user_id": adminUserId,
								"username": adminUsername, 
							    "password": adminPassword, 
							    "userlevel": 1 }
							, { upsert: true } 
						);
					}
				}
			});
		});		
	}
}