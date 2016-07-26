'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope', 'StudentService', 'ModalService'];

    var AdminController = function ($scope, StudentService, ModalService) {
    	var _yeargroups;
        $scope.yeargroups;

        StudentService.getYearGroups(function (response) {
    		_yeargroups = response;
            $scope.yeargroups = angular.copy(response);
    	});

        $scope.updateYearGroups = function () {
            StudentService.updateYearGroups($scope.yeargroups, function (response) {
                _yeargroups = response;
                $scope.yeargroups = angular.copy(response);
                ModalService.showInfoModal('success', 'Update Success', 'YEAH!');
            });
        }

        $scope.resetForm = function () {
            $scope.yeargroups = angular.copy(_yeargroups);
        }
    };

    AdminController.$inject = injectParams;

    app.register.controller('AdminController', AdminController);
});