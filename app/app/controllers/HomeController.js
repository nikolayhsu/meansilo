'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = [];

    var HomeController = function () {
    	console.log("HELLO! HOME!");
    };

    HomeController.$inject = injectParams;

    app.register.controller('HomeController', HomeController);
});