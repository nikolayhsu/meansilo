'use strict';

define(['core/app'], function (app) {
    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$http', '$location'];

    var SettingService = function ($http, $location) {
        var factory = {};

        factory.getSettings = function (callback) {
            $http.post('/setting/getSetting').success(function (response){
                if(response.status == "OK" && callback) {
                    callback(response.data);
                }                
            });
        }

        factory.getSettingById = function (setting_id, callback) {
            var params = {
                setting_id: setting_id
            }

            $http.post('/setting/getSetting', params).success(function (response){
                if(response.status == "OK" && callback) {
                    callback(response.setting);
                }                
            });
        }

    	factory.setSettings = function (settings, callback) {
            var params = {settings: settings};

            $http.post('/setting/setSettings', params).success(function (response) {
                if(callback)
                    callback(response);
            });
        }
        
        return factory;
    };

    SettingService.$inject = injectParams;

    app.factory('SettingService', SettingService);
});