'use strict';

define(['app/js/app.js'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver

    var injectParams = ['$scope', '$uibModalInstance', 'type', 'title', 'message'];

    var InfoModalController = function ($scope, $uibModalInstance, type, title, message) {
    	$scope.title = title;
        $scope.message = message;
        $scope.type = type;

    	$scope.ok = function () {
		    $uibModalInstance.close();
		};
    };

    InfoModalController.$inject = injectParams;

    app.controller('InfoModalController', InfoModalController);
});