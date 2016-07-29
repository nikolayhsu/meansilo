require.config({
    paths: {
        'core': '/app/core',
        'services': '/app/services',
        'controllers': '/app/controllers',
        'directives': '/app/directives',
        'filters': '/app/filters'
    },
    urlArgs: 'v=1.0'
});

require(
    [
        'core/app',
        'core/config',
        'core/routeResolver',
        'services/AuthService',
        'services/ModalService',
        'services/SettingService',
        'controllers/NavbarController',
        'directives/textInputDirective'
    ],
    function () {
        angular.bootstrap(document, ['meansiloApp']);
    }
);