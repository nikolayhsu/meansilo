'use strict';

define(['core/app'], function (app) {

    var msTextInput = function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/directives/templates/textinput.html',
            require: ['ngModel', '^form'],
            scope: {
                type: '@',
                msId: '@',
                msName: '@',
                msRequired: '@',
                msDisabled: '=',
                mask: '@',
                label: '@',
                placeholder: '@',
                labelLength: '@',
                inputLength: '@',
                ngMaxlength: '=',
                ngMinlength: '=',
                ngModel: '='
            },

            link: function(scope, element, attributes, ctrls){
                var regex = '';
                var negRegex = '';
                var ngModelCtrl = ctrls[0];
                var formCtrl = ctrls[1];

                if(scope.type == undefined)
                    scope.type = 'text';

                switch(scope.mask) {
                    case 'alphanumeric':
                        regex = /[0-9a-zA-Z]$/;
                        negRegex = /[^0-9a-zA-Z]/g;
                        break;
                    case 'mobile' :
                        regex = /[0-9]$/;
                        negRegex = /[^0-9]/g;
                        break;
                    case 'password' :
                        regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
                        negRegex = '';

                }

                element.bind("keypress", function (event) {
                    // if(!scope.mask)
                    //     return;

                    if(scope.mask == 'password')
                        return;

                    var _event = event;
                    var key = _event.keyCode || _event.which;
                    
                    key = String.fromCharCode(key);
          
                    if((scope.mask && !regex.test(key)) || valueInvalid()) {
                        _event.returnValue = false;

                        if (_event.preventDefault)
                            _event.preventDefault();
                    }
                });

                element.bind("paste change", function (event) {
                    if(event.type == "paste")
                        var text = event.clipboardData.getData('Text');
                   
                    if(event.type == "change")
                        var text = event.srcElement.value;

                   if(!text || text.length == 0)
                        return;

                   var transformedInput = text.replace(negRegex, '');
                   
                   if(scope.ngMaxlength) {
                        transformedInput = transformedInput.substring(0,scope.ngMaxlength);
                   }

                   if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();

                        if (event.preventDefault)
                            event.preventDefault();
                    }
                }); 

                function valueInvalid() {
                    if(ngModelCtrl.$viewValue == undefined)
                        return false;

                    if(scope.ngMaxlength) {
                        var value = ngModelCtrl.$viewValue;

                        if(angular.isNumber(value))
                            value = value.toString();

                        return value.length == scope.ngMaxlength;
                    }

                    return false;
                }

                function getErrorMessage(error) {
                    var message = "";

                    if (!error)
                        return message;

                    for(var x in error) {
                        switch(x) {
                            case 'required':
                                message = 'The field is required. '
                                break;
                            case 'minlength':
                                message += 'The field should contain at least ' + scope.ngMinlength + ' characters. '; 
                                break;
                            case 'email':
                                message += 'Invalid email. '
                                break; 
                            case 'password':
                                message += 'Invalid password: a password should include at least 1 uppercase character, 1 lowercase character and 1 digit. '                       
                                break;
                            case 'confirm':
                                message += 'Mismatched ' + scope.msName.split('_')[1] + '. ';
                                break;
                        }

                        if(x == 'required')
                            break;
                    }
                    
                    return message;
                }

                scope.$watch(function() {
                    var invalid = "NONE";

                    if(scope.mask == 'password') {                        
                        formCtrl[scope.msName].$setValidity("password", !(!regex.test(ngModelCtrl.$viewValue) && formCtrl[scope.msName].$dirty));
                    }

                    if(scope.msName.split('_').length == 2 && scope.msName.split('_')[0] == 'confirm' && formCtrl[scope.msName].$viewValue != '') {

                        formCtrl[scope.msName].$setValidity("confirm", (formCtrl[scope.msName].$dirty && !(formCtrl[scope.msName].$viewValue != formCtrl[scope.msName.split('_')[1]].$viewValue)));
                    }

                    if(formCtrl[scope.msName].$dirty && formCtrl[scope.msName].$error) {
                        for (var x in formCtrl[scope.msName].$error) {
                            invalid += x;
                        }

                        return invalid;
                    }

                    return invalid;

                }, function(invalid) {
                    if(invalid != "NONE") {
                        scope.error = getErrorMessage(formCtrl[scope.msName].$error);
                    } else {
                        scope.error = "";
                    }

                    element.toggleClass('has-error', invalid != "NONE");
                });                
            }
        }
    };

    // //Loaded normally since the script is loaded upfront 
    // //Dynamically loaded controller use app.register.controller
    app.directive('msTextInput', msTextInput);
});