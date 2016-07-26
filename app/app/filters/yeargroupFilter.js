'use strict';

define(['core/app'], function (app) {

    var injectParams = ['StudentService'];

    var yeargroupFilter = function (StudentService) {

        var findTranslation = function (yeargroups, yeargroup) {
            for(var i = 0; i < yeargroups.length; i++) {
                if(yeargroup == yeargroups[i].year_grp) {
                    return yeargroups[i].year_grp_desc;
                }
            }

            return yeargroup;
        }

        return function (yeargroup) {
            if(yeargroup == undefined || yeargroup == '')
                return '';

            return StudentService.getYearGroups(function (yeargroups) {
                return findTranslation(yeargroups, yeargroup);
            });
        }
    };

    yeargroupFilter.$inject = injectParams;

    // //Loaded normally since the script is loaded upfront 
    // //Dynamically loaded controller use app.register.controller
    app.filter('yeargroup', yeargroupFilter);
});
