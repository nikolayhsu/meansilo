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

		db.collection('students').createIndex({stud_code: 1});

		db.collection('yeargroups').createIndex({year_grp: 1});

		for(var i = -3; i <= 12; i++) {
			var yeargroup = {
				'year_grp': i,
				'year_grp_desc': i
			};

			var combo = {
				'year_grp': i
			};

			db.collection('yeargroups').update(
				combo,
				yeargroup,
				{ upsert: true 
				}
			);
		}

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