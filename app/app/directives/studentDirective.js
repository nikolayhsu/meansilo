'use strict';

define(['core/app'], function (app) {

    var msStudent = function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/directives/templates/student.html',
            require: ['ngModel'],
            scope: {
                ngModel: '=',
                selectStudent: '&'
            },

            link: function(scope, element, attributes, ctrls){
                var ngModelCtrl = ctrls[0];

                scope.$watch(function () {                    
                    return ngModelCtrl.$modelValue.selected;
                }, function (selected) {
                    if(selected == undefined)
                        selected = false;

                    element.toggleClass("selected", selected);

                    if(!selected)
                        element.triggerHandler('blur');
                });
            }
        }
    };

    // //Loaded normally since the script is loaded upfront 
    // //Dynamically loaded controller use app.register.controller
    app.directive('msStudent', msStudent);
});