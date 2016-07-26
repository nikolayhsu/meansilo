'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope', '$routeParams', 'StudentService', 'ModalService', '$location'];

    var StudentDetailController = function ($scope, $routeParams, StudentService, ModalService, $location) {
    	
        StudentService.getStudent($routeParams.stud_code, function (student) {
            if(student && student.stud_code) {
                $scope.student = student;
            } else {
                var message = 'Student ' + $routeParams.stud_code + ' is not found.';
                ModalService.showInfoModal('warning', 'Student Not Found', message, null, function() {
                    $location.path('/students');
                });
            }            
        })
    };

    StudentDetailController.$inject = injectParams;

    app.register.controller('StudentDetailController', StudentDetailController);
});