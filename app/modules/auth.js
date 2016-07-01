// Handles requests in regard to authentication

var auth = this;

// Dependencies
var db = require('../dbAccess');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var secret = "fjsljfDsffERW1231597RoiuvoDFA2";

// Returns data of the current session
exports.getLoginStatus = function (req, res) {
	var result = {
		logedin: false,
		username: "",
		nickname: "",
		facebook_id: "",
		userlevel: ""
	};

	if(req.session.user_id !== undefined) {
		result.logedin = true;
		result.username = req.session.username;
		result.nickname = req.session.nickname;
		result.facebook_id = req.session.facebook_id;
		result.userlevel = req.session.userlevel;
	}
	
	res.json(result);
}

// Login by username and password
exports.login = function (req, res) {
	var result = {
		logedin: false,
		username: "",
		nickname: "",
		socialMedia: ""
	};

	if (req.body.username !== undefined && req.body.password !== undefined) {
		
		db.db().collection('users').findOne(req.body , function(err , user){
		
			if (err) {
			
				console.log(err);
			
			} else if ( user !== null ) {
			
				req.session._id = user._id;
				req.session.user_id = user.user_id;
				req.session.username = user.username;
				req.session.userlevel = user.userlevel;
				req.session.nickname = user.nickname;

				result.logedin = true;
				result.username = user.username;
				result.nickname = user.nickname;
				result.userlevel = user.userlevel;
				
				res.json(result);
		
			} else {
		
				res.json(result);
		
			}
			
		});
	
	} else {
	
		res.json(result);
	
	}
}

exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/#login');
	res.end();
}

// Register an account by username and password
exports.register = function (req, res) {
	var formValues = req.body;	
	var errorMessage = [];
	var result = {};

	var fields = [
		'username',
		'nickname',
		'password'
	];

	for(var x in fields) {
		if(formValues[fields[x]] == undefined || formValues[fields[x]].toString().length == 0) {
			errorMessage.push(fields[x].charAt(0).toUpperCase() + fields[x].slice(1) + " is missing.");
		}
	}

	if(errorMessage.length == 0) {
		var combo = {
			'username': formValues.username
		};
		
		db.db().collection('users').findOne(combo , function (err , user) {		
			if (err) {
			
				console.log(err);

				errorMessage.push("Register is not available.");
			
			} else if (user && user.username) {

				errorMessage.push("The email address has been registered.");
						
			}

			if(errorMessage.length == 0) {
				var user = {
					"username": formValues.username, 
				  	"password": formValues.password,
				  	"nickname": formValues.nickname,
				 	"mobile": formValues.mobile, 
				 	"userlevel": 2
				};

				generateUserId(8, 2, function (user_id) {
					user.user_id = user_id;

					db.db().collection('users').update(
						{"username": formValues.username}
						, user
						, {upsert: true} 
					);

					sendRegisterSuccessfulEmail(user);					
				});
			}

			result.errorMessage = errorMessage;
			result.success = errorMessage.length == 0;
			res.json(result);
		});	
	}
}

exports.registerFacebook = function (req, res) {
	var formValues = req.body;
	var errorMessage = [];
	var result = {};

	var fields = [
		'username',
		'nickname',
		'facebook_id'
	];

	for(var x in fields) {
		if(formValues[fields[x]] == undefined || formValues[fields[x]].toString().length == 0) {
			errorMessage.push(fields[x].charAt(0).toUpperCase() + fields[x].slice(1) + " is missing.");
		}
	}

	if(errorMessage.length == 0) {
		var combo = {'facebook_id': formValues.facebook_id};
		
		db.db().collection('users').findOne(combo , function(err , user){
			
			if (err) {
			
				console.log(err);

				errorMessage.push("Register is not available.");
			
			} else if ( user && user.username ) {
				facebookLogin(req, function (result) {
					res.json(result);
				});						
			}

			if(errorMessage.length == 0 && !user) {
				var combo = {'username': formValues.username};

				db.db().collection('users').findOne(combo , function(err , user){

					if(err) {
						console.log(err);

						errorMessage.push("Register is not available.");
					} else if ( user && user.username ) {
						// TODO Combine account with facebook_id					
					}				

					if(errorMessage.length == 0 && !user) {
						generateUserId(8,2, function (user_id) {
							var user =  { 
								"username": formValues.username,
							  	"nickname": formValues.nickname,
							  	"facebook_id": formValues.facebook_id,
							  	"user_id": user_id, 
							  	"userlevel": 2
							};

							user_id = user_id;

							db.db().collection('users').update(
								combo,
								user,
								{ upsert: true 
								}, function () {
									facebookLogin(req, function (result) {
										res.json(result);
									});
								} 
							);

							sendRegisterSuccessfulEmail(user);					
						});
					}
				});
			}

			if(errorMessage.length > 0) {
				result.errorMessage = errorMessage;
				result.success = errorMessage.length == 0;
				res.json(result);
			}
		});	
	}
}

exports.loginFacebook = function (req, res) {
	var result = {
		logedin: false,
		username: '',
		facebook_id: '',
		userlevel: '',
		nickname: ''
	};

	if (req.body.facebook_id !== undefined) {		
		facebookLogin(req, function (response) {
			res.json(response);
		});	
	} else {	
		res.json(result);	
	}
}

