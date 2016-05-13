module.exports = function(app, db) {
    'use strict';
    
    app.post('/login' , function(req , res) {
		
		if (req.body.username !== undefined && req.body.password !== undefined) {
		
			db.collection('users').findOne(req.body , function(err , user){
			
				if (err) {
				
					console.log(err);
				
				} else if ( user !== null ) {
				
					req.session._id = user._id;
					req.session.username = user.username;
					req.session.userlevel = user.userlevel;
					
					res.json({logedin: true});
			
				} else {
			
					res.json({logedin: false});
			
				}
				
			});
		
		} else {
		
			res.json({logedin: false});
		
		}

	});

};