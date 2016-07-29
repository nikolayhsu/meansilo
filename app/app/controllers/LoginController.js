'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope','$http', '$location', 'AuthService', 'ModalService', 'SettingService'];

    var LoginController = function ($scope, $http, $location, AuthService, ModalService, SettingService) {

    	$scope.loginSuccess = false;
    	$scope.hasLogedIn = false;
        $scope.isFbEnabled = false;
        
    	AuthService.getLoginStatus(function (response) {
    		if(response.logedin) {
    			$scope.hasLogedIn = true;
    		}
    	});

        SettingService.getSettingById("FB_ENABLED", function (response) {
            $scope.isFbEnabled = response.setting_value;
        });

    	$scope.facebookLogin = function () {
            FB.getLoginStatus(function (response) {
            	if(response.status == 'unknown' || response.status == 'not_authorized') {
            		FB.login(function (response) {
                        if(response.status == 'connected') {
                            var fbUser = {};
		                    fbUser.facebook_id = response.authResponse.userID;
		                    $scope.userLogin(fbUser);
                        }
                    }, {scope: 'public_profile,email'});
            	}

                if(response.status == 'connected') {
                	var fbUser = {};
                    fbUser.facebook_id = response.authResponse.userID;
                    $scope.userLogin(fbUser);
                }
            });
        }

    	$scope.userLogin = function(fbUser) {
    		var user = $scope.user;

    		if(fbUser != undefined)
    			user = fbUser;

			AuthService.login(user, function (response) {
				if ( response.logedin !== undefined && response.logedin == true ) {
					
					window.location.href = '/';
			
				} else {

                    if(fbUser != undefined) {
                        var message = "You have not registered with this Facebook account yet. \
                                        Would you like to register?"

                        var answer = ModalService.showConfirmModal(message, null, function (answer) {
                            if(answer) {
                                var fields = {
                                    fields: ['email', 'first_name']
                                };
                                
                                FB.api('/me', fields, function(response) {
                                      if(response.first_name && response.email && response.id) {
                                        var params = {
                                            facebook_id: response.id,
                                            nickname: response.first_name,
                                            username: response.email
                                        };

                                        $http.post('/register' , params).success(function (response) {                                            
                                            if ( response ) {                                        
                                                window.location.href = '/';                 
                                            }                
                                        });
                                      }
                                });
                            }
                        });
                    } else {
                        $scope.loginSuccess = !response.logedin;
                    }
				}
			});				
		}

		$scope.toRegister = function () {
			$location.path('/login/register');
		}

        $scope.showForgotPasswordModal = function () {
            ModalService.showForgotPasswordModal(null, function (result) {
                var params = {};
                params.username = result;

                $http.post('/forgotpassword' , params).success(function (response){
                    if (response) {                                        
                        if(response.success) {
                            var title = "Email Sent";
                            ModalService.showInfoModal("success", title, response.message);
                        } else {
                            var title = "Oops!";
                            ModalService.showInfoModal("danger", title, response.message, null, function () {
                                $scope.showForgotPasswordModal();
                            });
                        }                  
                    }                
                });
            });
        }
    };

    LoginController.$inject = injectParams;

    app.register.controller('LoginController', LoginController);
});