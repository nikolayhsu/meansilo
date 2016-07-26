'use strict';

define(['core/app'], function (app) {
    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$http', '$location'];

    var StudentService = function ($http, $location) {
        var factory = {};

        factory.students = [];
        factory.yeargroups;

        factory.getStudents = function (callback) {
            $http.post('/students/getStudents', null).success(function (response){
                factory.students = response;

                if(callback)
                    callback(response);              
            });
        }

        factory.getYearGroups = function (callback) {
            if(!factory.yeargroups) {
                $http.post('/students/getYearGroups', null).success(function (response){
                    factory.yeargroups = response;

                    if(callback)
                        return callback(response);              
                });
            } else {
                if(callback)
                    return callback(factory.yeargroups);
            }
        }

        factory.updateYearGroups = function (yeargroups, callback) {
            var param = {};
            param.yeargroups = yeargroups;
            $http.post('/students/updateYearGroups', param).success(function (response){
                factory.yeargroups = null;
                factory.getYearGroups(callback);              
            });
        }

        factory.getStudent = function (stud_code, callback) {
            var param = {};
            param.stud_code = stud_code;

            $http.post('/students/getStudent', param).success(function (response){
                if(callback)
                    callback(response);              
            });
        }

        factory.addStudent = function (student, callback) {
            if(student.stud_code == undefined || student.stud_code.trim() == '') {
                callback(false);
                return;
            }

            if(factory.findStudent(student.stud_code) > -1) {
                callback(false);
                return;
            }

            student.year_grp = parseInt(student.year_grp);
            
            $http.post('/students/updateStudent', student).success(function (response){
                if(callback)
                    callback(true);            
            });
        };

        factory.findStudent = function (stud_code) {
            for(var i in factory.students) {
                if(stud_code == factory.students[i].stud_code)
                    return i;
            }

            return -1;
        }

        factory.updateStudent = function (student, callback) {
            student.year_grp = parseInt(student.year_grp);
            
            var _student = {};

            for(var x in student) {
                if(x == 'selected')
                    continue;

                _student = student[x];
            }

            $http.post('/students/updateStudent', student).success(function (response){
                if(callback)
                    callback();             
            });
        };

        factory.deleteStudent = function (deleteList, callback) {
            var param = {};
            param.deleteList = deleteList;

            $http.post('/students/deleteStudent', param).success(function (response){
                if(callback)
                    callback();             
            });
        };

        // factory.getYearGroups = function () {
        //     var yeargroups = [];

        //     for(var i = -1; i <= 12; i++) {
        //         var yeargroup = {};
        //         yeargroup.value = i;

        //         if(i == -1)
        //             yeargroup.label = 'K';
        //         else if(i == 0)
        //             yeargroup.label = 'P';
        //         else
        //             yeargroup.label = i;

        //         yeargroups.push(yeargroup);
        //     }

        //     return yeargroups;
        // }

        return factory;
    };

    StudentService.$inject = injectParams;

    app.factory('StudentService', StudentService);
});