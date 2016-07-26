'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver

    var injectParams = ['$scope', '$uibModalInstance'];

    var ForgotPasswordController = function ($scope, $uibModalInstance) {
        $scope.email = "";

    	$scope.ok = function () {
		    $scope.forgotPasswordForm['username'].$setDirty();

            if($scope.forgotPasswordForm.$valid)
                $uibModalInstance.close($scope.email);
		};

		$scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		};
    };

    ForgotPasswordController.$inject = injectParams;

    app.controller('ForgotPasswordModalController', ForgotPasswordController);
});