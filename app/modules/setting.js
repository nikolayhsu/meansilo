// Handles requests in regard to authentication
var setup = this;

// Dependencies
var db = require('../dbAccess');

exports.setSetting = function (res, req) {
	var result = {
		status: 'OK'
	};

	if(!req.session.userlevel || req.session.userlevel > 1) {
		result.status = "ACCESS_DENIED";

		res.json(result);
	} else if (!(req.body.setting_id && req.body.setting_value)) {
		result.status = "INVALID";
	} else {
		var combo = {setting_id: req.body.setting_id};
		
		var params = {
			setting_id: req.body.setting_id,
			setting_value: req.body.setting_value,
			setting_desc: req.body.setting_desc
		};

		db.db().collection('setting').update(
			combo,
			params,
			{ upsert: true 
			}, function (err) {
				if(err) {
					result.status = "ERROR";
				}

				res.json(result);
			} 
		);
	}
}

exports.setSettings = function (req, res) {
	var result = {
		status: 'OK'
	};

	if(!req.session.userlevel || req.session.userlevel > 1) {
		result.status = "ACCESS_DENIED";

		res.json(result);
	} else if (!(req.body.settings && typeof req.body.settings == 'object')) {
		result.status = "INVALID";

		res.json(result);	
	} else {
		var settings = req.body.settings;

		for(var x in settings) {
			var combo = {setting_id: x};
			var params = {
				$set: {
					setting_value: settings[x].setting_value
				}
			};

			db.db().collection('setting').update(
				combo,
				params,
				{ upsert: false 
				}, function (err) {
					if(err) {
						result.status = "ERROR";
					}
				} 
			);
		}

		res.json(result);
	}
}

exports.getSetting = function (req, res) {
	var result = {
		status: 'OK'
	};

	if(req.body && req.body.setting_id) {
		var combo = {
			setting_id: req.body.setting_id
		};

		db.db().collection('setting').findOne(combo, function (err , setting){

			if (err) {
				
				console.log(err);
				result.status = "ERROR";
				res.json(result);

			} else if ( setting !== null ) {
				
				result.setting = setting;
				res.json(result);				
			} else {

				result.status = "NOT_FOUND";
				res.json(result);
			}			
		});
	} else {
		db.db().collection('setting').find(function (err , settings){

			if (err) {
				
				console.log(err);
				result.status = "ERROR";
				res.json(result);

			} else if ( settings !== null ) {
				var temp = {};

				for(var x in settings) {
					temp[settings[x].setting_id] = settings[x];
				}

				result.data = {};
				result.data.arrSettings = settings;
				result.data.strSettings = temp;

				res.json(result);				
			} else {

				result.status = "NOT_FOUND";

				res.json(result);
			}			
		});
	}
}

setup.getEmailSettings = function (callback) {
	var combo = {"setting_group": "SYSTEM_EMAIL"};

	db.db().collection('setting').find(combo, function (err , settings){
		if (err) {
			
			console.log(err);
			return false;

		} else if ( settings !== null ) {
			var temp = {};

			for(var x in settings) {
				temp[settings[x].setting_id] = settings[x];
			}

			if(callback)
				callback(temp);		
		} else {

			return false;
		}			
	});
}