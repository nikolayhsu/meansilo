'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = [];

    var AboutController = function () {
    	console.log("HELLO!");
    };

    AboutController.$inject = injectParams;

    app.register.controller('AboutController', AboutController);
});