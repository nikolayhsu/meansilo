require.config({
    baseUrl: '/app/js',
    urlArgs: 'v=1.0'
});

require(
    [
        '/app/js/app.js',
        '/app/js/config.js',
        '/app/js/routeResolver.js',
        '/app/services/AuthService.js',
        '/app/services/ModalService.js',
        '/app/controllers/NavbarController.js',
        '/app/directives/directives.js'
    ],
    function () {
        angular.bootstrap(document, ['meansiloApp']);
    }
);