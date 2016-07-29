var email = this;

// Dependencies
var setting = require('./setting');
var nodemailer = require('nodemailer');

email.isInitialised = false;
email.settings = {};
email.smtpConfig = {
	    host: '',
	    port: 0,
	    secure: false, // use SSL
	    auth: {
	        user: '',
	        pass: ''
	    }
	};

email.initialise = function () {
	setting.getEmailSettings(function (settings) {
		email.settings = settings;
		email.smtpConfig.host = settings.EMAIL_HOST.setting_value;
		email.smtpConfig.port = settings.EMAIL_PORT.setting_value;
		email.smtpConfig.secure = settings.EMAIL_SECURE.setting_value;
		email.smtpConfig.auth.user = settings.EMAIL_ADDRESS.setting_value;
		email.smtpConfig.auth.pass = settings.EMAIL_PASSWORD.setting_value;

		email.isInitialised = true;
	});
}

email.sendEmail = function (emailAddress, title, message, text) {
	var interval = setInterval(function () {
		if(email.isInitialised && email.settings.EMAIL_ENABLED) {
			clearInterval(interval);

			// create reusable transporter object using the default SMTP transport
			var transporter = nodemailer.createTransport(email.smtpConfig);

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: '"Meansilo Testing" <' + email.smtpConfig.auth.user + '>', // sender address
			    to: emailAddress, // list of receivers
			    subject: title, // Subject line
			    text: text, // plaintext body
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
	}, 1000);
}

email.initialise();