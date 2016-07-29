'use strict';

define(['core/app'], function (app) {

    var injectParams = ['$scope', '$location', '$rootScope', 'AuthService', '$interval'];

    var NavbarController = function ($scope, $location, $rootScope, AuthService, $interval) {
        $scope.activeTab = "";
        $scope.active = 'active';
        $scope.fb = "";

        var retrieveImage;

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            var path = [];

            if(next.$$route && next.$$route.originalPath)
                var path = next.$$route.originalPath.split('/');
            
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