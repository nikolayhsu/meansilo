'use strict';

define(['app/js/app.js'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = [];

    var ContactController = function () {
    };

    ContactController.$inject = injectParams;

    app.register.controller('ContactController', ContactController);
});