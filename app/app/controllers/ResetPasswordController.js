'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope', '$stateParams', '$http', '$location', 'AuthService', 'ModalService'];

    var ResetPasswordController = function ($scope, $stateParams, $http, $location, AuthService, ModalService) {
    	$scope.result = {
    		success: false
    	}
        
    	$scope.resetPassword = function () {
    		$scope.resetPasswordForm['password'].$setDirty();
    		$scope.resetPasswordForm['confirm_password'].$setDirty();

    		if($scope.resetPasswordForm.$valid) {
    			var params = {};
    			params.user = $stateParams.user;
    			params.token = $stateParams.token;
    			params.password = $scope.password;

    			$http.post('/resetpassword' , params).success(function (response){
                    if (response) {                                        
                        if(response.success) {
                        	var title = "Reset Successful";
                        	var message = "You have reset the password. Please use it to log in."
                        	ModalService.showInfoModal("success", title, message, null, function() {
                        		$location.path('/login');
    						});
                        } else {
                        	var title = "Reset Failed";
                        	ModalService.showInfoModal("danger", title, response.message, null, function() {
                        		return;
    						});
                        }              
                    }                
                });
    		}
    	}
    };

    ResetPasswordController.$inject = injectParams;

    app.register.controller('ResetPasswordController', ResetPasswordController);
});