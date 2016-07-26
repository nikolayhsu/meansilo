'use strict';

define(['core/app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view due to convention followed by the routeResolver
    var injectParams = ['$scope', 'StudentService', '$uibModal', 'ModalService', '$location'];

    var StudentsController = function ($scope, StudentService, $uibModal, ModalService, $location) {
    	$scope.mode = '';
    	$scope.isRefreshing = true;
    	$scope.students = [];
    	$scope.student = {};
    	$scope.sort = '';
        $scope.yeargroups;
        
        StudentService.getYearGroups(function (response) {
            $scope.yeargroups = response;
        });

    	$scope.orders = [
    		{
    			value: '',
    			label: '--- Sort By ---'
    		},
    		{
    			value: 'given_name',
    			label: 'Given Name'
    		},
    		{
    			value: 'surname',
    			label: 'Surname'
    		},
    		{
    			value: 'stud_code',
    			label: 'Student Code'
    		},
    		{
    			value: 'gender',
    			label: 'Gender'
    		},
    		{
    			value: 'year_grp',
    			label: 'Year Group'
    		}
    	];

    	var emptyStudent = {
    		stud_code: '',
    		given_name: '',
    		surname: '',
    		gender: '',
    		year_grp: ''
    	};

    	$scope.selectedStudents = {
    		count: 0
    	};

    	$scope.processStudent = function () {
    		var fields = ['stud_code', 'given_name', 'surname',  'gender'];

            for(var x in fields) {
                $scope.form[fields[x]].$setDirty();
            }

            if(!$scope.form.$valid)
            	return;

    		if($scope.mode == 'add') {
	    		StudentService.addStudent($scope.student, function (success) {
		    		if(success) {
		    			$scope.refreshData();
		    			$scope.resetForm();
		    		} else {
                        var message = 'Student code ' + $scope.student.stud_code + ' has been assigned. A student code must be unique.';
                        ModalService.showInfoModal('warning', 'Student Code Taken', message);
                    }  			 			
	    		});
    		}

    		if($scope.mode == 'edit') {
    			StudentService.updateStudent($scope.student, function () {
    				$scope.refreshData();
    				$scope.resetForm();
    			});
  
    		}
    	}

    	$scope.deleteStudents = function () {
    		var message = '';

    		if($scope.selectedStudents.count == 1)
    			message = 'Are you sure you want to delete this student?';
    		else
    			message = 'Are you sure you want to delete these students?';

    		ModalService.showConfirmModal(message, null, function (answer) {
                if(answer) {
                    var deleteList = angular.copy($scope.selectedStudents);

                    if(typeof deleteList.count != 'undefined') {
                        delete deleteList.count;
                    }

                    StudentService.deleteStudent(deleteList, function () {
                        for(var x in deleteList) {
                            delete $scope.students[x];
                        }

                        $scope.refreshData();
                        $scope.resetForm();
                    });
                }
            });
    	}

    	$scope.changeMode = function (mode) {
    		$scope.mode = mode;

    		if(mode == 'edit') {
    			for(var stud_code in $scope.selectedStudents) {
    				if(stud_code == 'count')
    					continue;

    				$scope.student = angular.copy($scope.students[stud_code]);
                    
    				break;
    			}
    		}
    	}

    	$scope.resetForm = function (keepSelection) {
    		$scope.mode = '';
    		$scope.student = angular.copy(emptyStudent);
    		$scope.form.$setPristine();

    		if(!keepSelection) {
	    		for(var stud_code in $scope.selectedStudents) {
	    			if(stud_code == 'count')
	    				continue;

	    			if($scope.students[stud_code])
	    				$scope.students[stud_code].selected = false;
	    		}

	    		$scope.selectedStudents = {count: 0};
    		}
    	}

    	$scope.selectStudent = function (stud_code) {
    		if($scope.mode != '')
    			$scope.resetForm(true);

    		if($scope.students[stud_code].selected == undefined) {
    			$scope.students[stud_code].selected = true;
    		} else {
    			$scope.students[stud_code].selected = !$scope.students[stud_code].selected;
    		}

    		if($scope.students[stud_code].selected && !$scope.selectedStudents[stud_code]) {
    			$scope.selectedStudents[stud_code] = stud_code;
    			$scope.selectedStudents.count++;
    		}

    		if(!$scope.students[stud_code].selected && $scope.selectedStudents[stud_code]) {
    			delete $scope.selectedStudents[stud_code];
    			$scope.selectedStudents.count--;
    		}
    	}

    	$scope.viewStudent = function () {
    		for(var x in $scope.selectedStudents) {
    			if(x == 'count')
    				continue;

    			$location.path('/students/' + x);
    		}
    	}

    	$scope.refreshData = function () {
    		$scope.isRefreshing = true;

    		StudentService.getStudents(function (students) {
    			$scope.isRefreshing = false;
    			
                for(var x in students) { 
                    if($scope.students[x] && !angular.equals(students[x], $scope.students[x])) {
                        $scope.students[x] = students[x];
                    }


                    if(!$scope.students[x]) {
                        $scope.students[x] = students[x];
                    }
                }
    		});	
    	}

        $scope.getStudentArray = function (students) {
            var result = [];

            for(var x in students) {
                if(students[x])
                    result.push(students[x]);
            }

            return result;
        }

    	$scope.refreshData();
    };

    StudentsController.$inject = injectParams;

    app.register.controller('StudentsController', StudentsController);
});