exports.forgotPassword = function (req, res) {
	var result = {
		success: false,
		message: ''
	};

	if(req.body.username !== undefined) {
		var combo = {username: req.body.username};

		db.db().collection('users').findOne(combo , function(err , user){
			if(err) {
				console.log(err);
			} else if(user && user.user_id) {
				var cipher = crypto.createCipher('aes256', secret);
				var encryptedId = cipher.update(user.user_id, 'utf-8', 'hex') + cipher.final('hex');
				var token = '';

				// Generate a token of 9 digits
				for(var i = 0; i < 9; i++) {
			        token += (parseInt(Math.random() * (secret.length)) % 10).toString() ;
			    }

			    db.db().collection('users').update(
					combo
					, {$set: {
						token: token,
						token_date: new Date(),
						locked: true
					}}
					, {upsert: false} 
					, function (err, response) {
						if(response.ok) {
							sendResetPasswordEmail(user.username, encryptedId, token, req.headers.host);
							
							result.success = true;
							result.status = "ok";
							result.message = "An email has been sent to " + user.username + ". \
												Please check the inbox and use the link provided to reset the password.";
							res.json(result);
						} else {
							result.status = "failed";
							result.message = "Unexpected error. Please try again later."
							res.json(result);
						}
					} 
				);
			} else {
				result.status = 'not_found';
				result.message = 'We don\'t recognise this email address. Please try again.';
				res.json(result);
			}
		});
	} else {
		result.status = 'invalid';
		result.message = 'Something is wrong.';
		res.json(result);
	}
}

exports.resetPassword = function (req, res) {
	var result = {
		success: false,
		status: '',
		message: ''
	};

	if(req.body.user && req.body.token && req.body.password) {
		var decipher = crypto.createDecipher('aes256', secret);
		var decryptedId = decipher.update(req.body.user, 'hex', 'utf8') + decipher.final('utf8');

		var combo = {
			user_id: decryptedId
			, token: req.body.token
		};

		db.db().collection('users').findOne(combo , function(err , user){
			if(err) {
				console.log(err);
			} else if(user && user.user_id) {
				db.db().collection('users').update(
					combo
					, {$set: {
						token: '',
						token_date: '',
						locked: false,
						password: req.body.password
					}}
					, { upsert: false} 
					, function (err, response) {
						if(response.ok) {							
							result.success = true;
							result.status = 'ok';
							res.json(result);
						} else {
							result.status = 'falied';
							result.message = 'Cannot reset your password now. Please try again later.';
							res.json(result);
						}
					} 
				);
			} else {
				result.status = 'not_found';
				result.message = 'The token is invalid. Please try resetting your password again.';
				res.json(result);
			}
		});
	} else {
		result.status = 'invalid';
		result.message = 'Something is wrong.';
		res.json(result);
	}
}

function facebookLogin (req, callback) {
	var result = {
		logedin: false,
		username: '',
		facebook_id: '',
		userlevel: '',
		nickname: ''
	};

	if (req.body.facebook_id !== undefined) {
		
		var combo = {
			facebook_id: req.body.facebook_id 
		}

		db.db().collection('users').findOne(combo , function(err , user){

			if (err) {
			
				console.log(err);
			
			} else if ( user !== null ) {
				
				req.session._id = user._id;
				req.session.user_id = user.user_id;
				req.session.username = user.username;
				req.session.userlevel = user.userlevel;
				req.session.nickname = user.nickname;
				req.session.facebook_id = user.facebook_id;
				
				result.logedin = true;
				result.username = user.username;
				result.userlevel = user.userlevel;
				result.nickname = user.nickname;
				result.facebook_id = user.facebook_id;

				callback(result);
		
			} else {

				callback(result);
		
			}
			
		});
	
	} else {
	
		callback(result);
	
	}
}

function sendRegisterSuccessfulEmail(user) {
	var message = "<h5>Congrats! You have created a new account.</h5>" +
				  "<p>Username: <b>" + user.username + "</b></p>";

	var title = "Congrats! New Account on Meansilo";

	sendEmail(user.username, title, message);
}

function sendResetPasswordEmail(username, encryptedId, token, baseUrl) {
	var url = 'http://' + baseUrl + '/#/resetpassword/' + encryptedId + '/' + token;

	var message = "<h5>Click the link below to reset your password.</h5>" +
				  "<p><b>Click here: </b><a href=" + url + ">" + url + "</a></p>";

	var title = "Reset Password on Meansilo";

	sendEmail(username, title, message);
}

function sendEmail (email, title, message) {
	var smtpConfig = {
	    host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: '',
	        pass: ''
	    }
	};

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport(smtpConfig);

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"Meansilo Testing" <foo@blurdybloop.com>', // sender address
	    to: email, // list of receivers
	    subject: title, // Subject line
	    text: 'Hello world 🐴', // plaintext body
	    html: message // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    } else {
	    	console.log('Message sent: ' + info.response);
	    }
	});
}

function generateUserId(count, userLevel, callback) {
    var str = '';
    var _sym = secret;
    var combo = {'user_id': ''};

    for(var i = 0; i < count; i++) {
        str += (parseInt(Math.random() * (_sym.length)) % 10).toString() ;
    }

    if(userLevel == 1)
    	combo.user_id = 'admin' + str;

    if(userLevel == 2)
    	combo.user_id = 'gp' + str;

    db.db().collection('users').findOne(combo , function(err , user){
    	if(err) {
    		console.log(err);
    	} else if(user && user.user_id) {
    		generate(count, userLevel, callback);
    	}

    	if(!(user && user.user_id)) {
    		callback(combo.user_id);
    	}
    });
}