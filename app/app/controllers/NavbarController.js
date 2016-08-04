'use strict';

define(['core/app'], function (app) {

    var injectParams = ['$scope', '$location', '$rootScope', 'AuthService', '$interval'];

    var NavbarController = function ($scope, $location, $rootScope, AuthService, $interval) {
        $scope.activeTab = "";
        $scope.active = 'active';
        $scope.fb = "";

        var retrieveImage;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
            var path = [];

            if(toState && toState.url)
                var path = toState.url.split('/');
            
            if(path.length >= 2) {
            	if(path[1] == '')
            		$scope.activeTab = 'home';
            	else
            		$scope.activeTab = path[1];
            } else {
            	$scope.activeTab = "";
            }
        });

        var setFbThumbNail = function (url) {
            if (url && url.length > 0)
                $scope.fb = url;
            else
                $scope.fb = "";

            $scope.$apply();
        }

        var fields = {
            fields: ['picture']
        };

        var getFbImage = function () {
            if($rootScope.isFbInitialised) {
                $interval.cancel(retrieveImage);

                FB.getLoginStatus(function (response) {
                    if (response.status == 'connected') {
                        FB.api(
                            "/me", fields,
                            function (response) {
                                if (response && !response.error) {                        
                                    if(response.picture) {                           
                                        setFbThumbNail(response.picture.data.url);
                                    } else {
                                        setFbThumbNail("");;
                                    }
                                } else {
                                    setFbThumbNail("");
                                }
                            }
                        );
                    }
                });
            }
        }

        AuthService.getLoginStatus(function (user) {
            if(user.logedin && user.facebook_id) {
                retrieveImage = $interval(getFbImage, 1000);
            }
        });        
    };

    NavbarController.$inject = injectParams;

    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    app.controller('NavbarController', NavbarController);

});