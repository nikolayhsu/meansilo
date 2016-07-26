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
        'services/StudentService',
        'controllers/NavbarController',
        'directives/textInputDirective',
        'directives/studentDirective',
        'filters/yeargroupFilter'
    ],
    function () {
        angular.bootstrap(document, ['meansiloApp']);
    }
);