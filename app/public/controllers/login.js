var myApp = angular.module( "myApp" , [] );

myApp.controller('loginController' , ['$scope','$http',function($scope , $http){

	$scope.userLogin = function() {
	
		$http.post('/login' , $scope.user).success(function(response){
	
			if ( response.logedin !== undefined && response.logedin == true ) {
		
				window.location.href = '/search';
		
			} else {
		
				// login failure
				$scope.loginAlertStatus = "";
				$("#loginAlertBox").fadeIn();
				
			}
		
		});
	
	};
	
}]);

myApp.directive('pmEnter', function () {
    return function ($scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
            	$scope.$apply(function (){
                    $scope.$eval(attrs.pmEnter);
                });
                event.preventDefault();
            } else {
            	$("#loginAlertBox").fadeOut();
            }
        });
    };
});