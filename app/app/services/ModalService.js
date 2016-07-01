'use strict';

define(['app/js/app.js',
        'app/controllers/modal/ConfirmModalController.js',
        'app/controllers/modal/ForgotPasswordController.js',
        'app/controllers/modal/InfoModalController.js'], function (app) {
    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$uibModal'];

    var ModalService = function ($uibModal) {
        var service = {};

        service.showConfirmModal = function (message, size, callback) {
            var _message = message;

            var modalInstance = $uibModal.open({
                                    templateUrl: '/app/views/modal/confirmModal.html',
                                    controller: 'ConfirmModalController',
                                    size: size,
                                    resolve: {
                                        message: function () {
                                            return _message;
                                        }
                                    }
                                });

            modalInstance.result.then(function (answer) {
                if(callback)    
                    callback(answer);
            });
        }

        service.showInfoModal = function (type, title, message, size, callback) {
            var _message = message;
            var _type = type;

            var modalInstance = $uibModal.open({
                                    templateUrl: '/app/views/modal/infoModal.html',
                                    controller: 'InfoModalController',
                                    size: size,
                                    resolve: {
                                        type: function () {
                                            return _type;
                                        },
                                        title: function () {
                                            return title;
                                        },
                                        message: function () {
                                            return _message;
                                        }
                                    }
                                });

            modalInstance.result.then(function (answer) {
                if(callback)
                    callback(answer);
            });
        }

        service.showForgotPasswordModal = function (size, callback) {
            var modalInstance = $uibModal.open({
                                    templateUrl: '/app/views/modal/forgotPasswordModal.html',
                                    controller: 'ForgotPasswordModalController',
                                    size: size
                                });

            modalInstance.result.then(function (answer) {
                if(callback)
                    callback(answer);
            });
        }        

        return service;
    };

    ModalService.$inject = injectParams;

    app.service('ModalService', ModalService);
});