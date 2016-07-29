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
	initialise: function (callback) {

		var db = mongojs(mongoHostname + ':' + mongoPort + '/' + mongoDBName, ['mycollection']);

		db.collection('setting').createIndex({setting_id: 1});

		db.collection('setting').findOne({ "setting_id" : "FB_ENABLED" }, function (err , setting) {
			if(err) {
				console.log(err);
			} else if (!(setting && setting.setting_id)) {
				var settingData = [
					{
						"setting_id": "FB_ENABLED",
						"setting_value": false,
						"setting_desc": "Enable/Disable Facebook Login",
						"setting_group": "FACEBOOK"
					}, 
					{
						"setting_id": "FB_APP_ID",
						"setting_value": "",
						"setting_desc": "Facebook Application Id",
						"setting_group": "FACEBOOK"
					}, 
					{
						"setting_id": "EMAIL_ENABLED",
						"setting_value": false,
						"setting_desc": "Enable/Disable System Email",
						"setting_group": "SYSTEM_EMAIL"
					},
					{
						"setting_id": "EMAIL_HOST",
						"setting_value": "",
						"setting_desc": "System Email Host",
						"setting_group": "SYSTEM_EMAIL"
					}, 
					{
						"setting_id": "EMAIL_PORT",
						"setting_value": "",
						"setting_desc": "System Email Port",
						"setting_group": "SYSTEM_EMAIL"
					},
					{
						"setting_id": "EMAIL_SECURE",
						"setting_value": false,
						"setting_desc": "System Email Secure Mode",
						"setting_group": "SYSTEM_EMAIL"
					},  
					{
						"setting_id": "EMAIL_ADDRESS",
						"setting_value": "",
						"setting_desc": "System Email Address",
						"setting_group": "SYSTEM_EMAIL"
					},
					{
						"setting_id": "EMAIL_PASSWORD",
						"setting_value": "",
						"setting_desc": "System Email Password",
						"setting_group": "SYSTEM_EMAIL"
					}
				];

				db.collection('setting').insert(
					settingData
				);
			}
		});

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