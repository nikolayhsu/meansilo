'use strict';

define(['app/js/app.js'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver

    var injectParams = ['$scope', '$uibModalInstance', 'message'];

    var ConfirmModalController = function ($scope, $uibModalInstance, message) {
    	$scope.message = message;

    	$scope.ok = function () {
		    $uibModalInstance.close(true);
		};

		$scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		};
    };

    ConfirmModalController.$inject = injectParams;

    app.controller('ConfirmModalController', ConfirmModalController);
});