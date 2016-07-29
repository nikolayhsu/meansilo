'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope', 'SettingService', 'ModalService'];

    var AdminController = function ($scope, SettingService, ModalService) {
    	$scope.data;

    	$scope.resetForm = function () {
    		getSettings();
    		$scope.form.$setPristine();
    	}

    	$scope.updateSettings = function () {
    		if(!$scope.form.$pristine) {
	    		if($scope.data.FB_ENABLED.setting_value) {
	    			$scope.form.FB_APP_ID.$setDirty();
	    		}

	    		if($scope.data.EMAIL_ENABLED.setting_value) {
	    			$scope.form.EMAIL_ADDRESS.$setDirty();
	    			$scope.form.EMAIL_PASSWORD.$setDirty();
	    		}

	    		if($scope.form.$valid) {
	    			SettingService.setSettings($scope.data, function (response) {
	    				if(response.status && response.status == "OK") {
	    					ModalService.showInfoModal("success", "Update Successful", "YEAH!");
	    					$scope.resetForm();
	    				}
	    			}); 
	    		}
	    	} else {
	    		ModalService.showInfoModal("warning", "No Change Made", "There is no change to update.");
	    	}
    	}

    	var getSettings = function () {
    		SettingService.getSettings(function (data) {
    			$scope.data = angular.copy(data.strSettings);
    		});
    	}

    	getSettings();
    };

    AdminController.$inject = injectParams;

    app.register.controller('AdminController', AdminController);
});