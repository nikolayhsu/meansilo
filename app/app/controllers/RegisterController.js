'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope','$http', '$location', 'SettingService'];

    var RegisterController = function ($scope,$http, $location, SettingService) {
    	$scope.user = {};
        $scope.result = {
            success: false,
            errorMessage: []
        };
        $scope.isFbEnabled = "";

        SettingService.getSettingById("FB_ENABLED", function (response) {
            $scope.isFbEnabled = response.setting_value;
        });
    	
        $scope.goToLogin = function () {
            $location.path('/login');
        }

        $scope.register = function() {
            var fields = ['username', 'password', 'confirm_password', 'nickname', 'mobile'];

            for(var x in fields) {
                $scope.form[fields[x]].$setDirty();
            }

            if($scope.form.$valid) {
                $http.post('/register' , $scope.user).success(function (response){
                    if ( response ) {                                        
                        $scope.result = response;                  
                    }                
                });
            } else {
                console.log($scope.form);
            }
        };

        $scope.facebookRegister = function () {
            var fields = {
                fields: ['email', 'first_name']
            };

            FB.getLoginStatus(function(response) {
                if(response.status == 'not_authorized') {
                    FB.login(function (response) {
                        if(response.status == 'connected')
                            getFacebookUserData();
                    }, {scope: 'public_profile,email'});
                }

                if(response.status == 'connected') {
                    getFacebookUserData();
                }
            });
        }

        var getFacebookUserData = function () {
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

                $http.post('/register' , params).success(function (response){
                    if ( response ) {                                        
                        window.location.href = '/';                 
                    }                
                });
              }
            });
        }
    };

    RegisterController.$inject = injectParams;

    app.register.controller('RegisterController', RegisterController);
});