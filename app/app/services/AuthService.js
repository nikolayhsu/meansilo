'use strict';

define(['core/app'], function (app) {
    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$http', '$location'];

    var AuthService = function ($http, $location) {
        var factory = {};

        factory.user = {
            logedin: false
        };

    	factory.getLoginStatus = function (callback) {
            $http.get('/getLoginStatus').success(function (response){
                if(response && response.logedin) {
                    factory.user = response;
                }

                if(callback) {
                    callback(response);
                }                
            });
        };

        factory.login = function (user, callback) {
            $http.post('/login' , user).success(function (response){
                if(response && response.logedin) {
                    factory.user = response;
                }

                callback(response);                    
            }); 
        };

        factory.redirectToLogin = function () {
            $location.path('/login');
        }

        factory.getLoginStatus();

        return factory;
    };

    AuthService.$inject = injectParams;

    app.factory('AuthService', AuthService);
});