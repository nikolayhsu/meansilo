'use strict';

define(['app/js/routeResolver.js'], function () {

    var app = angular.module('meansiloApp', ['ngRoute','routeResolverServices', 'ngAnimate', 'ngTouch', 'ui.bootstrap']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$locationProvider',
                '$compileProvider', '$filterProvider', '$provide',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $locationProvider,
                  $compileProvider, $filterProvider, $provide) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');
            // $locationProvider.html5Mode({ enabled: true,
            //                               requireBase: true});

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                .when('/', { redirectTo: '/home' })
                .when('/home', route.resolve('Home'))
                .when('/about', route.resolve('About'))
                .when('/contact', route.resolve('Contact'))
                .when('/login', route.resolve('Login'))
                .when('/login/register', route.resolve('Register'))
                .when('/resetpassword/:user/:token', route.resolve('ResetPassword'))
                .when('/admin', route.resolve('Admin', 'admin/', true))
                .when('/users', route.resolve('Users', 'admin/', true))
                .when('/403', route.resolve('403'))
                .when('/404', route.resolve('404'))
                .otherwise({ redirectTo: '/404' });

    }]);

    app.run(['$q',  '$rootScope', '$location', '$window', 'AuthService', 
        function ($q,  $rootScope, $location, $window, AuthService) {            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked                

            $rootScope.$on("$routeChangeError", function (event, next, current) {
                $location.path('/');
            });

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!AuthService.user.logedin) {
                        AuthService.redirectToLogin();
                    } else if (AuthService.user.logedin && AuthService.user.userlevel > 1) {                            
                        $location.path("/403");
                    }
                }
            });

            var _appId = '1743360979275241';
            var _channelUrl = 'app/views/channel.html';

            $window.fbAsyncInit = function() {
                // Executed when the SDK is loaded

                FB.init({
                    appId: _appId,
                    channelUrl: _channelUrl,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.6'
                });
            }

            (function(d){
              // load the Facebook javascript SDK

                var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

                if (d.getElementById(id)) {
                  return;
                }

                js = d.createElement('script');
                js.id = id;
                js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";

                ref.parentNode.insertBefore(js, ref);

            }(document));
        }
    ]);

    return app;
    
});