// Handles requests in regard to authentication

var student = this;

// Dependencies
var db = require('../dbAccess');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var secret = "fjsljfDsffERW1231597RoiuvoDFA2";

exports.getStudents = function (req, res) {
	var result = {
		status: 'OK'
	};

	db.db().collection('students').find(null, function (err, students) {
		if(err) {
			console.log(err);
		} else {
			var studentsStr = {};
		
			for(var i = 0; i < students.length; i++) {
				studentsStr[students[i].stud_code] = students[i];
			}

			res.json(studentsStr);
		}
	});
}

exports.getStudent = function (req, res) {
	db.db().collection('students').findOne(req.body, function (err, student) {
		if(err) {
			console.log(err);
		} else {
			res.json(student);
		}
	});
}

exports.updateStudent = function (req, res) {
	var result = {
		status: 'OK'
	};

	var student = req.body;
	var combo = {
		"stud_code": student.stud_code
	}

	if(student._id)
		delete student._id;

	if(student.selected)
		delete student.selected;

	db.db().collection('students').update(
		combo,
		student,
		{ upsert: true 
		}, function (err) {
			res.json(result);
		} 
	);
}

exports.deleteStudent = function (req, res) {
	var result = {
		status: 'OK'
	};

	if(typeof req.body.deleteList == 'object') {
		var studCodeArr = [];

		for(var x in req.body.deleteList) {
			studCodeArr.push(x);
		}
		var combo = {'stud_code': {'$in': studCodeArr}};
	}

	if(typeof req.body.deleteList == 'string') {
		var combo = {'stud_code': req.body.deleteList};
	}

	console.log(combo);

	db.db().collection('students').remove(combo, false, function (err) {
		console.log(err);
		res.json(result);
	});
}

exports.getYearGroups = function (req, res) {
	var result = {
		status: 'OK'
	};

	db.db().collection('yeargroups').find().sort({
			year_grp: 1
		}, function (err, yeargroups) {
			if(err) {
				console.log(err);
			} else {
				res.json(yeargroups);
			}
		}
	);
}

exports.updateYearGroups = function (req, res) {
	var result = {
		status: 'OK'
	};

	var _yeargroups = req.body.yeargroups;	

	if(typeof _yeargroups == 'undefined' || _yeargroups == 0) {
		result.status = 'NO';
		res.json(result);
	} else {
		for(var i = 0; i < _yeargroups.length; i++) {
			var combo = {};
			combo.year_grp = _yeargroups[i].year_grp;

			var yeargroup = _yeargroups[i];
			yeargroup.year_grp = parseInt(yeargroup.year_grp);
			delete yeargroup._id;

			db.db().collection('yeargroups').update(
				combo,
				yeargroup,
				{ upsert: true 
				}, function (err) {
					if(err) {
						console.log(err);
					}
				} 
			);
		}

		res.json(result);
	}
}